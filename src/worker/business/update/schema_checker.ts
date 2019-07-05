import { Table } from "../../model/table";
import { IColumn } from "../../interfaces";
import { Column } from "../../model/column";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE, DATA_TYPE } from "../../enums";
import { isNull, getDataType } from "../../utils/index";

export class SchemaChecker {
    table: Table;
    constructor(table: Table) {
        this.table = table;
    }

    check(setValue: object, tblName: string) {
        let log: LogHelper = null;
        if (typeof setValue === DATA_TYPE.Object) {
            if (this.table) {
                // loop through table column and find data is valid
                this.table.columns.every((column: Column) => {
                    if (log === null) {
                        if (column.name in setValue) {
                            log = this.checkByColumn_(column, setValue[column.name]);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                log = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: tblName });
            }
        }
        else {
            log = new LogHelper(ERROR_TYPE.NotObject);
        }
        if (log != null) {
            return log.get();
        }
        return null;
    }

    

    private checkByColumn_(column: IColumn, value) {
        let log: LogHelper = null;
        // check not null schema
        if (column.notNull === true && isNull(value)) {
            log = new LogHelper(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }

        // check datatype
        const type = getDataType(value);
        const checkFurther = value != null;
        if (column.dataType && checkFurther) {
            if (type !== column.dataType && type !== 'object') {
                log = new LogHelper(ERROR_TYPE.WrongDataType, { ColumnName: column.name });
            }
        }

        // check allowed operators
        if (checkFurther && type === 'object') {
            const allowedOp = ['+', '-', '*', '/'];
            for (const prop of Object.keys(value)) {
                if (allowedOp.indexOf(prop) < 0 && column.dataType && type !== column.dataType) {
                    log = new LogHelper(ERROR_TYPE.WrongDataType, { ColumnName: column.name });
                }
                break;
            }
        }
        return log;
    }
}