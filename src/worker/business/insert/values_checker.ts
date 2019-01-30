import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { ValueChecker } from "./value_checker";
import { IdbHelper } from "../idb_helper";
import { KeyStore } from "../../keystore/index";
import { promise } from "../helpers/promise";

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
            this.getAutoIncrementValues_().then(autoIncValues => {
                this.valueCheckerObj = new ValueChecker(this.table, autoIncValues);
                this.startChecking().then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    private getAutoIncrementValues_() {
        const autoIncColumns = this.table.columns.filter((col) => {
            return col.autoIncrement;
        });
        return promise((resolve, reject) => {
            Promise.all(autoIncColumns.map(column => {
                const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${column.name}_Value`;
                return KeyStore.get(autoIncrementKey);
            })).then(results => {
                const autoIncValues = {};
                for (var i = 0; i < autoIncColumns.length; i++) {
                    autoIncValues[autoIncColumns[i].name] = results[i];
                }
                resolve(autoIncValues);
            }).catch(reject);
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
            else {
                const keys = Object.keys(this.valueCheckerObj.autoIncrementValue);
                Promise.all(keys.map((prop) => {
                    const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${prop}_Value`;
                    return KeyStore.set(
                        autoIncrementKey,
                        this.valueCheckerObj.autoIncrementValue[prop]
                    )
                })).then(resolve).catch(reject);
            }
        });
    }
}