import Column = JsStorage.Model.Column;
module JsStorage {
    export module Business {
        export class IndexDbLogic {
            DbConnection;
            openDataBase = function (dbVersion: number, dataBase: DataBase) {
                var That: IndexDbLogic = this;
                var DbRequest = window.indexedDB.open(dataBase.Name, dbVersion);

                DbRequest.onerror = function (event) {
                    throw "Error in opening DataBase"
                };

                DbRequest.onsuccess = function (event) {
                    That.DbConnection = DbRequest.result;
                };

                DbRequest.onupgradeneeded = function (event) {
                    var db = (<any>event).target.result;
                    dataBase.Tables.forEach(function (item) {
                        if (item.RequireDelete) {
                            // Delete the old datastore.    
                            if (db.objectStoreNames.contains(item.Name)) {
                                db.deleteObjectStore(item.Name);
                            }
                            That.createObjectStore(db, item);
                        }
                        else if (item.RequireCreation) {
                            That.createObjectStore(db, item);
                        }
                    })

                }
            }

            get(query: IQuery) {
                
            }

            and() {
                return this;
            }

            private createObjectStore(dbConnection, item: Table) {
                try {
                    if (item.PrimaryKey.length > 0) {
                        var Store = dbConnection.createObjectStore(item.Name, {
                            keyPath: item.PrimaryKey
                        });
                        item.Columns.forEach(function (column: Column) {
                            if (!column.Primarykey) {
                                Store.createIndex(item.Name, item.Name, { unique: false });
                            }
                        })
                    }
                    else {
                        var store = dbConnection.createObjectStore(item.Name, {
                            autoIncrement: true
                        });
                        item.Columns.forEach(function (column: Column) {
                            Store.createIndex(item.Name, item.Name, { unique: false });
                        })
                    }
                    localStorage.setItem("JsStorage_" + item.Name, item.Version.toString());
                }
                catch (e) {
                    console.warn(e);
                }
            }

        }
    }
}