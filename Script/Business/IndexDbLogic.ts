import Table = JsStorage.Model.Table;
import Column = JsStorage.Model.Column;
module JsStorage {
    export module Business {
        export class IndexDbLogic {
            DbConnection;
            ActiveDataBase: DataBase;
            constructor(dataBase: DataBase) {
                this.ActiveDataBase = dataBase
            }

            openDb(objMain: Main, onSuccess: Function, onError: Function) {
                if (objMain.Status.ConStatus != ConnectionStatus.Connected) {
                    if (this.ActiveDataBase.Name.length > 0) {
                        var DbVersion = Number(localStorage.getItem(this.ActiveDataBase.Name + 'Db_Version')),
                            DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, DbVersion),
                            That = this;
                        DbRequest.onerror = function (event) {
                            if (onError != null) {
                                onError((event as any).target.error);
                            }
                        };

                        DbRequest.onsuccess = function (event) {
                            objMain.Status.ConStatus = ConnectionStatus.Connected;
                            That.DbConnection = DbRequest.result;
                            That.DbConnection.onclose = function () {
                                objMain.Status.ConStatus = ConnectionStatus.Closed;
                                objMain.Status.LastError = "Connection Closed, trying to reconnect";
                            }

                            That.DbConnection.onerror = function (e) {

                            }

                            That.DbConnection.onabort = function (e) {
                                objMain.Status.ConStatus = ConnectionStatus.Closed;
                                objMain.Status.LastError = "Connection Closed, trying to reconnect";
                            }

                            if (onSuccess != null) {
                                onSuccess(objMain);
                            }
                        };
                    }
                    else {
                        if (onError != null) {
                            onError(<IError>{
                                Name: "DbNotFound",
                                Value: "DataBase name is not found, please first initiate the db using createDb"
                            });
                        }
                    }
                }
                else {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }
            }

            public closeDb(objMain: Main) {
                if (objMain.Status.ConStatus == ConnectionStatus.Connected) {
                    this.DbConnection.close();
                }
            }

            public createDb = function (objMain: Main, onSuccess: Function, onError: Function) {
                var That = this,
                    DbVersion = Number(localStorage.getItem(this.ActiveDataBase.Name + 'Db_Version')),
                    DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, DbVersion);

                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };

