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

            public dropDb(name: string, onSuccess: Function, onError: Function) {
                var DbDeleteRequest = window.indexedDB.deleteDatabase(name);
                DbDeleteRequest.onsuccess = function () {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }
                DbDeleteRequest.onerror = function (e) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
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
                                if (!column.PrimaryKey) {
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
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.From], "readonly"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.From),
                    onSuceessGetRequest = function (event) {
                        var Result = (<any>event).target.result;
                        if (onSuccess != null) {
                            onSuccess(Result);
                        }
                    },

                    onErrorGetRequest = function (e) {
                        if (ErrorCount == 1) {
                            if (onError != null) {
                                onError((e as any).target.error);
                            }
                        }
                    };
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
                    var PrimaryKey = this.getPrimaryKey(query.From);
                    query.Where.every(function (condition, index) {
                        if (!ErrorOccured) {
                            var Error = That.isWhereValid(condition)
                            if (ErrorType != null) {
                                var ErrorObj = {
                                    target: {
                                        error: null
                                    }
                                }
                                if (Error == ErrorType.UndefinedColumn) {
                                    ErrorObj.target.error = UtilityLogic.getError(Error, null);
                                }
                                else if (Error == ErrorType.UndefinedValue) {
                                    ErrorObj.target.error = UtilityLogic.getError(Error, null);
                                }
                                ErrorOccured = true;
                                ++ErrorCount;
                                onErrorGetRequest(ErrorObj);
                            }
                            else {
                                if (PrimaryKey == condition.Column) {//(That.isPrimaryKey(query.From, condition)) {
                                    var GetRequest = ObjectStore.get(condition.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    }
                                }
                                else {
                                    var GetRequest = ObjectStore.index(condition.Column).get(condition.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = onErrorGetRequest;
                                }
                            }

                        }
                        return !ErrorOccured;
                    });

                }

            }

            public delete(query: IDelete, onSuccess: Function, onError: Function) {
                var That = this,
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readwrite"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table),
                    ErrorOccured: boolean = false,
                    ErrorCount = 0,
                    RowAffected = 0,
                    onSuceessRequest = function (rowsAffected) {
                        if (onSuccess != null) {
                            onSuccess(rowsAffected);
                        }
                    },

                    onErrorGetRequest = function (e) {
                        if (onError != null) {
                            onError((e as any).target.error);
                        }
                    };

                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(),
                        Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            Cursor.delete();
                            ++RowAffected;
                            (Cursor as any).continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (condition, index) {
                        if (!ErrorOccured) {
                            var Error = That.isWhereValid(condition)
                            if (ErrorType != null) {
                                var ErrorObj = {
                                    target: {
                                        error: null
                                    }
                                }
                                if (Error == ErrorType.UndefinedColumn) {
                                    ErrorObj.target.error = UtilityLogic.getError(Error, null);
                                }
                                else if (Error == ErrorType.UndefinedValue) {
                                    ErrorObj.target.error = UtilityLogic.getError(Error, null);
                                }
                                ErrorOccured = true;
                                ++ErrorCount;
                                onErrorGetRequest(ErrorObj);
                            }
                            else {
                                var PrimaryKey = this.getPrimaryKey(query.Table);
                                if (PrimaryKey == condition.Column) {
                                    var GetRequest = ObjectStore.get(condition.Value);
                                    GetRequest.onsuccess = function (event) {
                                        var Result = (<any>event).target.result;
                                        var DelteRequest = ObjectStore.delete(Result);
                                        DelteRequest.onsuccess = function () {
                                            ++ExecutionNo; ++RowAffected;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                        DelteRequest.onerror = function (e) {
                                            ErrorOccured = true; ++ErrorCount;
                                            onErrorGetRequest(e);
                                        }
                                    }
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    }
                                }
                                else {
                                    var CursorOpenRequest = ObjectStore.index(condition.Column).openCursor(IDBKeyRange.only(condition.Value)),
                                        ExecutionNo = 0;

                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;

                                        if (Cursor) {
                                            Cursor.delete();
                                            ++RowAffected;
                                            Cursor.continue();
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


            }

            public update(query: IUpdate, onSuccess: Function, onError: Function) {
                var That = this,
                    ErrorOccured: boolean = false,
                    ErrorCount = 0,
                    RowAffected = 0,
                    ErrorObj = {
                        target: {
                            error: null
                        }
                    },
                    Transaction: IDBTransaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readwrite"),
                    ObjectStore: IDBObjectStore = Transaction.objectStore(query.Table),
                    onSuceessRequest = function (rowsAffected) {
                        if (onSuccess != null) {
                            onSuccess(rowsAffected);
                        }
                    },

                    onErrorGetRequest = function (e) {
                        if (ErrorCount == 1) {
                            if (onError != null) {
                                onError((e as any).target.error);
                            }
                        }
                    };
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            for (var key in query.Set) {
                                Cursor.value[key] = query.Set[key];
                            }
                            Cursor.update(Cursor.value);
                            ++RowAffected;
                            (Cursor as any).continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }

                    }
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    var column,
                        ConditionLength = Object.keys(query.Where).length;
                    for (column in query.Where) {
                        if (!ErrorOccured) {
                            //var PrimaryKey = That.getPrimaryKey(query.Table);
                            if (ObjectStore.keyPath != null && ObjectStore.keyPath == column) {
                                var GetRequest = ObjectStore.get(query.Where[column]);

                                GetRequest.onsuccess = function (event) {
                                    var Result = (<any>event).target.result;
                                    ++ExecutionNo;
                                    if (Result != undefined) {
                                        for (var key in query.Set) {
                                            Result[key] = query.Set[key];
                                        }
                                        var UpdateRequest = ObjectStore.put(Result);
                                        UpdateRequest.onsuccess = function () {
                                            ++RowAffected;
                                            if (ExecutionNo == ConditionLength) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                        UpdateRequest.onerror = function (e) {
                                            ErrorOccured = true; ++ErrorCount;
                                            onErrorGetRequest(e);
                                        }
                                    }

                                }
                                GetRequest.onerror = function (e) {
                                    ErrorOccured = true; ++ErrorCount;
                                    onErrorGetRequest(e);
                                }
                            }
                            else {
                                // var GetRequest = ObjectStore.index(item.Column);
                                if (ObjectStore.indexNames.contains(column)) {
                                    var CursorOpenRequest = ObjectStore.index(column).openCursor(IDBKeyRange.only(query.Where[column])),
                                        ExecutionNo = 0;

                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            for (var key in query.Set) {
                                                Cursor.value[key] = query.Set[key];
                                            }
                                            Cursor.update(Cursor.value);
                                            ++RowAffected;
                                            Cursor.continue();
                                        }
                                        else {
                                            ++ExecutionNo;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                    }


                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    }
                                }
                                else {
                                    ErrorObj.target.error = UtilityLogic.getError(ErrorType.ColumnNotExist, { columnName: column });
                                }
                            }
                        }
                    }



                }

            }

            public insert(tableName: string, values, onSuccess: Function, onError: Function) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0,
                        Store: IDBObjectStore = this.DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
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
                catch (ex) {
                    console.error(ex);
                }
            }


            // private isPrimaryKey(tablename: string, condition: ICondition) {
            //     var IsPrimaryKey = false;
            //     this.ActiveDataBase.Tables.every(function (table) {
            //         if (table.Name == tablename) {
            //             table.Columns.every(function (column) {
            //                 if (column.PrimaryKey) {
            //                     IsPrimaryKey = true;
            //                     return true;
            //                 }
            //                 return false;
            //             })
            //         }
            //         return false;
            //     })
            //     return IsPrimaryKey;

            //     //return localStorage.getItem("JsStorage_" + tablename + "_" + condition.Column).toLowerCase() == "true" ? true : false

            // }

            private getPrimaryKey(tablename: string) {
                var PrimaryKeyColumn = "";
                this.ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tablename) {
                        table.Columns.every(function (column) {
                            if (column.PrimaryKey) {
                                PrimaryKeyColumn = column.Name;
                                return true;
                            }
                            return false;
                        })
                    }
                    return false;
                })
                return PrimaryKeyColumn;
            }

            private isWhereValid(condition: ICondition) {
                if (condition.Column == undefined) {
                    return ErrorType.UndefinedColumn;
                }
                else if (condition.Value == undefined) {
                    return ErrorType.UndefinedValue;
                }
                return null;

            }

            private IsWhereValid(tablename: string, isprimaryKey: boolean, condition: any) {

                if (condition.Column == undefined) {
                    return ErrorType.UndefinedColumn;
                }
                else if (condition.Value == undefined) {
                    return ErrorType.UndefinedValue;
                }
                return null;

            }



        }
    }
}