import { ITable, AlterQuery, IColumn } from "@/common";

export class TableMeta {
    name: string;
    columns: IColumn[];
    primaryKey: string;
    autoIncColumnValue = {};
    alter?: AlterQuery;

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
        this.alter = table.alter || {};
    }


}