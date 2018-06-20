import { Table } from "../../model/table";
import { IError, IColumn } from "../../interfaces";
import { Column } from "../../model/column";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE, DATA_TYPE } from "../../enums";
import { Util } from "../../util";

export class SchemaChecker {
    table: Table;
    constructor(table: Table) {
        this.table = table;
    }

    check(setValue: object, tblName: string) {
        let error: IError = null;
        if (typeof setValue === DATA_TYPE.Object) {
            if (this.table) {
                // loop through table column and find data is valid
                this.table.columns.every((column: Column) => {
                    if (error === null) {
                        if (column.name in setValue) {
                            error = this.checkByColumn_(column, setValue[column.name]);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                error = new LogHelper(ERROR_TYPE.TableNotExist, { TableName: tblName });
            }
        }
        else {
            error = new LogHelper(ERROR_TYPE.NotObject).get();
        }
        return error;
    }

    private isNull_(value) {
        return Util.isNull(value);
    }

    private getType_(value) {
        return Util.getType(value);
    }

    private checkByColumn_(column: IColumn, value) {
        let error: IError = null;
        // check not null schema
        if (column.notNull && this.isNull_(value)) {
            error = new LogHelper(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }

        // check datatype
        const type = this.getType_(value);
        if (column.dataType) {
            if (type !== column.dataType && type !== 'object') {
                error = new LogHelper(ERROR_TYPE.BadDataType, { ColumnName: column.name });
            }
        }

        // check allowed operators
        if (type === 'object') {
            const allowedOp = ['+', '-', '*', '/'];
            for (const prop of Object.keys(value)) {
                if (allowedOp.indexOf(prop) < 0 && column.dataType && type !== column.dataType) {
                    error = new LogHelper(ERROR_TYPE.BadDataType, { ColumnName: column.name });
                }
                break;
            }
        }
        return error;
    }
}