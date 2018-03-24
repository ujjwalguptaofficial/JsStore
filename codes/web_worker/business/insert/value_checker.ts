import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { Column } from "../../model/column";
import { Util } from "../../util";
import { Error_Type } from "../../enums";
import { LogHelper } from "../../log_helper";

export class ValueChecker {
    _table: Table;
    _value: object;
    _errorOccured: boolean = false;
    _error: IError;
    _autoIncrementValue = {};

    constructor(table: Table, autoIncrementValue) {
        this._table = table;
        this._autoIncrementValue = autoIncrementValue;
    }

    public checkAndModifyValue(value) {
        this._value = value;
        this._table._columns.every(function (column) {
            this.checkAndModifyColumnValue(column, value);
            return !this._errorOccured;
        }, this);
        return this._errorOccured;
    }

    private checkNotNullAndDataType(column: Column) {
        // check not null schema
        if (column._notNull && Util.isNull(this._value[column._name])) {
            this.onValidationError(Error_Type.NullValue, { ColumnName: column._name });
        }
        // check datatype
        else if (column._dataType && !Util.isNull(this._value[column._name]) &&
            Util.getType(this._value[column._name]) !== column._dataType) {
            this.onValidationError(Error_Type.BadDataType, { ColumnName: column._name });
        }
    }

    private checkAndModifyColumnValue(column: Column) {
        // check auto increment scheme
        if (column._autoIncrement) {
            this._value[column._name] = ++this._autoIncrementValue[column._name];
        }
        // check Default Schema
        else if (column._default && Util.isNull(this._value[column._name])) {
            this._value[column._name] = column._default;
        }
        this.checkNotNullAndDataType(column);
    }

    private onValidationError(error: Error_Type, details: any) {
        this._errorOccured = true;
        this._error = new LogHelper(error, details).get();
    }
}