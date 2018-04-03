import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { Column } from "../../model/column";
import { LogHelper } from "../../log_helper";
import { Error_Type } from "../../enums";
import { Util } from "../../util";

export class SchemaChecker {
    _table: Table;
    constructor(table: Table) {
        this._table = table;
    }

    check(setValue, tblName) {
        var error: IError = null;
        if (typeof setValue === 'object') {
            if (this._table) {
                // loop through table column and find data is valid
                this._table._columns.every(function (column: Column) {
                    if (error === null) {
                        if (column._name in setValue) {
                            error = this.checkByColumn(column, setValue[column._name]);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }, this);
            }
            else {
                error = new LogHelper(Error_Type.TableNotExist, { TableName: tblName });
            }
        }
        else {
            error = new LogHelper(Error_Type.NotObject);
        }
        return error;
    }

    private checkByColumn(column, value) {
        var error: IError = null;
        // check not null schema
        if (column._notNull && Util.isNull(value)) {
            error = new LogHelper(Error_Type.NullValue, { ColumnName: column._name });
        }

        // check datatype
        var type = Util.getType(value);
        if (column._dataType) {
            if (type !== column._dataType && type !== 'object') {
                error = new LogHelper(Error_Type.BadDataType, { ColumnName: column._name });
            }
        }

        // check allowed operators
        if (type === 'object') {
            var allowed_prop = ['+', '-', '*', '/'];
            for (var prop in value) {
                if (allowed_prop.indexOf(prop) < 0 && column._dataType && type !== column._dataType) {
                    error = new LogHelper(Error_Type.BadDataType, { ColumnName: column._name });
                }
                break;
            }
        }
        return error;
    }
}