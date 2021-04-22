import { WebWorkerRequest, API, IDataBase } from "@/common";
import { DbMeta } from "./model";
import { InitDb } from "./init_db";
export class QueryExecutor {
    connection: IDBDatabase;
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
            return result.isCreated;
        })
    }
}
