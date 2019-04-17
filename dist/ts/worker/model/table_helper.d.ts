import { Table } from "./table";
import { Column } from "./column";
export declare class TableHelper {
    name: string;
    columns: Column[];
    primaryKey: string;
    version: number;
    requireDelete: boolean;
    requireCreation: boolean;
    private callback_;
    constructor(table: Table);
    createMetaData(dbName: string): Promise<TableHelper>;
    private setPrimaryKey_;
    private setRequireDelete_;
    private setDbVersion_;
}
