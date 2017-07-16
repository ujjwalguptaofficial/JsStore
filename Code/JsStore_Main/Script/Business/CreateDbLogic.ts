module JsStore {
    export module Business {
        export class CreateDbLogic {
            constructor(objMain: Instance, dbVersion, onSuccess: Function, onError: Function) {
                var That = this,
                    DbRequest = window.indexedDB.open(ActiveDataBase.Name, dbVersion);

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
                        onSuccess(objMain);
                    }
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
                                if (column.PrimaryKey) {
                                    Store.createIndex(column.Name, column.Name, { unique: true });
                                }
                                else {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                }
                            })
                        }
                        else {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                autoIncrement: true
                            });
                            item.Columns.forEach(function (column: Column) {
                                if (column.Unique) {
                                    Store.createIndex(column.Name, column.Name, { unique: true });
                                } else {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                }
                            })
                        }
                        //setting the table version
                        localStorage.setItem("JsStore_" + ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }
}
