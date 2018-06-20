import { CONNECTION_STATUS, ERROR_TYPE, IDB_MODE } from "../enums";
import * as KeyStore from "../keystore/index";
import { IDbStatus, ITable, IDataBase } from "../interfaces";
import { DataBase } from "../model/database";
import { DropDb } from "./drop_db";
import { Table } from "../model/table";

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
        if (IdbHelper.dbStatus.conStatus === CONNECTION_STATUS.Connected) {
            IdbHelper.isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                const dropDbObject = new DropDb(IdbHelper.onDbDroppedByBrowser, null);
                dropDbObject.deleteMetaData();
            }
        }
    }

    static createTransaction(tableNames: string[], callBack: () => void, mode?) {
        if (IdbHelper.transaction === null) {
            mode = mode ? mode : IDB_MODE.ReadWrite;
            IdbHelper.transaction = IdbHelper.dbConnection.transaction(tableNames, mode);
            IdbHelper.transaction.oncomplete = () => {
                IdbHelper.transaction = null;
                callBack();
            };
            (IdbHelper.transaction as any).ontimeout = () => {
                IdbHelper.transaction = null;
                console.error('transaction timed out');
            };
        }
    }

    static setDbList(list: string[]) {
        return new Promise((resolve, reject) => {
            KeyStore.set('DataBase_List', list, resolve, reject);
        });

    }

    static updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE) {
        if (err === undefined) {
            IdbHelper.dbStatus.conStatus = status;
        }
        else {
            IdbHelper.dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    }

    static getDbList(callback: (dbList: string[]) => void) {
        KeyStore.get('DataBase_List', (result) => {
            result = result == null ? [] : result;
            callback(result);
        });
    }

    static getDbVersion(dbName: string, callback: (version: number) => void) {
        KeyStore.get(`JsStore_${dbName}_Db_Version`, (dbVersion) => {
            callback.call(this, Number(dbVersion));
        });
    }

    static getDbSchema(dbName: string, callback: (schema: IDataBase) => void) {
        KeyStore.get(`JsStore_${dbName}_Schema`, (result) => {
            callback(result);
        });
    }

    static getTable(tableName: string) {
        const currentTable = IdbHelper.activeDb.tables.find(table => table.name === tableName);
        return currentTable;
    }
}