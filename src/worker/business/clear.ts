import { Base } from "./base";
import { IError } from "../../common/index";
import { Column } from "../model/index";
import { KeyStore } from "../keystore/index";

export class Clear extends Base {
    constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.query = tableName;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        this.createTransaction([this.query], () => {
            if (this.error == null) {
                this.onSuccess();
            }
            else {
                this.onError(this.error);
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

        clearRequest.onerror = this.onErrorOccured;
    }
}