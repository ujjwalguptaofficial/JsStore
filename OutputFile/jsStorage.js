var JsStorage;
(function (JsStorage) {
    var DBType;
    (function (DBType) {
        DBType[DBType["IndexedDb"] = 0] = "IndexedDb";
        DBType[DBType["WebSql"] = 1] = "WebSql";
    })(DBType = JsStorage.DBType || (JsStorage.DBType = {}));
    ;
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["UndefinedColumn"] = 0] = "UndefinedColumn";
        ErrorType[ErrorType["UndefinedValue"] = 1] = "UndefinedValue";
        ErrorType[ErrorType["UndefinedColumnName"] = 2] = "UndefinedColumnName";
        ErrorType[ErrorType["UndefinedColumnValue"] = 3] = "UndefinedColumnValue";
        ErrorType[ErrorType["NotArray"] = 4] = "NotArray";
        ErrorType[ErrorType["NoValueSupplied"] = 5] = "NoValueSupplied";
        ErrorType[ErrorType["ColumnNotExist"] = 6] = "ColumnNotExist";
    })(ErrorType = JsStorage.ErrorType || (JsStorage.ErrorType = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var UtilityLogic = (function () {
            function UtilityLogic() {
            }
            UtilityLogic.getError = function (errorType, logError, errorDetail) {
                if (logError === void 0) { logError = false; }
                var Error = {
                    Name: JsStorage.ErrorType[errorType],
                    Value: ''
                };
                switch (errorType) {
                    case JsStorage.ErrorType.NotArray:
                        Error.Value = "Supplied value is not an array";
                        break;
                    case JsStorage.ErrorType.UndefinedColumn:
                        Error.Value = "Column is undefined in Where";
                        break;
                    case JsStorage.ErrorType.UndefinedValue:
                        Error.Value = "Value is undefined in Where";
                        break;
                    case JsStorage.ErrorType.UndefinedColumnName:
                        Error.Value = "column name is undefined";
                        break;
                    case JsStorage.ErrorType.UndefinedColumnValue:
                        Error.Value = "column value is undefined";
                        break;
                    case JsStorage.ErrorType.NoValueSupplied:
                        Error.Value = "no value supplied";
                        break;
                    case JsStorage.ErrorType.ColumnNotExist:
                        Error.Value = "column :" + errorDetail['ColumnName'] + " does not exist";
                        break;
                    default: console.warn('the error type is not defined');
                }
                if (logError) {
                    var ErrorDesc = {
                        Detail: Error
                    };
                    console.warn("Error occured : - " + ErrorDesc);
                }
                return Error;
            };
            UtilityLogic.convertObjectintoLowerCase = function (obj) {
                var keys = Object.keys(obj);
                var n = keys.length;
                while (n--) {
                    var key = keys[n];
                    obj[key.toLowerCase()] = obj[key];
                    delete obj[key];
                }
            };
            return UtilityLogic;
        }());
        Business.UtilityLogic = UtilityLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var Column = (function () {
            function Column(key, tableName) {
                if (key.Name != null) {
                    this.Name = key.Name;
                }
                else {
                    throw "Column Name is not defined for table:" + tableName;
                }
                this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
            }
            return Column;
        }());
        Model.Column = Column;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var Table = (function () {
            function Table(table, dbName) {
                this.Name = "";
                this.Columns = [];
                //internal Members
                this.RequireDelete = false;
                this.RequireCreation = false;
                this.PrimaryKey = "";
                this.Name = table.Name.toLowerCase();
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item, table.Name));
                });
                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey();
            }
            //private methods
            Table.prototype.setPrimaryKey = function () {
                //this.Key = new Column();//
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                    }
                    else if (item.PrimaryKey && That.PrimaryKey.length > 0) {
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                        throw "Multiple primary key are not allowed";
                    }
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var TableVersion = localStorage.getItem("JsStorage_" + dbName + "_" + this.Name);
                if (TableVersion == null || localStorage.getItem('JsStorage_Db_Version') == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
                this.Version = this.Version == null ? 1 : this.Version;
            };
            Table.prototype.setDbVersion = function (dbName) {
                if (this.Version == null) {
                    localStorage.setItem(dbName + 'Db_Version', '1');
                }
                else if (this.Version > Number(localStorage.getItem(dbName + 'Db_Version'))) {
                    localStorage.setItem(dbName + 'Db_Version', this.Version.toString());
                }
            };
            return Table;
        }());
        Model.Table = Table;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var DataBase = (function () {
            function DataBase(dataBase) {
                this.Tables = [];
                this.Name = dataBase.Name.toLowerCase();
                var That = this;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Model.Table(item, That.Name));
                });
            }
            return DataBase;
        }());
        Model.DataBase = DataBase;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var WebSqlLogic = (function () {
            function WebSqlLogic() {
            }
            return WebSqlLogic;
        }());
        Business.WebSqlLogic = WebSqlLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var CreateDbLogic = (function () {
                function CreateDbLogic(objMain, onSuccess, onError) {
                    var That = this, DbVersion = Number(localStorage.getItem(IndexDb.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(IndexDb.ActiveDataBase.Name, DbVersion);
                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbRequest.onsuccess = function (event) {
                        objMain.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                        IndexDb.DbConnection = DbRequest.result;
                        IndexDb.DbConnection.onclose = function () {
                            objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
                        };
                        IndexDb.DbConnection.onerror = function (e) {
                        };
                        IndexDb.DbConnection.onabort = function (e) {
                            objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
                        };
                        if (onSuccess != null) {
                            onSuccess(objMain);
                        }
                    };
                    DbRequest.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        IndexDb.ActiveDataBase.Tables.forEach(function (item) {
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
                        });
                    };
                    var createObjectStore = function (dbConnection, item) {
                        try {
                            if (item.PrimaryKey.length > 0) {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    keyPath: item.PrimaryKey
                                });
                                item.Columns.forEach(function (column) {
                                    if (!column.PrimaryKey) {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                            else {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    autoIncrement: true
                                });
                                item.Columns.forEach(function (column) {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                });
                            }
                            //setting the table version
                            localStorage.setItem("JsStorage_" + IndexDb.ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                        }
                        catch (e) {
                            console.error(e);
                        }
                    };
                }
                return CreateDbLogic;
            }());
            IndexDb.CreateDbLogic = CreateDbLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var DeleteLogic = (function () {
                function DeleteLogic(query, onSuccess, onError) {
                    var That = this, Transaction = IndexDb.DbConnection.transaction([query.From], "readwrite"), ObjectStore = Transaction.objectStore(query.From), ErrorOccured = false, ErrorCount = 0, RowAffected = 0, onSuceessRequest = function (rowsAffected) {
                        if (onSuccess != null) {
                            onSuccess(rowsAffected);
                        }
                    }, onErrorGetRequest = function (e) {
                        if (onError != null) {
                            onError(e.target.error);
                        }
                    };
                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++RowAffected;
                                Cursor.continue();
                            }
                            else {
                                onSuceessRequest(RowAffected);
                            }
                        };
                        CursorOpenRequest.onerror = onErrorGetRequest;
                    }
                    else {
                        var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length;
                        for (Column in query.Where) {
                            if (!ErrorOccured) {
                                if (ObjectStore.keyPath != null && ObjectStore.keyPath == Column) {
                                    var DeleteRequest = ObjectStore.delete(query.Where[Column]);
                                    DeleteRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                    DeleteRequest.onsuccess = function (event) {
                                        var Result = event.target.result;
                                        ++ExecutionNo;
                                        ++RowAffected;
                                        if (ExecutionNo == query.Where.length) {
                                            onSuceessRequest(RowAffected);
                                        }
                                    };
                                }
                                else if (ObjectStore.indexNames.contains(Column)) {
                                    var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])), ExecutionNo = 0;
                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
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
                                    };
                                }
                                else {
                                    Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }
                        }
                    }
                }
                return DeleteLogic;
            }());
            IndexDb.DeleteLogic = DeleteLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var DropDbLogic = (function () {
                function DropDbLogic(name, onSuccess, onError) {
                    var DbDropRequest = window.indexedDB.deleteDatabase(name);
                    DbDropRequest.onsuccess = function () {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    DbDropRequest.onerror = function (e) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                }
                return DropDbLogic;
            }());
            IndexDb.DropDbLogic = DropDbLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var InsertLogic = (function () {
                function InsertLogic(tableName, values, onSuccess, onError) {
                    try {
                        tableName = tableName.toLowerCase();
                        var TotalRowsAffected = 0, Store = IndexDb.DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError(e.target.error, TotalRowsAffected);
                                }
                            };
                            AddResult.onsuccess = function (e) {
                                ++TotalRowsAffected;
                                if (values.length == TotalRowsAffected) {
                                    if (onSuccess != null) {
                                        onSuccess(TotalRowsAffected);
                                    }
                                }
                            };
                        });
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                return InsertLogic;
            }());
            IndexDb.InsertLogic = InsertLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var OpenDbLogic = (function () {
                function OpenDbLogic(objMain, onSuccess, onError) {
                    if (objMain.Status.ConStatus != JsStorage.ConnectionStatus.Connected) {
                        if (IndexDb.ActiveDataBase.Name.length > 0) {
                            var DbVersion = Number(localStorage.getItem(IndexDb.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(IndexDb.ActiveDataBase.Name, DbVersion), That = this;
                            DbRequest.onerror = function (event) {
                                if (onError != null) {
                                    onError(event.target.error);
                                }
                            };
                            DbRequest.onsuccess = function (event) {
                                objMain.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                                IndexDb.DbConnection = DbRequest.result;
                                IndexDb.DbConnection.onclose = function () {
                                    objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                    objMain.Status.LastError = "Connection Closed, trying to reconnect";
                                };
                                IndexDb.DbConnection.onerror = function (e) {
                                };
                                IndexDb.DbConnection.onabort = function (e) {
                                    objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                    objMain.Status.LastError = "Connection Closed, trying to reconnect";
                                };
                                if (onSuccess != null) {
                                    onSuccess(objMain);
                                }
                            };
                        }
                        else {
                            if (onError != null) {
                                onError({
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
                return OpenDbLogic;
            }());
            IndexDb.OpenDbLogic = OpenDbLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var SelectLogic = (function () {
                function SelectLogic(query, onSuccess, onError) {
                    var That = this, ErrorOccured = false, ErrorCount = 0, Results = [], Transaction = IndexDb.DbConnection.transaction([query.From], "readonly"), ObjectStore = Transaction.objectStore(query.From), onSuceessRequest = function () {
                        if (onSuccess != null) {
                            onSuccess(Results);
                        }
                    }, onErrorRequest = function (e) {
                        if (ErrorCount == 1) {
                            if (onError != null) {
                                onError(e.target.error);
                            }
                        }
                    };
                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Results.push(Cursor.value);
                                Cursor.continue();
                            }
                            else {
                                if (onSuccess != null) {
                                    onSuceessRequest();
                                }
                            }
                        };
                        CursorOpenRequest.onerror = onErrorRequest;
                    }
                    else {
                        var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length, Results = [], OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                onSuceessRequest();
                            }
                        };
                        for (Column in query.Where) {
                            if (!ErrorOccured) {
                                if (ObjectStore.keyPath != null && ObjectStore.keyPath == Column) {
                                    var GetRequest = ObjectStore.get(query.Where[Column]);
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorRequest(e);
                                    };
                                    GetRequest.onsuccess = OnSuccessGetRequest;
                                }
                                else if (ObjectStore.indexNames.contains(Column)) {
                                    var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            Results.push(Cursor);
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorRequest(e);
                                    };
                                }
                                else {
                                    Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }
                        }
                    }
                }
                SelectLogic.prototype.getPrimaryKey = function (tablename) {
                    var PrimaryKeyColumn = "";
                    IndexDb.ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tablename) {
                            table.Columns.every(function (column) {
                                if (column.PrimaryKey) {
                                    PrimaryKeyColumn = column.Name;
                                    return true;
                                }
                                return false;
                            });
                        }
                        return false;
                    });
                    return PrimaryKeyColumn;
                };
                SelectLogic.prototype.isWhereValid = function (condition) {
                    if (condition.Column == undefined) {
                        return JsStorage.ErrorType.UndefinedColumn;
                    }
                    else if (condition.Value == undefined) {
                        return JsStorage.ErrorType.UndefinedValue;
                    }
                    return null;
                };
                SelectLogic.prototype.IsWhereValid = function (tablename, isprimaryKey, condition) {
                    if (condition.Column == undefined) {
                        return JsStorage.ErrorType.UndefinedColumn;
                    }
                    else if (condition.Value == undefined) {
                        return JsStorage.ErrorType.UndefinedValue;
                    }
                    return null;
                };
                return SelectLogic;
            }());
            IndexDb.SelectLogic = SelectLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var UpdateLogic = (function () {
                function UpdateLogic(query, onSuccess, onError) {
                    var That = this, ErrorOccured = false, ErrorCount = 0, RowAffected = 0, Transaction = IndexDb.DbConnection.transaction([query.In], "readwrite"), ObjectStore = Transaction.objectStore(query.In), onSuceessRequest = function (rowsAffected) {
                        if (onSuccess != null) {
                            onSuccess(rowsAffected);
                        }
                    }, onErrorGetRequest = function (e) {
                        if (ErrorCount == 1) {
                            if (onError != null) {
                                onError(e.target.error);
                            }
                        }
                    };
                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                for (var key in query.Set) {
                                    Cursor.value[key] = query.Set[key];
                                }
                                Cursor.update(Cursor.value);
                                ++RowAffected;
                                Cursor.continue();
                            }
                            else {
                                onSuceessRequest(RowAffected);
                            }
                        };
                        CursorOpenRequest.onerror = onErrorGetRequest;
                    }
                    else {
                        var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length;
                        for (Column in query.Where) {
                            if (!ErrorOccured) {
                                if (ObjectStore.keyPath != null && ObjectStore.keyPath == Column) {
                                    var GetRequest = ObjectStore.get(query.Where[Column]);
                                    GetRequest.onerror = function (event) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(event);
                                    };
                                    GetRequest.onsuccess = function (event) {
                                        var Result = event.target.result;
                                        ++ExecutionNo;
                                        if (Result != undefined) {
                                            for (var key in query.Set) {
                                                Result[key] = query.Set[key];
                                            }
                                            var UpdateRequest = ObjectStore.put(Result);
                                            UpdateRequest.onsuccess = function (e) {
                                                ++RowAffected;
                                                if (ExecutionNo == ConditionLength) {
                                                    onSuceessRequest(RowAffected);
                                                }
                                            };
                                            UpdateRequest.onerror = function (e) {
                                                ErrorOccured = true;
                                                ++ErrorCount;
                                                onErrorGetRequest(e);
                                            };
                                        }
                                    };
                                }
                                else {
                                    if (ObjectStore.indexNames.contains(Column)) {
                                        var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
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
                                        };
                                        CursorOpenRequest.onerror = function (e) {
                                            ErrorOccured = true;
                                            ++ErrorCount;
                                            onErrorGetRequest(e);
                                        };
                                    }
                                    else {
                                        Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    }
                                }
                            }
                        }
                    }
                }
                return UpdateLogic;
            }());
            IndexDb.UpdateLogic = UpdateLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var Table = JsStorage.Model.Table;
