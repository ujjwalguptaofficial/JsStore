import { IdbHelper } from "./idb_helper";
import { Connection_Status, Error_Type } from "../enums";
import * as KeyStore from "../keystore/index";
var CreateDb = /** @class */ (function () {
    function CreateDb(tablesMetaData, onSuccess, onError) {
        var _this = this;
        this._dbName = IdbHelper._activeDb._name;
        var table_created_list = [], db_request = indexedDB.open(this._dbName, IdbHelper._dbVersion);
        db_request.onerror = function (event) {
            if (onError != null) {
                onError(event.target.error);
            }
        };
        db_request.onsuccess = function (event) {
            IdbHelper._dbStatus.ConStatus = Connection_Status.Connected;
            IdbHelper._dbConnection = db_request.result;
            IdbHelper._dbConnection.onclose = function (e) {
                IdbHelper.callDbDroppedByBrowser();
                IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
            };
            IdbHelper._dbConnection.onversionchange = function (e) {
                if (e.newVersion === null) {
                    e.target.close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser(true);
                    IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                }
            };
            IdbHelper._dbConnection.onerror = function (e) {
                IdbHelper._dbStatus.LastError = ("Error occured in connection :" + e.target.result);
            };
            IdbHelper._dbConnection.onabort = function (e) {
                IdbHelper._dbStatus = {
                    ConStatus: Connection_Status.Closed,
                    LastError: Error_Type.ConnectionAborted
                };
            };
            // save in database list
            _this.saveDbName();
            if (onSuccess != null) {
                onSuccess(table_created_list);
            }
        };
        db_request.onupgradeneeded = function (event) {
            var db_connection = event.target.result;
            var createObjectStore = function (item, index) {
                try {
                    if (item._primaryKey.length > 0) {
                        IdbHelper._activeDb._tables[index]._primaryKey = item._primaryKey;
                        var store = db_connection.createObjectStore(item._name, {
                            keyPath: item._primaryKey
                        });
                        item._columns.forEach(function (column) {
                            if (column._enableSearch === true) {
                                var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                options['multiEntry'] = column._multiEntry;
                                store.createIndex(column._name, column._name, options);
                                if (column._autoIncrement) {
                                    KeyStore.set("JsStore_" + _this._dbName + "_" + item._name + "_" + column._name + "_Value", 0);
                                }
                            }
                        });
                    }
                    else {
                        var store = db_connection.createObjectStore(item._name, {
                            autoIncrement: true
                        });
                        item._columns.forEach(function (column) {
                            var options = { unique: column._unique, multiEntry: column._multiEntry };
                            store.createIndex(column._name, column._name, options);
                            if (column._autoIncrement) {
                                KeyStore.set("JsStore_" + _this._dbName + "_" + item._name + "_" + column._name + "_Value", 0);
                            }
                        });
                    }
                    table_created_list.push(item._name);
                    // setting the table version
                    KeyStore.set("JsStore_" + _this._dbName + "_" + item._name + "_Version", item._version);
                }
                catch (e) {
                    console.error(e);
                }
            };
            tablesMetaData.forEach(function (item, index) {
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
    CreateDb.prototype.saveDbName = function () {
        var _this = this;
        IdbHelper.getDbList(function (result) {
            if (result.indexOf(_this._dbName) < 0) {
                result.push(_this._dbName);
                IdbHelper.setDbList(result);
            }
        });
    };
    return CreateDb;
}());
export { CreateDb };
//# sourceMappingURL=create_db.js.map