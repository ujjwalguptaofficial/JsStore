import { Table } from "../../model/index";
import { ValueChecker } from "./value_checker";
import { promise } from "../../helpers/index";
import { Util } from "../../util";
import { QueryExecutor } from "../../query_executor";
import { QueryHelper } from "../query_helper";

export class ValuesChecker {
    table: Table;
    values: object[];
    valueCheckerObj: ValueChecker;

    constructor(table: Table, values: object[]) {
        this.table = table;
        this.values = values;
    }

    checkAndModifyValues() {
        return promise((resolve, reject) => {
            const onAutoIncValueEvaluated = (autoIncrementValues) => {
                this.valueCheckerObj = new ValueChecker(this.table, autoIncrementValues);
                this.startChecking().then(resolve).catch(reject);
            };
            if (QueryExecutor.isTransactionQuery === false) {
                Util.getAutoIncrementValues(this.table).then(autoIncValues => {
                    onAutoIncValueEvaluated(autoIncValues);
                }).catch(reject);
            }
            else {
                onAutoIncValueEvaluated(QueryHelper.autoIncrementValues[this.table.name]);
            }
        });
    }
    
    private startChecking() {
        return promise((resolve, reject) => {
            let isError = false;
            this.values.every((item) => {
                isError = this.valueCheckerObj.checkAndModifyValue(item);
                return !isError;
            });
            if (isError) {
                const error = this.valueCheckerObj.log.get();
                reject(error);
            }
            const promiseObj = Util.setAutoIncrementValue(this.table, this.valueCheckerObj.autoIncrementValue);
            if (QueryExecutor.isTransactionQuery === false) {
                promiseObj.then(resolve).catch(reject);
            }
            else {
                resolve();
            }
        });
    }
}