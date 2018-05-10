import { DataBase } from "./database";
import { TableHelper } from "./table_helper";
import { Table } from "./table";
export declare class DbHelper {
    name: string;
    tables: Table[];
    constructor(dataBase: DataBase);
    createMetaData(callBack: (tablesMetaData: TableHelper[]) => void): void;
}
