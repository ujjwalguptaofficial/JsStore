import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
import { IdbHelper } from "./idb_helper";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { Column } from "../model/column";
import * as KeyStore from "../keystore/index";

export class CreateDb {
    private dbName_: string;

    private get activeDb_() {
        return IdbHelper.activeDb;
    }

    private get dbVersion_() {
        return IdbHelper.activeDbVersion;
    }

    private get dbStatus_() {
        return IdbHelper.dbStatus;
    }

    private set dbStatus_(value) {
        IdbHelper.dbStatus = value;
    }

    private set dbConnection_(value) {
        IdbHelper.dbConnection = value;
    }

    private get dbConnection_() {
        return IdbHelper.dbConnection;
    }

    private getDbList_(callback: (dbList: string[]) => void) {
        IdbHelper.getDbList(callback);
    }

    constructor(tablesMetaData: TableHelper[], onSuccess: (listOf) => void, onError: (err: IError) => void) {
        this.dbName_ = this.activeDb_.name;
        const listofTableCreated = [];
        const dbRequest = indexedDB.open(this.dbName_, this.dbVersion_);

        dbRequest.onerror = (event) => {
            if (onError != null) {
                onError((event as any).target.error);
            }
        };

        dbRequest.onsuccess = (event) => {
            this.dbStatus_.conStatus = CONNECTION_STATUS.Connected;
            this.dbConnection_ = dbRequest.result;
            (this.dbConnection_ as any).onclose = (e) => {
                IdbHelper.callDbDroppedByBrowser();
                IdbHelper.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
            };

            this.dbConnection_.onversionchange = (e: IDBVersionChangeEvent) => {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    (e.target as any).close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser(true);
                    IdbHelper.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                }
            };

            this.dbConnection_.onerror = (e) => {
                IdbHelper.dbStatus.lastError = ("Error occured in connection :" + (e.target as any).result) as any;
            };

            this.dbConnection_.onabort = (e) => {
                this.dbStatus_ = {
                    conStatus: CONNECTION_STATUS.Closed,
                    lastError: ERROR_TYPE.ConnectionAborted
                };
            };

            // save in database list
            this.saveDbName_();
            if (onSuccess != null) {
                onSuccess(listofTableCreated);
            }
        };

        dbRequest.onupgradeneeded = (event) => {
            const dbConnection = (event as any).target.result;
            const createObjectStore = (item: TableHelper, index) => {
                try {
                    if (item.primaryKey.length > 0) {
                        IdbHelper.activeDb.tables[index].primaryKey = item.primaryKey;
                        const store = dbConnection.createObjectStore(item.name, {
                            keyPath: item.primaryKey
                        });
                        item.columns.forEach((column: Column) => {
                            if (column.enableSearch === true) {
                                const options = column.primaryKey ? { unique: true } : { unique: column.unique };
                                options['multiEntry'] = column.multiEntry;
                                store.createIndex(column.name, column.name, options);
                                if (column.autoIncrement) {
                                    KeyStore.set(`JsStore_${this.dbName_}_${item.name}_${column.name}_Value`, 0);
                                }
                            }
                        });
                    }
                    else {
                        const store = dbConnection.createObjectStore(item.name, {
                            autoIncrement: true
                        });
                        item.columns.forEach((column: Column) => {
                            const options = { unique: column.unique, multiEntry: column.multiEntry };
                            store.createIndex(column.name, column.name, options);
                            if (column.autoIncrement) {
                                KeyStore.set(`JsStore_${this.dbName_}_${item.name}_${column.name}_Value`, 0);
                            }
                        });
                    }
                    listofTableCreated.push(item.name);
                    // setting the table version
                    KeyStore.set(`JsStore_${this.dbName_}_${item.name}_Version`, item.version);
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

    private saveDbName_() {
        this.getDbList_((result) => {
            if (result.indexOf(this.dbName_) < 0) {
                result.push(this.dbName_);
                IdbHelper.setDbList(result);
            }
        });
    }
}
