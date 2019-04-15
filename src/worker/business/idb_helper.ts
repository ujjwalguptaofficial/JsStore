import { CONNECTION_STATUS, ERROR_TYPE, IDB_MODE } from "../enums";
import { KeyStore } from "../keystore/index";
import { IDbStatus } from "../interfaces";
import { DataBase, Table } from "../model/index";
import { DropDb } from "./drop_db";
import { promise } from "./helpers/promise";

export class IdbHelper {

    static onDbDroppedByBrowser: () => void;
    static transaction: IDBTransaction = null;
    static isDbDeletedByBrowser: boolean;
    static dbConnection: IDBDatabase;
    static activeDb: DataBase;
    static activeDbVersion = 0;
    static dbStatus: IDbStatus = {
        conStatus: CONNECTION_STATUS.NotStarted
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
            const onComplete = () => {
                IdbHelper.transaction = null;
                callBack();
            };
            IdbHelper.transaction.oncomplete = onComplete;
            IdbHelper.transaction.onabort = onComplete;
        }
    }

    static setDbList(list: string[]) {
        return KeyStore.set('DataBase_List', list);
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

    static getDbList() {
        return promise<string[]>((res, rej) => {
            KeyStore.get<string[]>('DataBase_List').then(result => {
                res(result == null ? [] : result);
            }).catch(rej);
        });
    }

    static getDbVersion(dbName: string) {
        return promise<number>((res, rej) => {
            KeyStore.get(`JsStore_${dbName}_Db_Version`).then(dbVersion => {
                res(Number(dbVersion));
            }).catch(rej);
        });
    }

    static getDbSchema(dbName: string) {
        return KeyStore.get<DataBase>(`JsStore_${dbName}_Schema`);
    }

    static getTable(tableName: string) {
        const currentTable = IdbHelper.activeDb.tables.find(table => table.name === tableName);
        return currentTable;
    }
}