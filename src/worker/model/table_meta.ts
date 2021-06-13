import { ITable } from "@/common";
import { IColumn } from "@/worker/interfaces";

export class TableMeta {
    name: string;
    columns: IColumn[];
    primaryKey: string;
    autoIncColumnValue = {};
    upgrade: boolean;

    constructor(table: ITable) {
        const columns = [];
        for (const columnName in table.columns) {
            const column: IColumn = table.columns[columnName] as any;
            column.name = columnName;
            if (column.autoIncrement) {
                this.autoIncColumnValue[columnName] = 0;
            }
            if (column.primaryKey) {
                this.primaryKey = columnName;
            }
            column.enableSearch = column.enableSearch == null ? true : column.enableSearch;
            columns.push(column);
        }
        this.columns = columns;
        this.name = table.name;
        this.upgrade = table.upgrade == null ? true : table.upgrade;
    }


}