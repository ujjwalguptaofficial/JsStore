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
import { TABLE_STATE } from "./enums";
import { LogHelper, getError, promiseReject, variableFromPath, userDbSchema, getLength } from "@worker/utils";

export class QueryManager {
    util: IDBUtil;
    db: DbMeta;

    middlewares: string[] = [];

    private onQryFinished;

    protected get logger() {
        return this.util.logger;
    }

    constructor(fn?: (result: any) => void) {
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
                return userDbSchema(db)
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

    executeQuery(request: WebWorkerRequest) {
        let queryResult: Promise<any>;
        const query = request.query;
        switch (request.name) {
            case API.OpenDb:
                queryResult = this.openDb(query);
                break;
            case API.InitDb:
                queryResult = this.initDb(query);
                break;
            case API.CloseDb:
                queryResult = this.closeDb();
                break;
            case API.Insert:
                queryResult = new Insert(query, this.util).
                    execute(this.db);
                break;
            case API.Select:
                queryResult = new Select(query, this.util).
                    execute(this.db);
                break;
            case API.Count:
                queryResult = new Count(query, this.util).execute(this.db);
                break;
            case API.Update:
                queryResult = new Update(query, this.util).execute(this.db);
                break;
            case API.Intersect:
                queryResult = new Intersect(query, this.util).execute(this.db);
                break;
            case API.DropDb:
                queryResult = this.dropDb();
                break;
            case API.Terminate:
                queryResult = this.terminate();
                break;
            case API.Union:
                queryResult = new Union(query, this.util).execute(this.db);
                break;
            case API.Remove:
                queryResult = new Remove(query, this.util).execute(this.db);
                break;
            case API.Clear:
                queryResult = new Clear(query, this.util).execute(this.db);
                break;
            case API.Transaction:
                queryResult = new Transaction(query, this.util).execute(this.db);
                break;
            case API.Get:
                queryResult = MetaHelper.get(query as string, this.util);
                break;
            case API.Set:
                queryResult = MetaHelper.set(query.key, query.value, this.util);
                break;
            case API.ImportScripts:
                queryResult = this.importScripts_(request);
                break;
            case API.ChangeLogStatus:
                this.logger.status = query;
                queryResult = Promise.resolve();
                break;
            case API.Middleware:
                const value = variableFromPath(query);
                if (!value) {
                    return promiseReject(
                        new LogHelper(ERROR_TYPE.InvalidMiddleware, query)
                    );
                }
                this.middlewares.push(query);
                return promiseResolve();
            default:
                if (process.env.NODE_ENV === 'dev') {
                    console.error('The Api:-' + request.name + ' does not support.');
                }
                queryResult = promiseResolve();
        }
        this.logger.log(`Executing query ${request.name} in web worker`);
        return queryResult;
    }

    private callResultMiddleware(middlewares: any[], result) {
        return promise<any>((res) => {
            let index = 0;
            const lastIndex = (getLength(middlewares) as any) - 1;
            const callNextMiddleware = () => {
                if (index <= lastIndex) {
                    let promiseResult = middlewares[index++](result);
                    if (!promiseResult.then) {
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
        let middlewares = [];
        request.onResult = (cb) => {
            middlewares.push((result) => {
                return cb(result);
            });
        };
        this.executeMiddleware_(request).then(_ => {
            return this.executeQuery(request).then((result) => {
                return this.callResultMiddleware(middlewares, result).then(modifiedResult => {
                    this.returnResult_({
                        result: modifiedResult
                    });
                });
            });
        }).catch(ex => {
            middlewares = [];
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
            this.db = null;
        });
    }

    openDb(query: IDbInfo) {
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
    }

    initDb(dataBase?: IDataBase) {
        if (!IS_IDB_SUPPORTED) {
            return promiseReject(
                new LogHelper(ERROR_TYPE.IndexedDbNotSupported)
            );
        }

        const dbMeta = dataBase ? new DbMeta(dataBase) : this.db;
        this.util = new IDBUtil(dbMeta);
        const upgradeDbSchema = (result) => {
            return promise((res, rej) => {
                MetaHelper.get(MetaHelper.dbSchema, this.util).then((savedDb: DbMeta) => {
                    let shouldReCreateDb = false;
                    let dbVersion;
                    if (savedDb) {
                        dbVersion = savedDb.version;

                        savedDb.tables.forEach((savedTable, index) => {
                            const providedTable = dbMeta.tables[index];

                            if (providedTable) {
                                if (savedTable.version < providedTable.version) {
                                    providedTable.state = TABLE_STATE.Delete;
                                    shouldReCreateDb = true;
                                    if (dbVersion < providedTable.version) {
                                        dbVersion = providedTable.version;
                                    }
                                }
                                else {
                                    providedTable.state = null;
                                }
                            }
                        });
                    }

                    if (shouldReCreateDb) {
                        dbMeta.version = dbVersion;
                        this.terminate().then(_ => {
                            this.util = new IDBUtil(dbMeta);
                            this.util.initDb().then((isCreated) => {
                                res(isCreated);
                            }).catch(rej);
                        });

                        return;
                    }
                    else if (!result) {
                        this.db = savedDb;
                    }
                    res(result);
                });
            });
        };
        return promise<boolean>((res, rej) => {
            this.util.initDb().then((isCreated) => {
                if (isCreated) {
                    return isCreated;
                }
                return upgradeDbSchema(isCreated);
            }).then(result => {
                if (result) {
                    MetaHelper.set(
                        MetaHelper.dbSchema, dbMeta,
                        this.util
                    ).then(() => {
                        this.db = dbMeta;
                        res(true);
                    });
                }
                else {

                    res(false);
                }
            }).catch(rej);
        });
    }




}
