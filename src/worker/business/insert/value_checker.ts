import { Table, Column } from "../../model/index";
import { Util } from "../../util";
import { ERROR_TYPE, DATA_TYPE } from "../../enums";
import { LogHelper } from "../../log_helper";

export class ValueChecker {
    table: Table;
    value: object;
    errorOccured = false;
    log: LogHelper;
    autoIncrementValue = {};

    constructor(table: Table, autoIncrementValue) {
        this.table = table;
        this.autoIncrementValue = autoIncrementValue;
    }

    checkAndModifyValue(value) {
        this.value = value;
        this.table.columns.every((column) => {
            this.checkAndModifyColumnValue_(column);
            return !this.errorOccured;
        });
        return this.errorOccured;
    }

    private isNull_(value) {
        return Util.isNull(value);
    }

    private getType_(value) {
        return Util.getType(value);
    }

    private checkNotNullAndDataType_(column: Column) {
        // check not null schema
        if (column.notNull && this.isNull_(this.value[column.name])) {
            this.onValidationError_(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }
        // check datatype
        else if (column.dataType && !this.isNull_(this.value[column.name]) &&
            this.getType_(this.value[column.name]) !== column.dataType) {
            this.onValidationError_(ERROR_TYPE.WrongDataType, { ColumnName: column.name });
        }
    }

    private checkAndModifyColumnValue_(column: Column) {
        const columnValue = this.value[column.name];
        // check auto increment scheme
        if (column.autoIncrement) {
            // if value is null, then create the autoincrement value
            if (this.isNull_(columnValue)) {
                this.value[column.name] = ++this.autoIncrementValue[column.name];
            }
            else {
                if (this.getType_(columnValue) === DATA_TYPE.Number) {
                    // if column value is greater than autoincrement value saved, then make the
                    // column value as autoIncrement value
                    if (columnValue > this.autoIncrementValue[column.name]) {
                        this.autoIncrementValue[column.name] = columnValue;
                    }
                }
            }
        }
        // check Default Schema
        else if (column.default && this.isNull_(columnValue)) {
            this.value[column.name] = column.default;
        }
        this.checkNotNullAndDataType_(column);
    }

    private onValidationError_(error: ERROR_TYPE, details: object) {
        this.errorOccured = true;
        this.log = new LogHelper(error, details);
    }
}