import { Column } from "./column";
import { ITable } from "../interfaces";
export declare class Table {
    name: string;
    columns: Column[];
    version: number;
    primaryKey: string;
    constructor(table: ITable);
}
