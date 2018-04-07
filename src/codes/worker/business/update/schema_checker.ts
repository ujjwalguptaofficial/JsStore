import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { Column } from "../../model/column";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE } from "../../enums";
import { Util } from "../../util";

export class SchemaChecker {
    table: Table;
    constructor(table: Table) {
        this.table = table;
    }

    check(setValue, tblName) {
        let error: IError = null;
        if (typeof setValue === 'object') {
            if (this.table) {
                // loop through table column and find data is valid
                this.table.columns.every(function (column: Column) {
                    if (error === null) {
                        if (column.name in setValue) {
                            error = this.checkByColumn(column, setValue[column.name]);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }, this);
            }
            else {
                error = new LogHelper(ERROR_TYPE.TableNotExist, { TableName: tblName });
            }
        }
        else {
            error = new LogHelper(ERROR_TYPE.NotObject);
        }
        return error;
    }

    private isNull_(value) {
        return Util.isNull(value);
    }

    private getType_(value) {
        return Util.getType(value);
    }

    private checkByColumn(column, value) {
        let error: IError = null;
        // check not null schema
        if (column._notNull && this.isNull_(value)) {
            error = new LogHelper(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }

        // check datatype
        const type = this.getType_(value);
        if (column._dataType) {
            if (type !== column._dataType && type !== 'object') {
                error = new LogHelper(ERROR_TYPE.BadDataType, { ColumnName: column.name });
            }
        }

        // check allowed operators
        if (type === 'object') {
            const allowedOp = ['+', '-', '*', '/'];
            for (const prop of Object.keys(value)) {
                if (allowedOp.indexOf(prop) < 0 && column._dataType && type !== column._dataType) {
                    error = new LogHelper(ERROR_TYPE.BadDataType, { ColumnName: column.name });
                }
                break;
            }
        }
        return error;
    }
}