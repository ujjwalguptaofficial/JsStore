import * as JsStore from "jsstore";
export class BaseService {

    constructor() {
        this.dbName = "Students";
        this.connection = new JsStore.Instance('fuck');
        this.initDb();
    }

    initDb() {
        this.connection.isDbExist((exist) => {
            if (exist) {
                this.connection.openDb(this.dbName);
            } else {
                this.connection.createDb(this.dbName);
            }
        });
    }

    getStudents() {
        this.connection.select({
            from: 'member',
        })
    }
}