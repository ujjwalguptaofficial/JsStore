import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
import { IdbHelper } from "./idb_helper";
import { Connection_Status, Error_Type } from "../enums";
import { Column } from "../model/column";
import * as KeyStore from "../keystore/index";

export class CreateDb {
    _dbName: string;
    constructor(tablesMetaData: TableHelper[], onSuccess: (listOf) => void, onError: (err: IError) => void) {
        this._dbName = IdbHelper._activeDb._name;
        var table_created_list = [],
            db_request = indexedDB.open(this._dbName, IdbHelper._dbVersion);

        db_request.onerror = (event) => {
            if (onError != null) {
                onError((event as any).target.error);
            }
        };

        db_request.onsuccess = (event) => {
            IdbHelper._dbStatus.ConStatus = Connection_Status.Connected;
            IdbHelper._dbConnection = db_request.result;
            (IdbHelper._dbConnection as any).onclose = (e) => {
                IdbHelper.callDbDroppedByBrowser();
                IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
            };

            IdbHelper._dbConnection.onversionchange = (e) => {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    (e.target as any).close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser(true);
                    IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                }
            };

            IdbHelper._dbConnection.onerror = (e) => {
                IdbHelper._dbStatus.LastError = ("Error occured in connection :" + (e.target as any).result) as any;
            };

            IdbHelper._dbConnection.onabort = (e) => {
                IdbHelper._dbStatus = {
                    ConStatus: Connection_Status.Closed,
                    LastError: Error_Type.ConnectionAborted
                };
            };

            // save in database list
            this.saveDbName();
            if (onSuccess != null) {
                onSuccess(table_created_list);
            }
        };

        db_request.onupgradeneeded = (event) => {
            var db_connection = (event as any).target.result;
            var createObjectStore = (item: TableHelper, index) => {
                try {
                    if (item._primaryKey.length > 0) {
                        IdbHelper._activeDb._tables[index]._primaryKey = item._primaryKey;
                        var store = db_connection.createObjectStore(item._name, {
                            keyPath: item._primaryKey
                        });
                        item._columns.forEach((column: Column) => {
                            if (column._enableSearch === true) {
                                var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                options['multiEntry'] = column._multiEntry;
                                store.createIndex(column._name, column._name, options);
                                if (column._autoIncrement) {
                                    KeyStore.set(
                                        "JsStore_" + this._dbName + "_" + item._name +
                                        "_" + column._name + "_Value",
                                        0
                                    );
                                }
                            }
                        });
                    }
                    else {
                        var store = db_connection.createObjectStore(item._name, {
                            autoIncrement: true
                        });
                        item._columns.forEach((column: Column) => {
                            var options = { unique: column._unique, multiEntry: column._multiEntry };
                            store.createIndex(column._name, column._name, options);
                            if (column._autoIncrement) {
                                KeyStore.set(
                                    "JsStore_" + this._dbName + "_" + item._name + "_" + column._name + "_Value",
                                    0
                                );
                            }
                        });
                    }
                    table_created_list.push(item._name);
                    // setting the table version
                    KeyStore.set("JsStore_" + this._dbName + "_" + item._name + "_Version", item._version);
                }
                catch (e) {
                    console.error(e);
                }
            };
            tablesMetaData.forEach((item: TableHelper, index) => {
                if (item._requireDelete) {
                    // Delete the old datastore.    
                    if (db_connection.objectStoreNames.contains(item._name)) {
                        db_connection.deleteObjectStore(item._name);
                    }
                    createObjectStore(item, index);
                }
                else if (item._requireCreation) {
                    createObjectStore(item, index);
                }
            });
        };
    }

    private saveDbName() {
        IdbHelper.getDbList((result) => {
            if (result.indexOf(this._dbName) < 0) {
                result.push(this._dbName);
                IdbHelper.setDbList(result);
            }
        });
    }
}
