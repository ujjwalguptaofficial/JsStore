import { Table } from "./table";
import { Column } from "./column";
export declare class TableHelper {
    name: string;
    columns: Column[];
    primaryKey: string;
    version: number;
    requireDelete: boolean;
    requireCreation: boolean;
    callback: () => void;
    constructor(table: Table);
    createMetaData(dbName: string, callBack: () => void): void;
    private setPrimaryKey_();
    private setRequireDelete_(dbName);
    private setDbVersion_(dbName);
}
