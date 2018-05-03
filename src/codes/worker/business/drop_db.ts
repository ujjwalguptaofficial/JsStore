import { IError } from "../interfaces";
import * as KeyStore from "../keystore/index";
import { IdbHelper } from "./idb_helper";
import { Table } from "../model/table";
import { Column } from "../model/column";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { LogHelper } from "../log_helper";

export class DropDb {
    private onSuccess_: () => void;
    private onError_: (err: IError) => void;

    private get dbName_() {
        return IdbHelper.activeDb.name;
    }

    constructor(onSuccess: () => void, onError: (err: IError) => void) {
        this.onSuccess_ = onSuccess;
        this.onError_ = onError;
    }

    deleteMetaData() {
        KeyStore.remove(`JsStore_${this.dbName_}_Db_Version`);
        IdbHelper.activeDb.tables.forEach((table: Table) => {
            KeyStore.remove(`JsStore_${this.dbName_}_${table.name}_Version`);
            table.columns.forEach((column: Column) => {
                if (column.autoIncrement) {
                    KeyStore.remove(`JsStore_${this.dbName_}_${table.name}_${column.name}_Value`);
                }
            });
        });
        // remove from database_list 
        this.getDbList_(result => {
            result.splice(result.indexOf(this.dbName_), 1);
            IdbHelper.setDbList(result);
        });
        KeyStore.remove(`JsStore_${this.dbName_}_Schema`, this.onSuccess_);
    }

    private getDbList_(callback: (dbList: string[]) => void) {
        IdbHelper.getDbList(callback);
    }

    deleteDb() {
        setTimeout(() => {
            const dropDbRequest = indexedDB.deleteDatabase(this.dbName_);
            dropDbRequest.onblocked = () => {
                if (this.onError_ != null) {
                    this.onError_(new LogHelper(ERROR_TYPE.DbBlocked).get());
                }
            };
            dropDbRequest.onerror = (e) => {
                if (this.onError_ != null) {
                    this.onError_((event as any).target.error);
                }
            };
            dropDbRequest.onsuccess = () => {
                IdbHelper.dbStatus.conStatus = CONNECTION_STATUS.Closed;
                this.deleteMetaData();
            };
        }, 100);
    }
}
