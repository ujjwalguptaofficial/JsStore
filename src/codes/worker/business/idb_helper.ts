import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import * as KeyStore from "../keystore/index";
import { IDbStatus, ITable, IDataBase } from "../interfaces";
import { DataBase } from "../model/database";
import { DropDb } from "./drop_db";

export class IdbHelper {

    static onDbDroppedByBrowser: () => void;
    static transaction: IDBTransaction = null;
    static isDbDeletedByBrowser: boolean;
    static dbConnection: IDBDatabase;
    static activeDb: DataBase;
    static activeDbVersion = 0;
    static dbStatus: IDbStatus = {
        conStatus: CONNECTION_STATUS.NotStarted,
        lastError: null
    };

    static callDbDroppedByBrowser(deleteMetaData?: boolean) {
        if (this.dbStatus.conStatus === CONNECTION_STATUS.Connected) {
            this.isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                const dropDbObject = new DropDb(this.onDbDroppedByBrowser, null);
                dropDbObject.deleteMetaData();
            }
        }
    }

    static createTransaction(tableNames: string[], callBack: () => void, mode?) {
        if (this.transaction === null) {
            mode = mode ? mode : "readwrite";
            this.transaction = this.dbConnection.transaction(tableNames, mode);
            this.transaction.oncomplete = () => {
                this.transaction = null;
                callBack();
            };
            (this.transaction as any).ontimeout = () => {
                this.transaction = null;
                console.error('transaction timed out');
            };
        }
    }

    static setDbList(list: string[]) {
        KeyStore.set('database_list', list);
    }

    static updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE) {
        if (err === undefined) {
            this.dbStatus.conStatus = status;
        }
        else {
            this.dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    }

    static getDbList(callback: (dbList: string[]) => void) {
        KeyStore.get('Database_List', (result) => {
            result = result == null ? [] : result;
            callback(result);
        });
    }

    static getDbVersion(dbName: string, callback: (version: number) => void) {
        KeyStore.get(`JsStore_${dbName}_Db_Version`, function (dbVersion) {
            callback.call(this, Number(dbVersion));
        }.bind(this));
    }

    static getDbSchema(dbName: string, callback: (schema: IDataBase) => void) {
        KeyStore.get(`JsStore_${dbName}_Schema`, (result) => {
            if (result) {
                if (result._name) {
                    callback(result);
                }
                else {
                    var db_schema = new DataBase(result);
                    KeyStore.set(`JsStore_${dbName}_Schema`, db_schema);
                    callback(db_schema);
                }
            }
            else {
                callback(result);
            }
        });
    }
}