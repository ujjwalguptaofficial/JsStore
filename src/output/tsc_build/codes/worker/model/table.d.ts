import { ITable } from "../interfaces";
import { Column } from "./column";
export declare class Table implements ITable {
    name: string;
    columns: Column[];
    version: number;
    primaryKey: string;
    constructor(table: ITable);
}
