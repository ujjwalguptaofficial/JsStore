
import { Column } from "./column";
import { ITable } from "../interfaces";

export class Table implements ITable {
    name: string;
    columns: Column[] = [];
    version: number;
    primaryKey: string;

    constructor(table: ITable) {
        this.name = table.name;
        this.version = table.version == null ? 1 : table.version;
        table.columns.forEach((item) => {
            this.columns.push(new Column(item, table.name));
        });
    }
}