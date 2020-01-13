import { Table, Column } from "../../model/index";
import { ERROR_TYPE, DATA_TYPE } from "../../../common/index";
import { LogHelper } from "../../log_helper";
import { isNull, getDataType } from "../../utils/index";

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

    private checkNotNullAndDataType_(column: Column) {
        // check not null schema
        if (column.notNull && isNull(this.value[column.name])) {
            this.onValidationError_(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }
        // check datatype
        else if (column.dataType && !isNull(this.value[column.name]) &&
            getDataType(this.value[column.name]) !== column.dataType) {
            this.onValidationError_(ERROR_TYPE.WrongDataType, { column: column.name });
        }
    }

    private checkAndModifyColumnValue_(column: Column) {
        const columnValue = this.value[column.name];
        // check auto increment scheme
        if (column.autoIncrement) {
            // if value is null, then create the autoincrement value
            if (isNull(columnValue)) {
                this.value[column.name] = ++this.autoIncrementValue[column.name];
            }
            else {
                if (getDataType(columnValue) === DATA_TYPE.Number) {
                    // if column value is greater than autoincrement value saved, then make the
                    // column value as autoIncrement value
                    if (columnValue > this.autoIncrementValue[column.name]) {
                        this.autoIncrementValue[column.name] = columnValue;
                    }
                }
            }
        }
        // check Default Schema
        else if (column.default && isNull(columnValue)) {
            this.value[column.name] = column.default;
        }
        this.checkNotNullAndDataType_(column);
    }

    private onValidationError_(error: ERROR_TYPE, details: object) {
        this.errorOccured = true;
        this.log = new LogHelper(error, details);
    }
}