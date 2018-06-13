import { ITranscationQry, IError, IWebWorkerRequest, ISelect, IRemove, ICount, IUpdate, IInsert } from "../../interfaces";
import { Base } from "../base";
import { IdbHelper } from "../idb_helper";
import * as Select from '../select/index';
import * as Count from '../count/index';
import * as Insert from '../insert/index';
import * as Remove from '../remove/index';
import * as Update from '../update/index';
import { API } from "../../enums";

export class Instance extends Base {
    query: ITranscationQry;
    results;

    constructor(qry: ITranscationQry, onSuccess: (results: any) => void, onError: (err: IError) => void) {
        super();
        qry.abortOnError = qry.abortOnError == null ? true : false;
        this.query = qry;
        this.onError = onError;
        this.onSuccess = onSuccess;
    }

    execute() {
        const requestQueue: IWebWorkerRequest[] = [];
        let isQueryExecuting = false;
        let isTransactionStarted = false;
        const onRequestFinished = (result) => {
            const finisehdRequest = requestQueue.shift();
            if (finisehdRequest) {
                if (this.errorOccured && this.query.abortOnError === true) {
                    abortTransaction();
                }
                else {
                    isQueryExecuting = false;
                    if (finisehdRequest.onSuccess) {
                        finisehdRequest.onSuccess(result);
                    }
                    processExecutionOfQry();
                }
            }

        };
        const abortTransaction = () => {
            this.transaction.abort();
        }
        const executeRequest = (request: IWebWorkerRequest) => {
            isQueryExecuting = true;
            let requestObj;
            switch (request.name) {
                case API.Select:
                    requestObj = new Select.Instance(
                        request.query, onRequestFinished, this.onError.bind(this)
                    );
                    break;
                case API.Insert:
                    requestObj = new Insert.Instance(
                        request.query, onRequestFinished, this.onError.bind(this)
                    );
                    break;
                case API.Update: break;
                case API.Remove: break;
                case API.Count: break;
            }
            requestObj.isTransaction = true;
            requestObj.execute();
        };
        const pushRequest = (request: IWebWorkerRequest) => {
            requestQueue.push(request);
            processExecutionOfQry();
            return new Promise((resolve, reject) => {
                request.onSuccess = (result) => {
                    resolve(result);
                };
                request.onError = (error) => {
                    reject(error);
                };
            });
        };
        const processExecutionOfQry = () => {
            if (requestQueue.length > 0 && isQueryExecuting === false &&
                isTransactionStarted === true) {
                executeRequest(requestQueue[0]);
            }
        };
        const select = (qry: ISelect, onSuccess) => {
            pushRequest({
                name: API.Select,
                onSuccess: onSuccess,
                query: qry
            } as IWebWorkerRequest);
        };
        const insert = (qry: IInsert, onSuccess) => {
            pushRequest({
                name: API.Insert,
                onSuccess: onSuccess,
                query: qry
            } as IWebWorkerRequest);
        };
        const update = (qry: IUpdate, onSuccess) => {
            pushRequest({
                name: API.Update,
                onSuccess: onSuccess,
                query: qry
            } as IWebWorkerRequest);
        };
        const remove = (qry: IRemove, onSuccess) => {
            pushRequest({
                name: API.Remove,
                onSuccess: onSuccess,
                query: qry
            } as IWebWorkerRequest);
        };
        const count = (qry: ICount, onSuccess) => {
            pushRequest({
                name: API.Count,
                onSuccess: onSuccess,
                query: qry
            } as IWebWorkerRequest);
        };

        let txLogic;
        if (this.isString(txLogic)) {
            eval("txLogic =" + this.query.logic);
        }
        else {
            txLogic = this.query.logic;
        }
        txLogic.call(this, this.query.data);
        this.query.data = this.query.logic = null;

        const startTransaction = () => {
            isTransactionStarted = true;
            this.initTransaction_(this.query.tables);
            processExecutionOfQry();
        };
        startTransaction();
    }

    private initTransaction_(tableNames) {
        this.createTransaction(tableNames, this.onTransactionCompleted_.bind(this));
    }

    private onTransactionCompleted_() {
        this.onSuccess(this.results);
    }
}