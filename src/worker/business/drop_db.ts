import { IError } from "../interfaces";
import { KeyStore } from "../keystore/index";
import { Table, Column } from "../model/index";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { LogHelper } from "../log_helper";
import { BaseDb } from "./index";

export class DropDb extends BaseDb {
    private onSuccess_: () => void;
    private onError_: (err: IError) => void;

    constructor(onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.onSuccess_ = onSuccess;
        this.onError_ = onError;
    }

    deleteMetaData() {
        KeyStore.remove(`JsStore_${this.dbName}_Db_Version`);
        this.activeDb.tables.forEach((table: Table) => {
            KeyStore.remove(`JsStore_${this.dbName}_${table.name}_Version`);
            table.columns.forEach((column: Column) => {
                if (column.autoIncrement) {
                    KeyStore.remove(`JsStore_${this.dbName}_${table.name}_${column.name}_Value`);
                }
            });
        });
        // remove from database_list 
        this.getDbList().then(dbList => {
            dbList.splice(dbList.indexOf(this.dbName), 1);
            this.setDbList(dbList).then(() => {
                // remove db schema from keystore
                KeyStore.remove(`JsStore_${this.dbName}_Schema`).then(this.onSuccess_.bind(this));
            });
        });
    }

    deleteDb() {
        setTimeout(() => {
            const dropDbRequest = indexedDB.deleteDatabase(this.dbName);
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
                this.dbStatus.conStatus = CONNECTION_STATUS.Closed;
                this.deleteMetaData();
            };
        }, 100);
    }
}
