import { WebWorkerRequest, API, IDataBase, InsertQuery, WebWorkerResult, promise } from "@/common";
import { DbMeta } from "./model";
import { InitDb } from "./init_db";
import { Insert } from "./executors/insert";
import { IDBUtil } from "./idb_util";
import { isWorker } from "./constants";
import { MetaHelper } from "./meta_helper";
export class QueryExecutor {
    util: IDBUtil;
    db: DbMeta;

    private onQryFinished;

    constructor(fn?: (result: any) => void) {
        this.onQryFinished = isWorker ? (result) => {
            self.postMessage(result);
        } : fn;
    }

    run(request: WebWorkerRequest) {
        let queryResult: Promise<any>;
        switch (request.name) {
            case API.OpenDb:
            case API.InitDb:
                queryResult = this.initDb(request.query);
                break;
            case API.CloseDb:
                queryResult = this.closeDb();
                break;
            case API.Insert:
                queryResult = this.insert(request.query);
                break;
            default:
                if (process.env.NODE_ENV === 'dev') {
                    console.error('The Api:-' + request.name + ' does not support.');
                }
                return;
        }
        queryResult.then((result) => {
            this.returnResult_({
                result: result
            });
        }).catch(err => {
            const result = {
                error: err
            } as WebWorkerResult;
            this.returnResult_(result);
        })
    }

    private returnResult_(result: WebWorkerResult) {
        this.onQryFinished(result);
    }

    closeDb() {
        this.util.close();
        return Promise.resolve(true);
    }

    terminate() {
        this.closeDb();
        this.db = this.util = null;
    }

    initDb(dataBase?: IDataBase) {
        const dbMeta = dataBase ? new DbMeta(dataBase) : this.db;
        return promise((res) => {
            new InitDb(dbMeta).execute().then((result) => {
                this.util = new IDBUtil(result.con);
                this.db = dbMeta;
                if (result.isCreated) {
                    MetaHelper.set(
                        MetaHelper.dbSchema, dbMeta,
                        this.util
                    ).then(() => {
                        res(true);
                    });
                }
                else {
                    MetaHelper.get(
                        MetaHelper.dbSchema,
                        this.util
                    ).then((db: DbMeta) => {
                        this.db = db;
                        res(true);
                    });
                }
            });
        })
    }

    insert(query: InsertQuery) {
        const insert = new Insert(query, this.util);
        return insert.execute(this.db);
    }
}