var Column = JsStorage.Model.Column;
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var MainLogic = (function () {
                function MainLogic(dataBase) {
                    this.openDb = function (objMain, onSuccess, onError) {
                        var ObjOpenDb = new IndexDb.OpenDbLogic(objMain, onSuccess, onError);
                    };
                    this.closeDb = function (objMain) {
                        if (objMain.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                            IndexDb.DbConnection.close();
                        }
                    };
                    this.dropDb = function (name, onSuccess, onError) {
                        var ObjDropDb = new IndexDb.DropDbLogic(name, onSuccess, onError);
                    };
                    this.update = function (query, onSuccess, onError) {
                        var ObjUpdate = new IndexDb.UpdateLogic(query, onSuccess, onError);
                    };
                    this.insert = function (tableName, values, onSuccess, onError) {
                        var ObjInsert = new IndexDb.InsertLogic(tableName, values, onSuccess, onError);
                    };
                    this.delete = function (query, onSuccess, onError) {
                        var ObjDelete = new IndexDb.DeleteLogic(query, onSuccess, onError);
                    };
                    this.select = function (query, onSuccess, onError) {
                        new IndexDb.SelectLogic(query, onSuccess, onError);
                    };
                    this.createDb = function (objMain, onSuccess, onError) {
                        new IndexDb.CreateDbLogic(objMain, onSuccess, onError);
                    };
                    IndexDb.ActiveDataBase = dataBase;
                }
                return MainLogic;
            }());
            IndexDb.MainLogic = MainLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var DataBase = JsStorage.Model.DataBase;
