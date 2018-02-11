namespace JsStore {
    export namespace Business {
        export class CreateDb {
            constructor(tablesMetaData: Model.TableHelper[],
                onSuccess: (listOf) => void, onError: (err: IError) => void) {

                var table_created_list = [],
                    db_request = indexedDB.open(active_db._name, db_version);

                db_request.onerror = function (event) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };

                db_request.onsuccess = function (event) {
                    db_status.ConStatus = Connection_Status.Connected;
                    db_connection = db_request.result;
                    (db_connection as any).onclose = function (e) {
                        callDbDroppedByBrowser();
                        Utils.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                    };

                    db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            (e.target as any).close(); // Manually close our connection to the db
                            callDbDroppedByBrowser(true);
                            Utils.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                        }
                    };

                    db_connection.onerror = function (e) {
                        db_status.LastError = ("Error occured in connection :" + (e.target as any).result) as any;
                    };

                    db_connection.onabort = function (e) {
                        db_status = {
                            ConStatus: Connection_Status.Closed,
                            LastError: Error_Type.ConnectionAborted
                        };
                    };

                    if (onSuccess != null) {
                        onSuccess(table_created_list);
                    }
                };

                db_request.onupgradeneeded = function (event) {
                    db_connection = (event as any).target.result;
                    tablesMetaData.forEach(function (item: Model.TableHelper, index) {
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

                var createObjectStore = function (item: Model.TableHelper, index) {
                    try {
                        if (item._primaryKey.length > 0) {
                            active_db._tables[index]._primaryKey = item._primaryKey;
                            var store = db_connection.createObjectStore(item._name, {
                                keyPath: item._primaryKey
                            });
                            item._columns.forEach(function (column: Column) {
                                if (column._enableSearch === true) {
                                    var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                    options['multiEntry'] = column._multiEntry;
                                    store.createIndex(column._name, column._name, options);
                                    if (column._autoIncrement) {
                                        KeyStore.set(
                                            "JsStore_" + active_db._name + "_" + item._name +
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
                            item._columns.forEach(function (column: Column) {
                                var options = { unique: column._unique, multiEntry: column._multiEntry };
                                store.createIndex(column._name, column._name, options);
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
