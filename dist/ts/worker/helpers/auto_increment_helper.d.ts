import { Table } from "../model/index";
export declare const getAutoIncrementValues: (table: Table) => Promise<{
    [columnName: string]: number;
}>;
export declare const setAutoIncrementValue: (table: Table, autoIncrementValue: object) => Promise<{}[]>;
