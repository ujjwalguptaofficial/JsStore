import { Base } from "./BaseLogic";
import { ITranscationQry, IWebWorkerRequest, ISelect, IInsert, IUpdate, IRemove, ICount } from "../interfaces";
import { db_transaction, createTransaction } from "./MainLogic";
import * as Select from "./Select/main";
import * as Insert from "./Insert/main";

declare var tx_logic;

export class Transaction extends Base {
    _results;

    constructor(qry: ITranscationQry, onSuccess, onError) {
        super();
        qry.AbortOnError = qry.AbortOnError ? qry.AbortOnError : true;
        this._query = qry;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    execute() {
        var request_queue: IWebWorkerRequest[] = [],
            onRequestFinished = function (result) {
                var finisehd_request = request_queue.shift();
                if (finisehd_request) {
                    if (this._errorOccured && this._query.AbortOnError === true) {
                        db_transaction.abort();
                    }
                    else {
                        if (finisehd_request.OnSuccess) {
                            finisehd_request.OnSuccess(result);
                        }
                        if (request_queue.length >= 1) {
                            executeRequest(request_queue[0]);
                        }
                    }
                }
            }.bind(this),
            executeRequest = function (request: IWebWorkerRequest) {
                var request_obj;
                switch (request.Name) {
                    case 'select':
                        request_obj = new Select.Instance(
                            request.Query, onRequestFinished, this._onError.bind(this)
                        );
                        break;
                    case 'insert':
                        request_obj = new Insert.Instance(
                            request.Query, onRequestFinished, this._onError.bind(this)
                        );
                        break;
                    case 'update': break;
                    case 'remove': break;
                    case 'count': break;
                }
                request_obj._isTransaction = true;
                request_obj.execute();
            }.bind(this),
            pushRequest = function (request: IWebWorkerRequest) {
                request_queue.push(request);
                if (request_queue.length === 1) {
                    this.initTransaction(this._query.TableNames);
                    executeRequest(request_queue[0]);
                }
            }.bind(this),
            select = function (qry: ISelect, onSuccess) {
                onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                pushRequest({
                    Name: 'select',
                    OnSuccess: onSuccess,
                    Query: qry
                } as IWebWorkerRequest);
            };
        var insert = function (qry: IInsert, onSuccess) {
            onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
            pushRequest({
                Name: 'insert',
                OnSuccess: onSuccess,
                Query: qry
            } as IWebWorkerRequest);
        };
        var update = function (qry: IUpdate, onSuccess) {
            onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
            pushRequest({
                Name: 'update',
                OnSuccess: onSuccess,
                Query: qry
            } as IWebWorkerRequest);
        };
        var remove = function (qry: IRemove, onSuccess) {
            onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
            pushRequest({
                Name: 'remove',
                OnSuccess: onSuccess,
                Query: qry
            } as IWebWorkerRequest);
        };
        var count = function (qry: ICount, onSuccess) {
            onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
            pushRequest({
                Name: 'count',
                OnSuccess: onSuccess,
                Query: qry
            } as IWebWorkerRequest);
        };

        eval("var tx_logic =" + this._query.Logic);
        tx_logic.call(this, this._query.Data);
        this._query.Data = this._query.Logic = null;
    }

    private initTransaction(tableNames) {
        createTransaction(tableNames, this.onTransactionCompleted.bind(this));
    }

    private onTransactionCompleted() {
        this._onSuccess(this._results);
    }
}