import { WebWorkerRequest, API, IDataBase, InsertQuery, WebWorkerResult, promise, SelectQuery, CountQuery } from "@/common";
import { DbMeta } from "./model";
import { InitDb } from "./init_db";
import { Insert } from "./executors/insert";
import { IDBUtil } from "./idb_util";
import { isWorker } from "./constants";
import { MetaHelper } from "./meta_helper";
import { Select } from "./executors/select";
import { Count } from "./executors/count";
import { Update } from "./executors/update";
import { Intersect } from "./intersect";
import { DropDb } from "./executors/drop_db";
import { Union } from "./union";
import { Remove } from "./executors/remove";

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
                queryResult = this.openDb(request.query);
                break;
            case API.InitDb:
                queryResult = this.initDb(request.query);
                break;
            case API.CloseDb:
                queryResult = this.closeDb();
                break;
            case API.Insert:
                queryResult = this.insert(request.query);
                break;
            case API.Select:
                queryResult = this.select(request.query);
                break;
            case API.Count:
                queryResult = this.count(request.query);
                break;
            case API.Update:
                queryResult = new Update(request.query, this.util).execute(this.db);
                break;
            case API.Intersect:
                queryResult = new Intersect(request.query, this.util).execute(this.db);
                break;
            case API.DropDb:
                queryResult = this.dropDb();
                break;
            case API.Terminate:
                queryResult = this.terminate();
                break;
            case API.Union:
                queryResult = new Union(request.query, this.util).execute(this.db);
                break;
            case API.Remove:
                queryResult = new Remove(request.query, this.util).execute(this.db);
                break;
            default:
                if (process.env.NODE_ENV === 'dev') {
                    console.error('The Api:-' + request.name + ' does not support.');
                }
                queryResult = Promise.resolve();
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
        });
    }

    private returnResult_(result: WebWorkerResult) {
        this.onQryFinished(result);
    }

    private dropDb() {
        const dbName = this.db.name;
        return this.terminate().then(() => {
            return new DropDb().execute(dbName);
        });
        // .then(() => {
        //     return this.terminate();
        // });
    }

    closeDb() {
        if (this.util == null) {
            return Promise.resolve();
        }
        return this.util.close();
        // .then(() => {

        // })
        // // wait for 100 ms before success
        // // sometimes browser takes time to close the connection
        // return promise(res => {
        //     setTimeout(res, 100);
        // });
    }

    terminate() {
        return this.closeDb().then(() => {
            this.db = this.util = null;
        });
    }

    openDb(name: string) {
        let pResult: Promise<boolean>;
        if (this.db && name === this.db.name) {
            pResult = this.initDb();
        }
        pResult = this.initDb({
            name: name,
            tables: [
            ]
        });
        return pResult.then(() => {
            return this.db;
        });
    }

    initDb(dataBase?: IDataBase) {
        const dbMeta = dataBase ? new DbMeta(dataBase) : this.db;
        return promise<boolean>((res) => {
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
        });
    }

    insert(query: InsertQuery) {
        const insert = new Insert(query, this.util);
        return insert.execute(this.db);
    }

    select(query: SelectQuery) {
        const select = new Select(query, this.util);
        return select.execute(this.db);
    }

    count(query: CountQuery) {
        const count = new Count(query, this.util);
        return count.execute(this.db);
    }
}
