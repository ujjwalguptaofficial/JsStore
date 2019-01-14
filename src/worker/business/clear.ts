import { Base } from "./base";
import { IError } from "../interfaces";
import { IdbHelper } from './idb_helper';
import { Column } from "../model/column";
import * as KeyStore from "../keystore/index";

export class Clear extends Base {
    constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.query = tableName;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        this.createTransaction([this.query], () => {
            if (this.errorOccured === false) {
                this.onSuccess();
            }
        });
        const clearRequest: IDBRequest = this.transaction.objectStore(this.query).clear();
        clearRequest.onsuccess = (e) => {
            const currentTable = this.getTable(this.query);
            currentTable.columns.forEach((column: Column) => {
                if (column.autoIncrement) {
                    KeyStore.set(`JsStore_${this.activeDb.name}_${this.query}_${column.name}_Value`, 0);
                }
            });
        };

        clearRequest.onerror = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
    }
}