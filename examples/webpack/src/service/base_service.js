import * as JsStore from "jsstore";
export class BaseService {
 
    constructor() {
        this.dbName = "Students";
        this.connection = new JsStore.Instance('fuck');
    }

    initDb() {
        this.connection.isDbExist((exist) => {

        });
    }
}