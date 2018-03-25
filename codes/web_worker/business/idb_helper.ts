import { Connection_Status, Error_Type } from "../enums";
import * as KeyStore from "../keystore/index";
import { IDbStatus } from "../interfaces";
import { DataBase } from "../model/database";
import { DropDb } from "./drop_db";

export class IdbHelper {

    static _onDbDroppedByBrowser: () => void;
    static _transaction: IDBTransaction = null;
    static _isDbDeletedByBrowser: boolean;
    static _dbConnection: IDBDatabase;
    static _activeDb: DataBase;
    static _dbVersion: number = 0;
    static _dbStatus: IDbStatus = {
        ConStatus: Connection_Status.NotStarted,
        LastError: null
    };

    static callDbDroppedByBrowser(deleteMetaData?: boolean) {
        if (this._dbStatus.ConStatus === Connection_Status.Connected) {
            this._isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                var drop_db_object = new DropDb(this._onDbDroppedByBrowser, null);
                drop_db_object.deleteMetaData();
            }
        }
    }

    static createTransaction(tableNames, callBack: () => void, mode?) {
        if (this._transaction === null) {
            mode = mode ? mode : "readwrite";
            this._transaction = this._dbConnection.transaction(tableNames, mode);
            this._transaction.oncomplete = () => {
                this._transaction = null;
                callBack();
            };
            (this._transaction as any).ontimeout = () => {
                this._transaction = null;
                console.error('transaction timed out');
            };
        }
    }

    static setDbList(list: string[]) {
        KeyStore.set('database_list', list);
    }

    static updateDbStatus(status: Connection_Status, err?: Error_Type) {
        if (err === undefined) {
            this._dbStatus.ConStatus = status;
        }
        else {
            this._dbStatus = {
                ConStatus: status,
                LastError: err
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

    static getDbSchema(dbName: string, callback: (any) => void) {
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