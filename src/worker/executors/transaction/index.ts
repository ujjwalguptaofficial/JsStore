import { Base } from "@executors/base";
import { TranscationQuery, WebWorkerRequest, ERROR_TYPE, promiseAll, SelectQuery, API, InsertQuery, UpdateQuery, RemoveQuery, CountQuery, WebWorkerResult, promise } from "@/common";
import { IDBUtil } from "@worker/idbutil";
import { promiseReject, LogHelper } from "@worker/utils";
import { Insert } from "@executors/insert";
import { Select } from "@executors/select";
import { Count } from "@executors/count";
import { Update } from "@executors/update";
import { Remove } from "@executors/remove";
import { QueryHelper } from "@executors/query_helper";
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

    returned = false;

    constructor(qry: TranscationQuery, util: IDBUtil) {
        super();
        this.query = qry as any;
        this.util = util;
    }

    execute(db: DbMeta) {
        this.db = db;

        const err = this.validate();
        if (err) return promiseReject(
            err
        );
        this.startExecution_()

        return promise<void>((res, rej) => {
            this.onSuccess = (result) => {
                if (this.returned) {
                    console.log("returned true", this.query);
                }
                console.log("returning result", result);
                this.returned = true;
                res(result);
            }
            this.onError = (e) => {
                if (this.returned) {
                    console.log("returned true", this.query);
                }
                console.log("returning error", e);
                this.returned = true;
                rej(e);
            };
        }).then(result => {
            if (process.env.NODE_ENV === 'dev') {
                console.log(`transaction finished`);
            }
            return result;
        })
    }

    validate() {
        const query: TranscationQuery = this.query as any;
        const notExistingTable = this.notExistingTable_(query.tables);
        if (notExistingTable) {
            return new LogHelper(ERROR_TYPE.TableNotExist, { tableName: notExistingTable });
        }
        const methodName = query.method;
        let txLogic = self[methodName];
        if (!txLogic) {
            return new LogHelper(ERROR_TYPE.MethodNotExist, methodName);
        }
    }

    private startExecution_() {
        const query: TranscationQuery = this.query as any;
        const select = (qry: SelectQuery) => {
            return this.pushReq_({
                name: API.Select,
                query: qry
            } as WebWorkerRequest);
        };
        const insert = (qry: InsertQuery) => {
            return this.pushReq_({
                name: API.Insert,
                query: qry
            } as WebWorkerRequest);
        };
        const update = (qry: UpdateQuery) => {
            return this.pushReq_({
                name: API.Update,
                query: qry
            } as WebWorkerRequest);
        };
        const remove = (qry: RemoveQuery) => {
            return this.pushReq_({
                name: API.Remove,
                query: qry
            } as WebWorkerRequest);
        };
        const count = (qry: CountQuery) => {
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
        let txLogic = self[methodName];
        if (process.env.NODE_ENV === 'dev') {
            console.log(`transaction query started`);
        }
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

    private startTx_() {
        try {
            this.isTxStarted_ = true;
            let tableNames = (this.query as any).tables as string[];
            tableNames = tableNames.concat(MetaHelper.tableName)
            console.log("creating tx", this.util.tx);
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
        if (process.env.NODE_ENV === 'dev') {
            console.log(`finished request : ${finisehdRequest.name} `);
        }
        if (finisehdRequest) {
            if (result.error) {
                this.abortTx_("automatic abort of transaction due to error occured");
                if (process.env.NODE_ENV === 'dev') {
                    console.log(`transaction aborted due to error occured`);
                }
                console.warn("err occured", "tx val", this.util.tx);
                console.warn("req queue", this.reqQueue);
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
        console.log("aborting tx", this.util.tx);
        this.util.abortTransaction();
        if (process.env.NODE_ENV === 'dev') {
            console.log(`transaction aborted. Msg : ${msg}`);
        }

    }

    private executeRequest_(request: WebWorkerRequest) {
        this.isQueryExecuting = true;
        let requestObj: IQueryExecutor;
        if (process.env.NODE_ENV === 'dev') {
            console.log(`executing request : ${request.name} `);
        }
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
        requestObj.execute(this.db).then(onReqFinished).catch(err => {
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
        if (process.env.NODE_ENV === 'dev') {
            console.log(`request pushed : ${request.name} with query value - ${JSON.stringify(request.query)}`);
        }
        return promiseObj;
    }

    private processExecutionOfQry_() {
        if (this.isQueryExecuting === false) {
            if (this.reqQueue.length > 0) {
                this.executeRequest_(this.reqQueue[0]);
            }
        }
    }

    // private checkQueries_(requestQueue: WebWorkerRequest[]) {
    //     const queryHelper = new QueryHelper(this.db);
    //     requestQueue.map(request => {
    //         return queryHelper.validate(request.name, request.query);
    //     })
    // }

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