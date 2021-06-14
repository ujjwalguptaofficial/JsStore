import { IColumn, DATA_TYPE, ERROR_TYPE } from "@/common";
import { LogHelper, isNull, getDataType } from "@worker/utils";
import { TableMeta } from "@worker/model";

export class SchemaChecker {
    table: TableMeta;
    constructor(table: TableMeta) {
        this.table = table;
    }

    check(setValue: object, tblName: string) {
        let log: LogHelper;
        if (typeof setValue === DATA_TYPE.Object) {
            if (this.table) {
                // loop through table column and find data is valid
                this.table.columns.every((column) => {
                    if (column.name in setValue) {
                        log = this.checkByColumn_(column, setValue[column.name]);
                    }
                    return log ? false : true;
                });
            }
            else {
                log = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: tblName });
            }
        }
        else {
            log = new LogHelper(ERROR_TYPE.NotObject);
        }
        return log;
    }



    private checkByColumn_(column: IColumn, value) {
        // check not null schema
        if (column.notNull === true && isNull(value)) {
            return new LogHelper(ERROR_TYPE.NullValue, { ColumnName: column.name });
        }

        // check datatype
        const type = getDataType(value);
        const checkFurther = value != null;
        if (column.dataType && checkFurther) {
            if (type !== column.dataType && type !== 'object') {
                return new LogHelper(ERROR_TYPE.WrongDataType, { column: column.name });
            }
        }

        // check allowed operators
        if (checkFurther && type === 'object') {
            const allowedOp = ['+', '-', '*', '/', '{push}'];
            for (const prop in value) {
                if (allowedOp.indexOf(prop) < 0 && column.dataType && type !== column.dataType) {
                    return new LogHelper(ERROR_TYPE.WrongDataType, { column: column.name });
                }
            }
        }
    }
}