import { Column } from "./column";
import { ITable, IColumn } from "../interfaces";


export class Table {
    name: string;
    columns: Column[] = [];
    version: number;
    primaryKey: string;

    constructor(table: ITable) {
        this.name = table.name;
        this.version = table.version == null ? 1 : table.version;
        for (const columnName in table.columns) {
            const column = {
                name: columnName
            } as IColumn;

            for (const feature in table.columns[columnName]) {
                const value = table.columns[columnName][feature];
                switch (feature) {
                    case 'primaryKey':
                    case 'autoIncrement':
                    case 'unique':
                    case 'dataType':
                    case 'enableSearch':
                    case 'keyPath':
                    case 'multiEntry':
                    case 'default':
                    case 'notNull':
                        column.default = value; break;
                }
            }
            this.columns.push(new Column(column));
        }
    }
}