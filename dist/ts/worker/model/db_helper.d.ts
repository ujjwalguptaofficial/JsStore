import { DataBase } from "./database";
import { TableHelper } from "./table_helper";
import { Table } from "./table";
export declare class DbHelper {
    dbName: string;
    tables: Table[];
    constructor(dataBase: DataBase);
    createMetaData(): Promise<TableHelper[]>;
}
