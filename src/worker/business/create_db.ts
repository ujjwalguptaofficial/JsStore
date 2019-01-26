import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { Column } from "../model/column";
import { KeyStore } from "../keystore/index";
import { BaseDb } from "./base_db";

export class CreateDb extends BaseDb {

    constructor(onSuccess: (listOf) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute(tablesMetaData: TableHelper[]) {
        const listofTableCreated = [];
        const dbRequest = indexedDB.open(this.dbName, this.dbVersion);

        dbRequest.onerror = (event) => {
            if (this.onError != null) {
                this.onError((event as any).target.error);
            }
        };

        dbRequest.onsuccess = (event) => {
            this.dbStatus.conStatus = CONNECTION_STATUS.Connected;
            this.dbConnection = dbRequest.result;
            (this.dbConnection as any).onclose = this.onDbClose;

            this.dbConnection.onversionchange = this.onDbVersionChange;
            this.dbConnection.onerror = this.onDbConError;

            // save in database list
            this.savedbNameIntoDbList_();
            if (this.onSuccess != null) {
                this.onSuccess(listofTableCreated);
            }

        };

        dbRequest.onupgradeneeded = (event) => {
            const dbConnection = (event as any).target.result;
            const createObjectStore = (item: TableHelper, index) => {
                try {
                    let store: IDBObjectStore;
                    if (item.primaryKey.length > 0) {
                        this.activeDb.tables[index].primaryKey = item.primaryKey;
                        store = dbConnection.createObjectStore(item.name, {
                            keyPath: item.primaryKey
                        });
                    }
                    else {
                        store = dbConnection.createObjectStore(item.name, {
                            autoIncrement: true
                        });
                    }
                    item.columns.forEach((column: Column) => {
                        if (column.enableSearch === true) {
                            const options = column.primaryKey ? { unique: true } : { unique: column.unique };
                            options['multiEntry'] = column.multiEntry;
                            const keyPath = column.keyPath == null ? column.name : column.keyPath;
                            store.createIndex(column.name, keyPath, options);
                            if (column.autoIncrement) {
                                KeyStore.set(`JsStore_${this.dbName}_${item.name}_${column.name}_Value`, 0);
                            }
                        }
                    });
                    listofTableCreated.push(item.name);
                    // setting the table version
                    KeyStore.set(`JsStore_${this.dbName}_${item.name}_Version`, item.version);
                }
                catch (e) {
                    console.error(e);
                }
            };
            tablesMetaData.forEach((item: TableHelper, index) => {
                if (item.requireDelete) {
                    // Delete the old datastore.    
                    if (dbConnection.objectStoreNames.contains(item.name)) {
                        dbConnection.deleteObjectStore(item.name);
                    }
                    createObjectStore(item, index);
                }
                else if (item.requireCreation) {
                    createObjectStore(item, index);
                }
            });
        };
    }

    private async savedbNameIntoDbList_() {
        const dbList = await this.getDbList();
        if (dbList.indexOf(this.dbName) < 0) {
            dbList.push(this.dbName);
            this.setDbList(dbList);
        }
    }
}
