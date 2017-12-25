namespace JsStore {
    export namespace Business {
        export class CreateDb {
            constructor(dbVersion, onSuccess: (listOf) => void, onError: (err: IError) => void) {
                var that = this,
                    table_created_list = [],
                    db_request = indexedDB.open(active_db._name, dbVersion);

                db_request.onerror = function (event) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };

                db_request.onsuccess = function (event) {
                    status.ConStatus = ConnectionStatus.Connected;
                    db_connection = db_request.result;
                    db_connection.onclose = function () {
                        status.ConStatus = ConnectionStatus.Closed;
                        status.LastError = "Connection Closed";
                    };

                    db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            e.target.close(); // Manually close our connection to the db
                        }
                    };

                    db_connection.onerror = function (e) {
                        status.LastError = "Error occured in connection :" + e.target.result;
                    };

                    db_connection.onabort = function (e) {
                        status.ConStatus = ConnectionStatus.Closed;
                        status.LastError = "Connection aborted";
                    };

                    if (onSuccess != null) {
                        onSuccess(table_created_list);
                    }
                    // save dbSchema in keystore
                    KeyStore.set("JsStore_" + active_db._name + "_Schema", active_db);
                };

                db_request.onupgradeneeded = function (event) {
                    var db = (event as any).target.result;
                    active_db._tables.forEach(function (item) {
                        if (item._requireDelete) {
                            // Delete the old datastore.    
                            if (db.objectStoreNames.contains(item._name)) {
                                db.deleteObjectStore(item._name);
                            }
                            createObjectStore(db, item);
                        }
                        else if (item._requireCreation) {
                            createObjectStore(db, item);
                        }
                    });
                };

                var createObjectStore = function (db_connection, item: Table) {
                    try {
                        if (item._primaryKey.length > 0) {
                            var store = db_connection.createObjectStore(item._name, {
                                keyPath: item._primaryKey
                            });
                            item._columns.forEach(function (column: Column) {
                                var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                if (column._multiEntry) {
                                    options['multiEntry'] = true;
                                }
                                store.createIndex(column._name, column._name, options);
                                if (column._autoIncrement) {
                                    KeyStore.set(
                                        "JsStore_" + active_db._name + "_" + item._name + "_" + column._name + "_Value",
                                        0
                                    );
                                }
                            });
                        }
                        else {
                            var store = db_connection.createObjectStore(item._name, {
                                autoIncrement: true
                            });
                            item._columns.forEach(function (column: Column) {
                                store.createIndex(column._name, column._name, { unique: column._unique });
                                if (column._autoIncrement) {
                                    KeyStore.set(
                                        "JsStore_" + active_db._name + "_" + item._name + "_" + column._name + "_Value",
                                        0
                                    );
                                }
                            });
                        }
                        table_created_list.push(item._name);
                        // setting the table version
                        KeyStore.set("JsStore_" + active_db._name + "_" + item._name + "_Version", item._version);
                    }
                    catch (e) {
                        console.error(e);
                    }
                };
            }
        }
    }
}
