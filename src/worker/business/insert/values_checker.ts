import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { ValueChecker } from "./value_checker";
import { IdbHelper } from "../idb_helper";
import { KeyStore } from "../../keystore/index";

export class ValuesChecker {
    table: Table;
    values: object[];
    valueCheckerObj: ValueChecker;

    constructor(table: Table, values: object[]) {
        this.table = table;
        this.values = values;
    }

    checkAndModifyValues() {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            const autoIncValues = {};
            let index = 0;
            let autoIncColumnLength = autoIncColumns.length;
            const setAutoIncrementValue = async () => {
                if (index < autoIncColumnLength) {
                    const column = autoIncColumns[index];
                    const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${column.name}_Value`;
                    try {
                        const val = await KeyStore.get(autoIncrementKey);
                        autoIncValues[column.name] = val;
                        ++index;
                        setAutoIncrementValue();
                    }
                    catch (ex) {
                        reject(ex);
                    }
                }
                else {
                    resolve(autoIncValues);
                }
            };
            setAutoIncrementValue();
        });
    }

    private startChecking() {
        return new Promise((resolve, reject) => {
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