module JsStorage {
    export module Model {
        export class DataBase {
            Name: string = "JsStorage";
            Tables: Array<Table> = [];
            constructor(tables: Array<Table>) {
                this.Tables = tables;
            }
        }
    }
}