                DbRequest.onsuccess = function (event) {
                    objMain.Status.ConStatus = ConnectionStatus.Connected;
                    That.DbConnection = DbRequest.result;
                    That.DbConnection = DbRequest.result;
                    That.DbConnection.onclose = function () {
                        objMain.Status.ConStatus = ConnectionStatus.Closed;
                        objMain.Status.LastError = "Connection Closed, trying to reconnect";
                    }

                    That.DbConnection.onerror = function (e) {

                    }

                    That.DbConnection.onabort = function (e) {
                        objMain.Status.ConStatus = ConnectionStatus.Closed;
                        objMain.Status.LastError = "Connection Closed, trying to reconnect";
                    }

                    if (onSuccess != null) {
                        onSuccess(objMain);
                    }
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

                var createObjectStore = function (dbConnection, item: Table) {
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
                        localStorage.setItem("JsStorage_" + That.ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }

            public select(query: ISelect, onSuccess: Function, onError: Function) {
                var That = this,
                    ErrorOccured: boolean = false,
                    ErrorCount = 0,
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(),
                        Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = (<any>e).target.result;
                        console.log(TempResult);
                        if (TempResult) {
                            Results.push(TempResult.value);
                            (TempResult as any).continue();
                        }
                        else {
                            if (onSuccess != null) {
                                onSuccess(Results);
                            }
                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (item, index) {
                        if (!ErrorOccured) {
                            if (item.Column == undefined) {
                                throw "Column is undefined in Case for tableName:" + query.Table;
                            }
                            else if (item.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + item.Column + "for tableName:" + query.Table;
                            }
                            else {
                                if (this.isPrimaryKey(query.Table, item)) {
                                    var GetRequest = ObjectStore.get(item.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    }
                                }
                                else {
                                    var GetRequest = ObjectStore.index(item.Column).get(item.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = onErrorGetRequest;
                                }
                            }

                        }
                        return !ErrorOccured;
                    });

                }

                var onSuceessGetRequest = function (event) {
                    var Result = (<any>event).target.result;
                    if (onSuccess != null) {
                        onSuccess(Result);
                    }
                }

                var onErrorGetRequest = function (e) {
                    if (ErrorCount == 1) {
                        if (onError != null) {
                            onError((e as any).target.error);
                        }
                    }
                }

            }

            public delete(query: IDelete, onSuccess: Function, onError: Function) {
                var That = this,
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(),
                        Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = (<any>e).target.result;
                        console.log(TempResult);
                        if (TempResult) {
                            Results.push(TempResult.value);
                            (TempResult as any).continue();
                        }
                        else {
                            if (onSuccess != null) {
                                onSuccess(Results);
                            }
                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    // if (query.Case.Column == undefined) {
                    //     throw "Column is undefined in Case for tableName:" + query.Table;
                    // }
                    // else if (query.Case.Value == undefined) {
                    //     throw "Column value is undefined in Case for Column Name:" + query.Case.Column + "for tableName:" + query.Table;
                    // }
                    // else {
                    //     if (this.isPrimaryKey(query)) {
                    //         var GetRequest = ObjectStore.delete(query.Case.Value);
                    //         GetRequest.onsuccess = onSuceessGetRequest;
                    //         GetRequest.onerror = onErrorGetRequest;
                    //     }
                    //     else {
                    //         var GetRequest = ObjectStore.index(query.Case.Column).get(query.Case.Value);

                    //         GetRequest.onsuccess = onSuceessGetRequest;
                    //         GetRequest.onerror = onErrorGetRequest;
                    //     }
                    // }
                }

                var onSuceessGetRequest = function (event) {
                    var Result = (<any>event).target.result;
                    if (onSuccess != null) {
                        onSuccess(Result);
                    }
                }

                var onErrorGetRequest = function (e) {
                    if (onError != null) {
                        onError((e as any).target.error);
                    }
                }

            }

            public update(query: IUpdate, onSuccess: Function, onError: Function) {
                var That = this,
                    ErrorOccured: boolean = false,
                    ErrorCount = 0,
                    RowAffected = 0,
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            query.Set.forEach(function (item) {
                                Cursor.value[item.Column] = item.Value;
                            });
                            (Cursor as any).continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (item, index) {
                        if (!ErrorOccured) {
                            if (item.Column == undefined) {
                                throw "Column is undefined in Case for tableName:" + query.Table;
                            }
                            else if (item.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + item.Column + "for tableName:" + query.Table;
                            }
                            else {
                                if (this.isPrimaryKey(query.Table, item)) {
                                    var GetRequest = ObjectStore.put(item.Value);
                                    GetRequest.onsuccess = function () {
                                        onSuceessRequest(1);
                                    }
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    }
                                }
                                else {
                                    // var GetRequest = ObjectStore.index(item.Column);
                                    var CursorOpenRequest = ObjectStore.index(item.Column).openCursor(IDBKeyRange.only(item.Value)),
                                        ExecutionNo = 0;

                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = (<any>e).target.result;

                                        if (Cursor) {
                                            // if (Cursor.value.hasOwnProperty(item.Column)) {

                                            // }
                                            // else
                                            // {
                                            //     onErrorGetRequest(<Error>{
                                            //         Name:"ColumnNotExist",
                                            //          Value:"The column"+ + "does not exist"
                                            //     })
                                            // }
                                            Cursor.value[item.Column] = item.Value;
                                            ++RowAffected;
                                            Cursor.Continue();
                                        }
                                        else {
                                            ++ExecutionNo;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                    }

                                }
                                CursorOpenRequest.onerror = function (e) {
                                    ErrorOccured = true; ++ErrorCount;
                                    onErrorGetRequest(e);
                                }
                            }
                        }


                        return !ErrorOccured;
                    });

                }

                var onSuceessRequest = function (rowsAffected) {
                    if (onSuccess != null) {
                        onSuccess(rowsAffected);
                    }
                }

                var onErrorGetRequest = function (e) {
                    if (ErrorCount == 1) {
                        if (onError != null) {
                            onError((e as any).target.error);
                        }
                    }
                }

            }


            public and() {
                return this;
            }

            public insert(tableName: string, values, onSuccess: Function, onError: Function) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0,
                        Store: IDBObjectStore = this.DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                    if (!Array.isArray(values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (values.length > 0) {
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError((e as any).target.error, TotalRowsAffected);
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


            private isPrimaryKey(tablename: string, condition: ICondition) {
                return localStorage.getItem("JsStorage_" + tablename + "_" + condition.Column).toLowerCase() == "true" ? true : false

            }



        }
    }
}