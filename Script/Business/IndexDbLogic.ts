import Column = JsStorage.Model.Column;
module JsStorage {
    export module Business {
        export class IndexDbLogic {

            ActiveDataBase: DataBase;
            constructor(dataBase: DataBase) {
                this.ActiveDataBase = dataBase
            }
            public openDataBase = function (dbVersion: number, callBack: Function, objMain) {
                var That = this;
                var DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, dbVersion);

                DbRequest.onerror = function (event) {
                    throw "Error in opening DataBase";
                };

                DbRequest.onsuccess = function (event) {
                    IndexDbConnection = DbRequest.result;
                    if (callBack != null) {
                        callBack(objMain);
                    }
                    return objMain;
                };

                DbRequest.onupgradeneeded = function (event) {
                    var db = (<any>event).target.result;
                    That.ActiveDataBase.Tables.forEach(function (item) {
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

            public get(query: IQuery, callBack: Function) {
                var That = this,
                    Transaction: IDBTransaction = IndexDbConnection.transaction([query.Table.toLowerCase()], "readonly"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table);
                if (query.Case == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(),
                        Result = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = (<any>e).target.result;
                        console.log(TempResult);
                        if (TempResult) {

                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    if (query.Case.Column == undefined) {
                        throw "Column is undefined in Case for tableName:" + query.Table;
                    }
                    else if (query.Case.Value == undefined) {
                        throw "Column value is undefined in Case for Column Name:" + query.Case.Column + "for tableName:" + query.Table;
                    }
                    else {
                        if (this.isPrimaryKey(query)) {
                            var GetRequest = ObjectStore.get(query.Case.Value);
                            GetRequest.onsuccess = onSuceessGetRequest;
                            GetRequest.onerror = onErrorGetRequest;
                        }
                        else {
                            var GetRequest = ObjectStore.index(query.Case.Column).get(query.Case.Value);
                            GetRequest.onsuccess = onSuceessGetRequest;
                            GetRequest.onerror = onErrorGetRequest;
                        }
                    }
                }

                var onSuceessGetRequest = function (event) {
                    var Result = (<any>event).target.result;
                    if (callBack != null) {
                        callBack(Result);
                    }
                }

                var onErrorGetRequest = function (event) {
                    console.warn("Error occured in retrieving data");
                    callBack([]);
                }

            }


            public and() {
                return this;
            }

            public add(tableName: string, values, onSuccess: Function, onError: Function) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0,
                        Store: IDBObjectStore = IndexDbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                    if (!Array.isArray(values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (values.length > 0) {
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError(TotalRowsAffected);
                                }
                            }
                            AddResult.onsuccess = function (e) {
                                ++TotalRowsAffected
                                if (values.length == TotalRowsAffected) {
                                    if (onSuccess != null) {
                                        onSuccess(TotalRowsAffected);
                                    }
                                }
                            }
                        })

                    }
                    else {
                        throw "no value supplied";
                    }


                }
                catch (ex) {
                    console.error(ex);
                }
            }


            private isPrimaryKey(query: IQuery) {
                return localStorage.getItem("JsStorage_" + query.Table + "_" + query.Case.Column).toLowerCase() == "true" ? true : false

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
                    console.error(e);
                }
            }

        }
    }
}