var JsStorage;
(function (JsStorage) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Closed"] = 2] = "Closed";
        ConnectionStatus[ConnectionStatus["NotStarted"] = 3] = "NotStarted";
    })(ConnectionStatus = JsStorage.ConnectionStatus || (JsStorage.ConnectionStatus = {}));
    var Main = (function () {
        function Main() {
            this.Status = {
                ConStatus: ConnectionStatus.NotStarted,
                LastError: ""
            };
            /**
                * determine and set the DataBase Type
                *
                *
                * @memberOf MainLogic
                */
            this.setDbType = function () {
                window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                if (indexedDB) {
                    this.DbType = JsStorage.DBType.IndexedDb;
                    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
                }
                else if (window.openDatabase) {
                    this.DbType = JsStorage.DBType.WebSql;
                }
                else {
                    throw 'Browser does not support Db Implementation';
                }
            };
            this.setDbType();
        }
        /**
         *
         *
         * @param {IDataBase} dataBase
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns
         *
         * @memberOf Main
         */
        Main.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                var Db = new DataBase(dataBase);
                this.IndexDbObj = new JsStorage.Business.IndexDb.MainLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                this.IndexDbObj.createDb(this, onSuccess, onError);
            }
            else {
                this.WebSqlObj = new JsStorage.Business.WebSqlLogic();
            }
            return this;
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.openDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.openDb(this, onSuccess, onError);
            }
            else {
            }
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.closeDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.closeDb(this);
            }
            else {
            }
        };
        Main.prototype.dropDb = function (name, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.dropDb(name.toLowerCase(), onSuccess, onError);
            }
            else {
            }
        };
        /**
         *
         *
         * @param {IQuery} query
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.select = function (query, onSuccess, onError) {
            query.From = query.From.toLowerCase();
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
                query.From = query.From.toLowerCase();
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.select(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (this.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 200);
            }
            else if (this.Status.ConStatus == ConnectionStatus.Closed) {
            }
        };
        /**
         *
         *
         * @param {string} table
         * @param {any} value
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.insert = function (query, onSuccess, onError) {
            if (!Array.isArray(query.Values)) {
                throw "Value should be array :- supplied value is not array";
            }
            else if (query.Values.length > 0) {
                query.Into = query.Into.toLowerCase();
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.insert(query.Into, query.Values, onSuccess, onError);
                }
                else {
                }
            }
            else {
                if (onError != null) {
                    onError(JsStorage.Business.UtilityLogic.getError(JsStorage.ErrorType.NoValueSupplied, true, null));
                }
            }
        };
        Main.prototype.update = function (query, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.update(query, onSuccess, onError);
            }
            else {
            }
        };
        Main.prototype.delete = function (query, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.delete(query, onSuccess, onError);
            }
            else {
            }
        };
        return Main;
    }());
    JsStorage.Main = Main;
})(JsStorage || (JsStorage = {}));
/// <reference path="Business/CommonLogic.ts" />
/// <reference path="Business/UtilityLogic.ts" />
/// <reference path="Model/Column.ts" />
/// <reference path="Model/Table.ts" />
/// <reference path="Model/DataBase.ts" />
/// <reference path="Business/WebSqlLogic.ts" />
/// <reference path="Business/IndexDb/CreateDbLogic.ts" />
/// <reference path="Business/IndexDb/DeleteLogic.ts" />
/// <reference path="Business/IndexDb/DropDbLogic.ts" />
/// <reference path="Business/IndexDb/InsertLogic.ts" />
/// <reference path="Business/IndexDb/OpenDbLogic.ts" />
/// <reference path="Business/IndexDb/SelectLogic.ts" />
/// <reference path="Business/IndexDb/UpdateLogic.ts" />
/// <reference path="Business/IndexDb/MainLogic.ts" />
/// <reference path="Business/MainLogic.ts" />
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var DbHelperLogic = (function () {
            function DbHelperLogic() {
            }
            DbHelperLogic.prototype.and = function () {
                return this;
            };
            DbHelperLogic.prototype.or = function () {
                return this;
            };
            return DbHelperLogic;
        }());
        Business.DbHelperLogic = DbHelperLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
/// <reference path="CommonLogic.ts" />
//# sourceMappingURL=JsStorage.js.map