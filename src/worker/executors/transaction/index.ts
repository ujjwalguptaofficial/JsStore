import { Base } from "@executors/base";
import { ITranscationQuery, WebWorkerRequest, ERROR_TYPE, ISelectQuery, API, IInsertQuery, IUpdateQuery, IRemoveQuery, ICountQuery, WebWorkerResult, promise } from "@/common";
import { IDBUtil } from "@worker/idbutil";
import { promiseReject, LogHelper, variableFromPath } from "@worker/utils";
import { Insert } from "@executors/insert";
import { Select } from "@executors/select";
import { Count } from "@executors/count";
import { Update } from "@executors/update";
import { Remove } from "@executors/remove";
import { DbMeta } from "@worker/model";
import { IQueryExecutor } from "@/worker/interfaces";
import { MetaHelper } from "@/worker/meta_helper";

export class Transaction extends Base {
    results = {} as any;
    reqQueue: WebWorkerRequest[] = [];
    isQueryExecuting = false;

    isTxStarted_ = false;

    onSuccess: (result: any) => void;
    onError: (err: LogHelper) => void;

    beforeExecute: () => Promise<void>;

    constructor(qry: ITranscationQuery, util: IDBUtil) {
        super();
        this.query = qry as any;
        this.util = util;
    }

    execute(cb: () => Promise<void>) {
        this.beforeExecute = cb;
        const err = this.validate();
        if (err) return promiseReject(
            err
        );
        this.startExecution_()

        return promise<void>((res, rej) => {
            this.onSuccess = res;
            this.onError = rej;
        }).then(result => {
            this.beforeExecute = null;
            this.log(`transaction finished`);
            return result;
        })
    }

    validate() {
        const query: ITranscationQuery = this.query as any;
        const notExistingTable = this.notExistingTable_(query.tables);
        if (notExistingTable) {
            return new LogHelper(ERROR_TYPE.TableNotExist, { tableName: notExistingTable });
        }
        const methodName = query.method;
        let txLogic = variableFromPath(methodName);
        if (!txLogic) {
            return new LogHelper(ERROR_TYPE.MethodNotExist, methodName);
        }
    }

    private startExecution_() {
        const query: ITranscationQuery = this.query as any;
        const select = (qry: ISelectQuery) => {
            return this.pushReq_({
                name: API.Select,
                query: qry
            } as WebWorkerRequest);
        };
        const insert = (qry: IInsertQuery) => {
            return this.pushReq_({
                name: API.Insert,
                query: qry
            } as WebWorkerRequest);
        };
        const update = (qry: IUpdateQuery) => {
            return this.pushReq_({
                name: API.Update,
                query: qry
            } as WebWorkerRequest);
        };
        const remove = (qry: IRemoveQuery) => {
            return this.pushReq_({
                name: API.Remove,
                query: qry
            } as WebWorkerRequest);
        };
        const count = (qry: ICountQuery) => {
            return this.pushReq_({
                name: API.Count,
                query: qry
            } as WebWorkerRequest);
        };
        const setResult = (key: string, value) => {
            this.results[key] = value;
        };
        const getResult = (key: string) => {
            return this.results[key];
        };
        const abort = (msg: string) => {
            this.abortTx_(msg);
        };

        const start = () => {
            this.startTx_();
        };
        const methodName = query.method
        let txLogic = variableFromPath(methodName);

        this.log(`transaction query started`);

        return txLogic.call(
            this,
            {
                data: query.data,
                insert: insert, select: select,
                update: update, remove: remove,
                count: count, setResult: setResult,
                getResult: getResult, abort: abort,
                start: start
            }
        );
    }

    log(message) {
        this.util.logger.log(message);
    }

    private startTx_() {
        try {
            this.isTxStarted_ = true;
            let tableNames = (this.query as any).tables as string[];
            tableNames = tableNames.concat(MetaHelper.tableName)
            this.util.createTransaction(tableNames).then(_ => {
                this.onSuccess(this.results);
            }).catch(err => {
                this.onError(err);
            })
            return this.processExecutionOfQry_();
        }
        catch (ex) {
            this.onError(this.onException(ex) as any);
        }
    }





    private onReqFinished_(result) {
        const finisehdRequest = this.reqQueue.shift();

        this.log(`finished request : ${finisehdRequest.name} `);

        if (finisehdRequest) {
            if (result.error) {
                this.abortTx_("automatic abort of transaction due to error occured");
                this.log(`transaction aborted due to error occured`);
                this.onError(result.error);
            }
            else {
                this.isQueryExecuting = false;
                if (finisehdRequest.onSuccess) {
                    finisehdRequest.onSuccess(result);
                }
                this.processExecutionOfQry_();
            }
        }
    }

    private abortTx_(msg: string) {
        this.reqQueue = [];
        this.util.abortTransaction();
        this.log(`transaction aborted. Msg : ${msg}`);

    }

    private executeRequest_(request: WebWorkerRequest) {
        this.isQueryExecuting = true;
        let requestObj: IQueryExecutor;
        this.log(`executing request : ${request.name} `);
        const onReqFinished = this.onReqFinished_.bind(this);
        const query = request.query
        switch (request.name) {
            case API.Select:
                requestObj = new Select(
                    query, this.util
                );
                break;
            case API.Insert:
                requestObj = new Insert(
                    query, this.util
                );
                break;
            case API.Update:
                requestObj = new Update(
                    query, this.util
                );
                break;
            case API.Remove:
                requestObj = new Remove(
                    query, this.util
                );
                break;
            case API.Count:
                requestObj = new Count(
                    query, this.util
                );
                break;
        }
        requestObj.isTxQuery = true;
        requestObj.execute(this.beforeExecute).then(onReqFinished).catch(err => {
            const result = {
                error: err
            } as WebWorkerResult;
            onReqFinished(result);
        })
    }

    private pushReq_(request: WebWorkerRequest) {
        const push = () => {
            this.reqQueue.push(request);
        };
        const promiseObj = promise((resolve, reject) => {
            request.onSuccess = (result) => {
                resolve(result);
            };
            request.onError = (error) => {
                reject(error);
            };
        });
        if (this.isTxStarted_ === true) {
            push();
            this.processExecutionOfQry_();
        }
        else {
            push();
        }
        this.log(`request pushed : ${request.name}`);
        return promiseObj;
    }

    private processExecutionOfQry_() {
        if (this.isQueryExecuting === false) {
            if (this.reqQueue.length > 0) {
                this.executeRequest_(this.reqQueue[0]);
            }
        }
    }

    private notExistingTable_(tables: string[]) {
        let invalidTable: string = null;
        tables.every(tableName => {
            const table = this.table(tableName);
            if (table == null) {
                invalidTable = tableName;
                return false;
            }
            return true;
        });
        return invalidTable;
    }
}