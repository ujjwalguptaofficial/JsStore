import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { ValueChecker } from "./value_checker";
import { IdbHelper } from "../../index";
import * as KeyStore from "../../keystore/index";

export class ValuesChecker {
    table: Table;
    values: object[];
    error: IError;
    onFinish: (isError: boolean) => void;
    valueCheckerObj: ValueChecker;

    constructor(table: Table, values: object[]) {
        this.table = table;
        this.values = values;
    }

    checkAndModifyValues(onFinish: (isError: boolean) => void) {
        this.onFinish = onFinish;
        const autoIncColumns = this.table.columns.filter((col) => {
            return col.autoIncrement;
        });
        const autoIncValues = {};
        autoIncColumns.forEach((column) => {
            const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${column.name}_Value`;
            KeyStore.get(autoIncrementKey, (val) => {
                autoIncValues[column.name] = val;
            });
        });
        KeyStore.get('dumy_key', (val) => {
            this.valueCheckerObj = new ValueChecker(this.table, autoIncValues);
            this.startChecking();
        }, (err) => {
            this.error = err as any;
            this.onFinish(true);
        });

    }

    private startChecking() {
        let isError = false;
        this.values.every((item) => {
            isError = this.valueCheckerObj.checkAndModifyValue(item);
            return !isError;
        });
        if (isError) {
            this.error = this.valueCheckerObj.error;
            this.onFinish(true);
        }
        else {
            for (const prop of Object.keys(this.valueCheckerObj.autoIncrementValue)) {
                const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${this.table.name}_${prop}_Value`;
                KeyStore.set(autoIncrementKey, this.valueCheckerObj.autoIncrementValue[prop]);
            }
            KeyStore.get('dumy_key', (val) => {
                this.onFinish(false);
            },
                (err) => {
                    this.error = err as any;
                    this.onFinish(true);
                });
        }
    }
}