import { WebWorkerRequest, API, IDataBase, InsertQuery, WebWorkerResult } from "@/common";
import { DbMeta } from "./model";
import { InitDb } from "./init_db";
import { Insert } from "./executors/insert";
import { IDBUtil } from "./idb_util";
import { isWorker } from "./constants";
export class QueryExecutor {
    connection: IDBDatabase;
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
            case API.InitDb:
                queryResult = this.initDb(request.query);
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

    initDb(dataBase: IDataBase) {
        const dbMeta = new DbMeta(dataBase);
        return new InitDb(dbMeta).execute().then((result) => {
            this.connection = result.con;
            this.util = new IDBUtil(this.connection);
            this.db = dbMeta;
            return result.isCreated;
        });
    }

    insert(query: InsertQuery) {
        const insert = new Insert(query, this.util);
        return insert.execute(this.db);
    }
}
