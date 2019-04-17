import { DataBase } from "./database";
import { Table } from "./table";
export declare class DbHelper {
    dbName: string;
    tables: Table[];
    constructor(dataBase: DataBase);
    createMetaData(): Promise<{}[]>;
}
