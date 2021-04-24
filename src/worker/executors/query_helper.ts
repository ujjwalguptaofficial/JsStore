import { InsertQuery, DATA_TYPE, ERROR_TYPE, promise, TStringAny } from "@/common";
import { LogHelper, getDataType } from "@/worker/utils";
import { DbMeta } from "../model";
import { ValuesChecker } from "@worker/executors/insert";

export class QueryHelper {
    db: DbMeta;

    constructor(dbSchema: DbMeta) {
        this.db = dbSchema;
    }

    private getTable_(tableName: string) {
        return this.db.tables.find(q => q.name === tableName);
    }

    private isInsertQryValid_(query: InsertQuery) {
        const table = this.getTable_(query.into);
        let log: LogHelper;
        if (table) {
            switch (getDataType(query.values)) {
                case DATA_TYPE.Array:
                    break;
                case DATA_TYPE.Null:
                    log = new LogHelper(ERROR_TYPE.NoValueSupplied);
                    break;
                default:
                    log = new LogHelper(ERROR_TYPE.NotArray);
            }
        }
        else {
            log = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: query.into });
        }
        return {
            table, log
        };
    }

    checkInsertQuery(query: InsertQuery) {
        const validResult = this.isInsertQryValid_(query);
        let table = validResult.table;
        const err = validResult.log;
        if (err) return err;
        if (query.skipDataCheck) {
            return;
        }
        else {
            const valueCheckerInstance = new ValuesChecker(table, table.autoIncColumnValue);
            const { values, err } = valueCheckerInstance.checkAndModifyValues(query.values);
            query.values = values;
            return err;
        }
    }

    private isTableExist_(tableName: string): boolean {
        const index = this.db.tables.findIndex(table => table.name === tableName);
        return index >= 0;
    }
}