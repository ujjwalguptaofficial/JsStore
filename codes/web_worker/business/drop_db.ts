import { IError } from "../interfaces";
import * as KeyStore from "../keystore/index";
import { IdbHelper } from "./idb_helper";
import { Table } from "../model/table";
import { Column } from "../model/column";
import { Connection_Status, Error_Type } from "../enums";
import { LogHelper } from "../log_helper";

export class DropDb {
    _onSuccess: () => void;
    _onError: (err: IError) => void;
    _dbName: string;
    constructor(onSuccess: () => void, onError: (err: IError) => void) {
        this._onSuccess = onSuccess;
        this._onError = onError;
        this._dbName = IdbHelper._activeDb._name;
    }

    deleteMetaData() {
        KeyStore.remove(`JsStore_${this._dbName}_Db_Version`);
        IdbHelper._activeDb._tables.forEach((table: Table) => {
            KeyStore.remove(`JsStore_${this._dbName}_${table._name}_Version`);
            table._columns.forEach(function (column: Column) {
                if (column._autoIncrement) {
                    KeyStore.remove(`JsStore_${this._dbName}_${table._name}_${column._name}_Value`);
                }
            });
        });
        // remove from database_list 
        IdbHelper.getDbList((result) => {
            result.splice(result.indexOf(this._dbName), 1);
            IdbHelper.setDbList(result);
        });
        KeyStore.remove(`JsStore_${this._dbName}_Schema`, this._onSuccess);
    }

    deleteDb() {
        setTimeout(() => {
            var db_drop_request = indexedDB.deleteDatabase(this._dbName);
            db_drop_request.onblocked = () => {
                if (this._onError != null) {
                    this._onError(new LogHelper(Error_Type.DbBlocked).get());
                }
            };
            db_drop_request.onerror = (e) => {
                if (this._onError != null) {
                    this._onError((event as any).target.error);
                }
            };
            db_drop_request.onsuccess = () => {
                IdbHelper._dbStatus.ConStatus = Connection_Status.Closed;
                this.deleteMetaData();
            };
        }, 100);
    }
}
