import { DataBase } from "./database";
import { TableHelper } from "./table_helper";
import { Table } from "./table";
import { promiseAll } from "../helpers/index";

export class DbHelper {
    dbName: string;
    tables: Table[] = [];

    constructor(dataBase: DataBase) {
        this.dbName = dataBase.name;
        this.tables = dataBase.tables;
    }

    createMetaData() {
        return promiseAll(
            this.tables.map((table) => {
                return new TableHelper(table).createMetaData(this.dbName);
            })
        );
    }
}