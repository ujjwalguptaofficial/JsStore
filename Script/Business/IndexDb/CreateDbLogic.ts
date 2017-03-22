module JsStorage {
    export module Business {
        export module IndexDb {
            export class CreateDbLogic {
                constructor(objMain: Main, onSuccess: Function, onError: Function) {
                    var That = this,
                        DbVersion = Number(localStorage.getItem(ActiveDataBase.Name + 'Db_Version')),
                        DbRequest = window.indexedDB.open(ActiveDataBase.Name, DbVersion);

                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError((event as any).target.error);
                        }
                    };

                    DbRequest.onsuccess = function (event) {
                        objMain.Status.ConStatus = ConnectionStatus.Connected;
                        DbConnection = DbRequest.result;
                        DbConnection.onclose = function () {
                            objMain.Status.ConStatus = ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
                        }

                        DbConnection.onerror = function (e) {

                        }

                        DbConnection.onabort = function (e) {
                            objMain.Status.ConStatus = ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
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
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                })
                            }
                            //setting the table version
                            localStorage.setItem("JsStorage_" + ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }
    }
}