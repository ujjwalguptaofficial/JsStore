import { ITable, IAlterQuery, IColumn, TColumns } from "@/common";

export class TableMeta {
    name: string;
    columns: IColumn[] = [];
    primaryKey: string;
    autoIncColumnValue = {};
    alter?: IAlterQuery;
    keypath: string | string[];

    constructor(table: ITable) {
        this.columns = this.setColumn(table.columns);
        this.name = table.name;
        this.alter = table.alter || {};
    }

    setColumn(tableColumns: TColumns) {
        const columns = [];
        for (const columnName in tableColumns) {
            const column: IColumn = tableColumns[columnName] as any;
            column.name = columnName;
            if (column.autoIncrement) {
                this.autoIncColumnValue[columnName] = 0;
            }
            if (column.primaryKey) {
                this.primaryKey = columnName;
                this.keypath = column.keyPath || columnName;
            }
            column.enableSearch = column.enableSearch == null ? true : column.enableSearch;
            const existingColumnIndex = this.columns.indexOf(q => q.name === columnName);
            if (existingColumnIndex < 0) {
                columns.push(column);
            }
            else {
                const existingColumn = this.columns[existingColumnIndex];
                Object.assign(existingColumn, column);
            }
        }
        return columns;
    }


}
