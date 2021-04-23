import { ITable } from "@/main";
import { TColumns } from "@/common";
import { TABLE_STATE } from "@/worker/enums";
import { IColumn } from "@/worker/interfaces";

export class TableMeta {
    name: string;
    columns: IColumn[];
    primaryKey: string;
    state: TABLE_STATE;
    version: number;

    constructor(table: ITable) {
        const columns = [];
        for (const columnName in table.columns) {
            const column: IColumn = table.columns[columnName] as any;
            column.name = columnName;
            columns.push(column);
        }
        this.columns = columns;
        this.name = table.name;
        this.version = table.version == null ? 1 : table.version;
        this.setPrimaryKey_();
        this.setState_();
    }

    private setPrimaryKey_() {
        for (const columnName in this.columns) {
            const column = this.columns[columnName];
            if (column.primaryKey) {
                this.primaryKey = columnName;
                return;
            }
        }
    }

    private setState_() {
        this.state = TABLE_STATE.Create;
    }
}