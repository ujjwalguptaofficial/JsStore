import {
    TranscationQuery, WebWorkerRequest, SelectQuery, RemoveQuery,
    CountQuery, UpdateQuery, InsertQuery, ERROR_TYPE, API, IError
} from "../../../common/index";
import { Base } from "../base";
import * as Select from '../select/index';
import * as Count from '../count/index';
import * as Insert from '../insert/index';
import * as Remove from '../remove/index';
import * as Update from '../update/index';
import { QueryHelper } from "../query_helper";
import { LogHelper } from "../../log_helper";
import { promise, promiseAll, getAutoIncrementValues } from "../../helpers/index";

export class Instance extends Base {
    query: TranscationQuery;
    results;
    reqQueue: WebWorkerRequest[] = [];
    isQueryExecuting = false;

    isTxStarted_ = false;

    constructor(qry: TranscationQuery, onSuccess: (results: any) => void, onError: (err: IError) => void) {
        super();
        this.query = qry;
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.results = {};
    }

    execute() {
        const notExistingTable = this.getNotExistingTable_(this.query.tables);
        if (notExistingTable != null) {
            this.onError(new LogHelper(ERROR_TYPE.TableNotExist, { tableName: notExistingTable }).get());
            return;
        }
        promiseAll<number>(this.query.tables.map(table => {
            return getAutoIncrementValues(this.getTable(table));
        })).then(results => {
            results.forEach((result: any, index) => {
                QueryHelper.autoIncrementValues[this.query.tables[index]] = result;
            });
            this.startExecution_();
        }).catch(this.onError);
    }

    private startExecution_() {
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
            this.checkQueries_(this.reqQueue).then(_ => {
                this.startTx_();
            }).catch((err) => {
                this.onError(err);
            });
        };
        const methodName = this.query.method
        let txLogic = self[methodName];
        if (!txLogic) {
            return this.onError({
                type: ERROR_TYPE.MethodNotExist,
                message: `method ${methodName} does not exist.`
            })
        }
        txLogic.call(
            this,
            {
                data: this.query.data,
                insert: insert, select: select,
                update: update, remove: remove,
                count: count, setResult: setResult,
                getResult: getResult, abort: abort,
                start: start
            }
        );

        if (process.env.NODE_ENV === 'dev') {
            console.log(`transaction query started`);
        }
    }

    private startTx_() {
        try {
            this.isTxStarted_ = true;
            this.initTx_(this.query.tables);
            this.processExecutionOfQry_();
        }
        catch (ex) {
            this.onExceptionOccured(ex);
        }
    }

    private initTx_(tableNames: string[]) {
        this.createTransaction(tableNames, this.onTxCompleted_.bind(this));
    }

    private onTxCompleted_() {
        if (process.env.NODE_ENV === 'dev') {
            console.log(`transaction finished`);
        }
        this.onSuccess(this.results);
    }

    private onReqFinished_(result) {
        const finisehdRequest = this.reqQueue.shift();
        if (process.env.NODE_ENV === 'dev') {
            console.log(`finished request : ${finisehdRequest.name} `);
        }
        if (finisehdRequest) {
            if (this.error) {
                this.abortTx_("automatic abort of transaction due to error occured");
                if (process.env.NODE_ENV === 'dev') {
                    console.log(`transaction aborted due to error occured`);
                }
                this.onErrorOccured(this.error);
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
        if (this.transaction != null) {
            this.transaction.abort();
            if (process.env.NODE_ENV === 'dev') {
                console.log(`transaction aborted. Msg : ${msg}`);
            }
        }
    }

    private executeRequest_(request: WebWorkerRequest) {
        this.isQueryExecuting = true;
        let requestObj;
        if (process.env.NODE_ENV === 'dev') {
            console.log(`executing request : ${request.name} `);
        }
        const onReqFinished = this.onReqFinished_.bind(this);
        const onError = this.onError.bind(this);
        const query = request.query
        switch (request.name) {
            case API.Select:
                requestObj = new Select.Instance(
                    query, onReqFinished, onError
                );
                break;
            case API.Insert:
                requestObj = new Insert.Instance(
                    query, onReqFinished, onError
                );
                break;
            case API.Update:
                requestObj = new Update.Instance(
                    query, onReqFinished, onError
                );
                break;
            case API.Remove:
                requestObj = new Remove.Instance(
                    query, onReqFinished, onError
                );
                break;
            case API.Count:
                requestObj = new Count.Instance(
                    query, onReqFinished, onError
                );
                break;
        }
        requestObj.isTransaction = true;
        requestObj.execute();
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
                this.error = error;
                reject(error);
            };
        });
        if (this.isTxStarted_ === true) {
            this.checkQueries_([request]).then(() => {
                push();
                this.processExecutionOfQry_();
            }).catch(err => {
                this.error = err;
                this.abortTx_(JSON.stringify(err));
            });
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
        if (this.reqQueue.length > 0 && this.isQueryExecuting === false) {
            this.executeRequest_(this.reqQueue[0]);
        }
    }

    private checkQueries_(requestQueue: WebWorkerRequest[]) {
        return promiseAll(requestQueue.map(request => {
            return new QueryHelper(request.name, request.query).checkAndModify();
        }));
    }

    private getNotExistingTable_(tables: string[]) {
        let invalidTable: string = null;
        tables.every(table => {
            if (this.isTableExist(table) === false) {
                invalidTable = table;
                return false;
            }
            return true;
        });
        return invalidTable;
    }
}