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
            const autoIncValues = {};
            let index = 0;
            let autoIncColumnLength = autoIncColumns.length;
            const setAutoIncrementValue = () => {
                if (index < autoIncColumnLength) {
                    const column = autoIncColumns[index];
                    const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${column.name}_Value`;
                    KeyStore.get(autoIncrementKey).then(val => {
                        autoIncValues[column.name] = val;
                        ++index;
                        setAutoIncrementValue();
                    }).catch(reject);
                }
                else {
                    resolve(autoIncValues);
                }
            };
            setAutoIncrementValue();
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
                let index = 0;
                const saveAutoIncrementKey = () => {
                    if (index < keys.length) {
                        const prop = keys[index++];
                        const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${prop}_Value`;
                        KeyStore.set(
                            autoIncrementKey,
                            this.valueCheckerObj.autoIncrementValue[prop]
                        ).then(saveAutoIncrementKey).catch(reject);

                    }
                    else {
                        resolve();
                    }
                };
                saveAutoIncrementKey();
            }
        });
    }
}