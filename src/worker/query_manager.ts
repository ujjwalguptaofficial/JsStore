import { WebWorkerRequest, promiseResolve, API, IDataBase, WebWorkerResult, promise, ERROR_TYPE, IDbInfo } from "@/common";
import { DbMeta } from "./model";
import { IDBUtil } from "./idbutil";
import { Insert } from "@executors/insert";
import { IS_WORKER, IS_IDB_SUPPORTED } from "./constants";
import { MetaHelper } from "./meta_helper";
import { Select } from "@executors/select";
import { Count } from "@executors/count";
import { Update } from "@executors/update";
import { Intersect } from "./intersect";
import { DropDb } from "@executors/drop_db";
import { Union } from "./union";
import { Remove } from "@executors/remove";
import { Clear } from "@executors/clear";
import { Transaction } from "@executors/transaction";
import { LogHelper, getError, promiseReject, variableFromPath, userDbSchema, getLength } from "@worker/utils";

export class QueryManager {
    util: IDBUtil;

    get db() {
        return this.util.db;
    }

    middlewares: string[] = [];

    private onQryFinished;

    protected get logger() {
        return this.util.logger;
    }

    constructor(fn?: (result: any) => void) {
        this.util = new IDBUtil();
        this.onQryFinished = IS_WORKER ? (result) => {
            self.postMessage(result);
        } : fn;
    }

    private executeMiddleware_(request: WebWorkerRequest) {
        const lastIndex = (getLength(this.middlewares) as any) - 1;
        if (lastIndex < 0) {
            return promiseResolve();
        }
        const middlewareContext = {};
        const db = this.db;
        Object.defineProperty(middlewareContext, 'database', {
            get() {
                return userDbSchema(db);
            }
        });
        return promise<void>((res) => {
            let index = 0;
            const callNextMiddleware = () => {
                if (index <= lastIndex) {
                    let promiseResult = variableFromPath(this.middlewares[index++])(request, middlewareContext);
                    if (!promiseResult || !promiseResult.then) {
                        promiseResult = Promise.resolve(promiseResult);
                    }
                    promiseResult.then(_ => {
                        callNextMiddleware();
                    });
                }
                else {
                    res();
                }
            };
            callNextMiddleware();
        });
    }

    executeQuery(request: WebWorkerRequest, cb: () => Promise<any>) {
        let queryResult: Promise<any>;
        const query = request.query;
        const ctx = this;
        const idbutil = ctx.util;
        const callAPI = (api: typeof Select, beforeExecute?: () => Promise<any>) => {
            queryResult = new api(query, idbutil).
                execute(beforeExecute);
        };
        switch (request.name) {
            case API.OpenDb:
                cb();
                queryResult = ctx.openDb(query);
                break;
            case API.InitDb:
                cb();
                queryResult = ctx.initDb(query);
                break;
            case API.CloseDb:
                cb();
                queryResult = ctx.closeDb();
                break;
            case API.Insert:
                callAPI(Insert as any, cb);
                break;
            case API.Select:
                callAPI(Select as any, cb);
                break;
            case API.Count:
                callAPI(Count as any, cb);
                break;
            case API.Update:
                callAPI(Update as any, cb);
                break;
            case API.Intersect:
                cb();
                callAPI(Intersect as any);
                break;
            case API.DropDb:
                cb();
                queryResult = ctx.dropDb();
                break;
            case API.Terminate:
                cb();
                queryResult = ctx.terminate();
                break;
            case API.Union:
                cb();
                callAPI(Union as any);
                break;
            case API.Remove:
                callAPI(Remove as any, cb);
                break;
            case API.Clear:
                callAPI(Clear as any, cb);
                break;
            case API.Transaction:
                callAPI(Transaction as any, cb);
                break;
            case API.Get:
                cb();
                queryResult = MetaHelper.get(query as string, idbutil);
                break;
            case API.Set:
                cb();
                queryResult = MetaHelper.set(query.key, query.value, idbutil);
                break;
            case API.ImportScripts:
                cb();
                queryResult = ctx.importScripts_(request);
                break;
            case API.ChangeLogStatus:
                cb();
                ctx.logger.status = query;
                queryResult = Promise.resolve();
                break;
            case API.Middleware:
                cb();
                const value = variableFromPath(query);
                if (!value) {
                    return promiseReject(
                        new LogHelper(ERROR_TYPE.InvalidMiddleware, query)
                    );
                }
                ctx.middlewares.push(query);
                return promiseResolve();
            default:
                if (process.env.NODE_ENV !== 'production') {
                    console.error('The Api:-' + request.name + ' does not support.');
                }
                queryResult = promiseResolve();
        }
        ctx.logger.log(`Executing query ${request.name} in web worker`);
        return queryResult;
    }

