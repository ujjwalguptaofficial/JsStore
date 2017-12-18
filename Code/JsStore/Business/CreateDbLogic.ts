module JsStore {
    export module Business {
        export class CreateDb {
            constructor(dbVersion, onSuccess: Function, onError: Function) {
                var That = this,
                    DbCreatedList = [],
                    DbRequest = indexedDB.open(ActiveDataBase.Name, dbVersion);

                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };

                DbRequest.onsuccess = function (event) {
                    Status.ConStatus = ConnectionStatus.Connected;
                    DbConnection = DbRequest.result;
                    DbConnection.onclose = function () {
                        Status.ConStatus = ConnectionStatus.Closed;
                        Status.LastError = "Connection Closed";
                    }

                    DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            e.target.close(); // Manually close our connection to the db
                        }
                    };

                    DbConnection.onerror = function (e) {
                        Status.LastError = "Error occured in connection :" + e.target.result;
                    }

                    DbConnection.onabort = function (e) {
                        Status.ConStatus = ConnectionStatus.Closed;
                        Status.LastError = "Connection aborted";
                    }

                    if (onSuccess != null) {
                        onSuccess(DbCreatedList);
                    }
                    //save dbSchema in keystore
                    KeyStore.set("JsStore_" + ActiveDataBase.Name + "_Schema", ActiveDataBase);
                };

                DbRequest.onupgradeneeded = function (event) {
                    var db = (<any>event).target.result;
                    ActiveDataBase.Tables.forEach(function (item) {
                        if (item.RequireDelete) {
                            // Delete the old datastore.    
                            if (db.objectStoreNames.contains(item.Name)) {
                                db.deleteObjectStore(item.Name);
                            }
                            createObjectStore(db, item);
                        }
                        else if (item.RequireCreation) {
                            createObjectStore(db, item);
                        }
                    })

                }

                var createObjectStore = function (dbConnection, item: Table) {
                    try {
                        if (item.PrimaryKey.length > 0) {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                keyPath: item.PrimaryKey
                            });
                            item.Columns.forEach(function (column: Column) {
                                var Options = column.PrimaryKey ? { unique: true } : { unique: column.Unique };
                                if (column.MultiEntry) {
                                    Options['multiEntry'] = true;
                                }
                                Store.createIndex(column.Name, column.Name, Options);
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
                                }
                            })
                        }
                        else {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                autoIncrement: true
                            });
                            item.Columns.forEach(function (column: Column) {
                                Store.createIndex(column.Name, column.Name, { unique: column.Unique });
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
                                }
                            })
                        }
                        DbCreatedList.push(item.Name);
                        //setting the table version
                        KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + item.Name + "_Version", item.Version);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }
}
