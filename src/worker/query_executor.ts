import { WebWorkerRequest, API, IDataBase, InsertQuery } from "@/common";
import { DbMeta } from "./model";
import { InitDb } from "./init_db";
import { Insert } from "./executors/insert";
import { IDBUtil } from "./idb_util";
export class QueryExecutor {
    connection: IDBDatabase;
    util: IDBUtil;
    db: DbMeta;
    run(request: WebWorkerRequest) {
        switch (request.name) {
            case API.InitDb:
                return this.initDb(request.query)
        }
    }

    initDb(dataBase: IDataBase) {
        const dbMeta = new DbMeta(dataBase);
        return new InitDb(dbMeta).execute().then((result) => {
            this.connection = result.con;
            this.util = new IDBUtil(this.connection);
            this.db = dbMeta;
            return result.isCreated;
        })
    }

    insert(query: InsertQuery) {
        const insert = new Insert(query, this.util);
        return insert.execute(this.db);
    }
}