    private callMiddleware_(middlewares: any[], result?) {
        return promise<any>((res) => {
            let index = 0;
            const lastIndex = (getLength(middlewares) as any) - 1;
            const callNextMiddleware = () => {
                if (index <= lastIndex) {
                    let promiseResult = middlewares[index++](result);
                    if (!(promiseResult instanceof Promise)) {
                        promiseResult = promiseResolve(promiseResult);
                    }
                    promiseResult.then(modifiedResult => {
                        result = modifiedResult;
                        callNextMiddleware();
                    });
                }
                else {
                    res(result);
                }
            };
            callNextMiddleware();
        });
    }

    run(request: WebWorkerRequest) {
        let onResultCallback = [];
        const beforeExecuteCallback = [];
        request.onResult = (cb) => {
            onResultCallback.push((result) => {
                return cb(result);
            });
        };
        request.beforeExecute = (cb) => {
            beforeExecuteCallback.push((result) => {
                return cb(result);
            });
        };
        this.executeMiddleware_(request).then(_ => {
            return this.executeQuery(request, () => {
                return this.callMiddleware_(beforeExecuteCallback);
            }).then((result) => {
                return this.callMiddleware_(onResultCallback, result).then(modifiedResult => {
                    this.returnResult_({
                        result: modifiedResult
                    });
                });
            });
        }).catch(ex => {
            onResultCallback = [];
            const err = getError(ex);
            const result = {
                error: err
            } as WebWorkerResult;
            this.returnResult_(result);
        });
    }

    private importScripts_(request: WebWorkerRequest) {
        return promise<void>((res, rej) => {
            try {
                importScripts(...request.query);
                res();
            } catch (e) {
                const err = new LogHelper(ERROR_TYPE.ImportScriptsFailed, e.message);
                rej(err);
            }
        });
    }

    private returnResult_(result: WebWorkerResult) {
        this.logger.log(`Query finished inside web worker`);
        if (this.util) {
            this.util.emptyTx();
        }
        this.onQryFinished(result);
    }

    private dropDb() {
        const dbName = this.db.name;
        return this.terminate().then(() => {
            return new DropDb().execute(dbName);
        });
    }

    closeDb() {
        return this.util.close();
    }

    terminate() {
        return this.closeDb().then(() => {
            this.util.db = null;
        });
    }

    openDb(query: IDbInfo) {
        return this.closeDb().then(_ => {
            let pResult: Promise<boolean>;
            if (this.db && query.name === this.db.name) {
                pResult = this.initDb();
            }
            else {
                pResult = this.initDb({
                    name: query.name,
                    tables: [
                    ],
                    version: query.version
                });
            }
            return pResult.then(() => {
                return this.db;
            });
        });
    }

    initDb(dataBase?: IDataBase) {
        if (!IS_IDB_SUPPORTED) {
            return promiseReject(
                new LogHelper(ERROR_TYPE.IndexedDbNotSupported)
            );
        }

        const dbMeta = dataBase ? new DbMeta(dataBase) : this.db;
        if (dbMeta == null) {
            throw new Error(`dbMeta is null`);
        }
        this.util = new IDBUtil();

        return promise<boolean>((res, rej) => {
            this.util.initDb(dbMeta).then((dbInfo) => {
                if (dbInfo.isCreated) {
                    MetaHelper.get(
                        MetaHelper.dbSchema,
                        this.util
                    ).then((dbFromCache: DbMeta) => {
                        if (dbFromCache) {
                            dbFromCache.tables.forEach((tableFromCache) => {
                                const targetTable = dbMeta.tables.find(q => q.name === tableFromCache.name);
                                if (targetTable) {
                                    for (const key in tableFromCache.autoIncColumnValue) {
                                        const savedAutoIncrementValue = tableFromCache.autoIncColumnValue[key];
                                        if (savedAutoIncrementValue) {
                                            targetTable.autoIncColumnValue[key] = savedAutoIncrementValue;
                                        }
                                    }
                                }
                            });
                        }
                        this.util.db = dbMeta;
                        dbInfo.database = userDbSchema(this.db);
                        MetaHelper.set(
                            MetaHelper.dbSchema, dbMeta,
                            this.util
                        ).then(() => {
                            res(dbInfo);
                        });
                    });
                }
                else {
                    MetaHelper.get(
                        MetaHelper.dbSchema,
                        this.util
                    ).then((value: any) => {
                        this.util.db = value;
                        dbInfo.database = userDbSchema(this.db);
                        res(dbInfo);
                    });
                }
            }).catch(rej);
        });
    }
}
