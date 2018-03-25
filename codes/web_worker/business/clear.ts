import { Base } from "./base";
import { IError } from "../interfaces";
import { IdbHelper } from './idb_helper';
import { Column } from "../model/column";
import * as KeyStore from "../keystore/index";

export class Clear extends Base {
    constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this._query = tableName;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    execute() {
        IdbHelper.createTransaction([this._query], () => {
            if (this._errorOccured === false) {
                this._onSuccess();
            }
        });
        var clear_request: IDBRequest = IdbHelper._transaction.objectStore(this._query).clear();
        clear_request.onsuccess = (e) => {
            var current_table = this.getTable(this._query);
            current_table._columns.forEach((column: Column) => {
                if (column._autoIncrement) {
                    KeyStore.set(`JsStore_${IdbHelper._activeDb._name}_${this._query}_${column._name}_Value`, 0);
                }
            });
        };

        clear_request.onerror = (e) => {
            this._errorOccured = true;
            this.onErrorOccured(e);
        };
    }
}