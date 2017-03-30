var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        ErrorType[ErrorType["InvalidOp"] = 7] = "InvalidOp";
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
                    case JsStorage.ErrorType.InvalidOp:
                        Error.Value = "Invalid Op Value : " + errorDetail['Op'];
                        break;
                    case JsStorage.ErrorType.ColumnNotExist:
                        Error.Value = "column :" + errorDetail['ColumnName'] + " does not exist";
                        break;
                    default: console.warn('the error type is not defined');
                }
                if (logError) {
                    console.warn("JsStorage Error : - " + Error.Value);
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
                this.Unique = key.Unique != null ? key.Unique : false;
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
        var DbHelperLogic = (function () {
            function DbHelperLogic() {
                this.Results = [];
                this.doInner = function (query1, data1, query2, data2) {
                    if (data1[query1.Column] == data2[query2.Column]) {
                        this.Results.push((query1.Table = data1[0], data1), (query2.Table = data2[0], data2));
                    }
                };
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
                                    if (column.PrimaryKey) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
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
                                if (ObjectStore.indexNames.contains(Column)) {
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
                            else {
                                return;
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
            var BaseSelectLogic = (function (_super) {
                __extends(BaseSelectLogic, _super);
                function BaseSelectLogic() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ErrorOccured = false;
                    _this.ErrorCount = 0;
                    _this.SendResultFlag = true;
                    _this.onSuccessRequest = function () {
                        if (this.SendResultFlag && this.OnSuccess != null) {
                            this.OnSuccess(this.Results);
                        }
                    };
                    _this.onErrorRequest = function (e) {
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                this.OnError(e.target.error);
                            }
                        }
                    };
                    _this.getKeyRange = function (whereIn) {
                        var KeyRange;
                        switch (this.Query.WhereIn.Op) {
                            case '-':
                                KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End);
                                break;
                            case '>':
                                KeyRange = IDBKeyRange.lowerBound(whereIn.Value, true);
                                break;
                            case '>=':
                                KeyRange = IDBKeyRange.lowerBound(whereIn.Value);
                                break;
                            case '<':
                                KeyRange = IDBKeyRange.upperBound(whereIn.Value, true);
                                break;
                            case '<=':
                                KeyRange = IDBKeyRange.upperBound(whereIn.Value);
                                break;
                            default:
                                this.ErrorOccured = true;
                                Business.UtilityLogic.getError(JsStorage.ErrorType.InvalidOp, true, { Op: whereIn.Op });
                        }
                        return KeyRange;
                    };
                    _this.executeMultipleWhereInLogic = function (whereInArray) {
                        var That = this, WhereIn, ExecutionNo = 0, ConditionLength = Object.keys(this.Query.WhereIn).length, KeyRange, OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                this.OnSuceessRequest();
                            }
                        };
                        for (WhereIn in whereInArray) {
                            KeyRange = this.getKeyRange();
                            if (!this.ErrorOccured) {
                                var CursorOpenRequest, OnCursorSuccess = function (e) {
                                    var Cursor = e.target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }, OnCursorError = function (e) {
                                    That.ErrorOccured = true;
                                    ++That.ErrorCount;
                                    That.OnErrorRequest(e);
                                };
                                if (this.Query.WhereIn.Op == '-') {
                                    CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                                    CursorOpenRequest.onsuccess = OnCursorSuccess;
                                    CursorOpenRequest.onerror = OnCursorError;
                                }
                                else if (this.ObjectStore.indexNames.contains(WhereIn.Column)) {
                                    CursorOpenRequest = this.ObjectStore.index(WhereIn.Column).openCursor(KeyRange);
                                    CursorOpenRequest.onsuccess = OnCursorSuccess;
                                    CursorOpenRequest.onerror = OnCursorError;
                                }
                                else {
                                    Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }
                            else {
                                return;
                            }
                        }
                    };
                    _this.executeSingleWhereInLogic = function (whereIn) {
                        var That = this, KeyRange = this.getKeyRange(whereIn);
                        if (!this.ErrorOccured) {
                            var CursorOpenRequest, OnCursorSuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                                else {
                                    That.onSuccessRequest();
                                }
                            }, OnCursorError = function (e) {
                                this.ErrorOccured = true;
                                ++this.ErrorCount;
                                this.OnErrorRequest(e);
                            };
                            if (whereIn.Op == '-') {
                                CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                                CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else {
                                Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                            }
                        }
                    };
                    return _this;
                }
                return BaseSelectLogic;
            }(Business.DbHelperLogic));
            IndexDb.BaseSelectLogic = BaseSelectLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var SelectJoinLogic = (function (_super) {
                __extends(SelectJoinLogic, _super);
                function SelectJoinLogic(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.QueryStack = [];
                    _this.IndexRequest = [];
                    _this.executeWhereInLogic = function () {
                        if (Array.isArray(this.Query.WhereIn)) {
                            this.executeMultipleWhereInLogic(this.Query.WhereIn);
                        }
                        else {
                            this.executeSingleWhereInLogic(this.Query.WhereIn);
                        }
                    };
                    _this.executeWhereLogic = function (query, queryJoin, joinType) {
                        if (joinType === void 0) { joinType = "inner"; }
                        var Column, That = this, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length, OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                That.onSuccessRequest();
                            }
                        };
                        for (Column in query.Where) {
                            if (!this.ErrorOccured) {
                                if (this.ObjectStore.keyPath != null && this.ObjectStore.keyPath == Column) {
                                    var GetRequest = this.ObjectStore.get(query.Where[Column]);
                                    GetRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        ++That.ErrorCount;
                                        That.onErrorRequest(e);
                                    };
                                    GetRequest.onsuccess = function (e) {
                                        var Result = e.target.result;
                                        if (Result) {
                                            //That.doInner(query,Result[query.Column],queryJoin.Column,Result[query.Column])
                                            That.Results.push();
                                        }
                                        OnSuccessGetRequest();
                                    };
                                }
                                else if (this.ObjectStore.indexNames.contains(Column)) {
                                    var CursorOpenRequest = this.ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        ++this.ErrorCount;
                                        That.onErrorRequest(e);
                                    };
                                    if (query.Skip && query.Limit) {
                                        var RecordSkipped = 0;
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
                                            if (Cursor) {
                                                if (RecordSkipped == query.Skip) {
                                                    if (That.Results.length != query.Limit) {
                                                        That.Results.push(Cursor);
                                                        Cursor.continue();
                                                    }
                                                    else {
                                                        OnSuccessGetRequest();
                                                    }
                                                }
                                                else {
                                                    ++RecordSkipped;
                                                }
                                            }
                                            else {
                                                OnSuccessGetRequest();
                                            }
                                        };
                                    }
                                    else if (query.Skip) {
                                        var RecordSkipped = 0;
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
                                            if (Cursor) {
                                                if (RecordSkipped == query.Limit) {
                                                    That.Results.push(Cursor);
                                                }
                                                else {
                                                    ++RecordSkipped;
                                                }
                                                Cursor.continue();
                                            }
                                            else {
                                                OnSuccessGetRequest();
                                            }
                                        };
                                    }
                                    else if (query.Limit) {
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
                                            if (Cursor && That.Results.length != query.Limit) {
                                                That.Results.push(Cursor);
                                                Cursor.continue();
                                            }
                                            else {
                                                OnSuccessGetRequest();
                                            }
                                        };
                                    }
                                    else {
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
                                            if (Cursor) {
                                                That.Results.push(Cursor);
                                                Cursor.continue();
                                            }
                                            else {
                                                OnSuccessGetRequest();
                                            }
                                        };
                                    }
                                }
                                else {
                                    Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }
                        }
                    };
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results.push(Cursor.value);
                                Cursor.continue();
                            }
                            else {
                                That.onSuccessRequest();
                            }
                        };
                        CursorOpenRequest.onerror = That.onErrorRequest;
                    };
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this, TableList = [];
                    //this.Transaction = DbConnection.transaction([query.From], "readonly");
                    //this.ObjectStore = this.Transaction.objectStore(query.From);
                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = query.Join == undefined ? 'inner' : query.Join.toLowerCase();
                            That.QueryStack.push(query.Table2);
                            TableList.push(query.Table2.Table);
                            return convertQueryIntoStack(query.Table1);
                        }
                        else {
                            That.QueryStack.push(query);
                            TableList.push(query.Table);
                            return;
                        }
                    };
                    convertQueryIntoStack(query.From);
                    _this.QueryStack.reverse();
                    console.log(TableList);
                    //var i = QueryStack.length - 1;
                    // while (i >= 0) {
                    //     this.doJoinLogic(QueryStack.pop(), QueryStack.pop());
                    //     i -= 2;
                    // }
                    _this.Transaction = IndexDb.DbConnection.transaction(TableList, "readonly");
                    for (var i = 1; i < _this.QueryStack.length; i++) {
                        _this.IndexRequest[i - 1] = _this.Transaction.objectStore(_this.QueryStack[i].Table).index(_this.QueryStack[i].Column);
                    }
                    _this.Query = _this.QueryStack[_this.QueryStack.length - 1];
                    _this.ObjectStore = _this.Transaction.objectStore(_this.QueryStack[_this.QueryStack.length - 1].Table);
                    //var CursorOpenRequest = Transaction.
                    console.log(_this.QueryStack);
                    return _this;
                }
                SelectJoinLogic.prototype.doJoinLogic = function (join1, join2) {
                    var That = this, Transaction = IndexDb.DbConnection.transaction([join1.Table, join2.Table], "readonly"), CursorOpenRequest1 = Transaction.objectStore(join1.Table).index(join1.Column).openCursor(), CursorOpenRequest2 = Transaction.objectStore(join2.Table).index(join2.Column).openCursor(), onErrorCursorRequest = function (e) {
                        ++That.ErrorCount;
                        That.onErrorRequest(e);
                    };
                    CursorOpenRequest1.onerror = onErrorCursorRequest;
                    CursorOpenRequest2.onerror = onErrorCursorRequest;
                    CursorOpenRequest1.onsuccess = function (e) {
                    };
                    CursorOpenRequest2.onsuccess = function (e) {
                    };
                };
                return SelectJoinLogic;
            }(IndexDb.BaseSelectLogic));
            IndexDb.SelectJoinLogic = SelectJoinLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var SelectLogic = (function (_super) {
                __extends(SelectLogic, _super);
                function SelectLogic(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.executeWhereInLogic = function () {
                        if (Array.isArray(this.Query.WhereIn)) {
                            this.executeMultipleWhereInLogic(this.Query.WhereIn);
                        }
                        else {
                            this.executeSingleWhereInLogic(this.Query.WhereIn);
                        }
                    };
                    _this.executeWhereLogic = function () {
                        var Column, SkipRecord = this.Query.Skip, LimitRecord = this.Query.Limit, That = this, ConditionLength = 0, OnSuccessGetRequest = function () {
                            --ConditionLength;
                            if (ConditionLength == 0)
                                That.onSuccessRequest();
                        };
                        var executeInnerWhereLogic = function (column, value) {
                            if (That.ObjectStore.indexNames.contains(column)) {
                                var CursorOpenRequest = That.ObjectStore.index(column).openCursor(value);
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    ++That.ErrorCount;
                                    That.onErrorRequest(e);
                                };
                                if (SkipRecord && LimitRecord) {
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == SkipRecord) {
                                                if (That.Results.length != LimitRecord) {
                                                    That.Results.push(Cursor);
                                                    Cursor.continue();
                                                }
                                                else {
                                                    OnSuccessGetRequest();
                                                }
                                            }
                                            else {
                                                ++RecordSkipped;
                                            }
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else if (SkipRecord) {
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == SkipRecord) {
                                                That.Results.push(Cursor);
                                            }
                                            else {
                                                ++RecordSkipped;
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else if (LimitRecord) {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor && That.Results.length != LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                            }
                            else {
                                Business.UtilityLogic.getError(JsStorage.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                return false;
                            }
                        };
                        for (Column in this.Query.Where) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                ConditionLength = this.Query.Where[Column].length;
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    var ExecutionStatus = executeInnerWhereLogic(Column, this.Query.Where[Column][i]);
                                    if (ExecutionStatus == false) {
                                        break;
                                    }
                                }
                            }
                            else {
                                executeInnerWhereLogic(Column, this.Query.Where[Column]);
                            }
                            break;
                        }
                    };
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results.push(Cursor.value);
                                Cursor.continue();
                            }
                            else {
                                That.onSuccessRequest();
                            }
                        };
                        CursorOpenRequest.onerror = That.onErrorRequest;
                    };
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.Transaction = IndexDb.DbConnection.transaction([query.From], "readonly");
                    _this.ObjectStore = _this.Transaction.objectStore(query.From);
                    if (query.WhereIn != undefined) {
                        if (query.Where != undefined) {
                            _this.SendResultFlag = false;
                            _this.executeWhereLogic();
                        }
                        _this.SendResultFlag = true;
                        _this.executeWhereInLogic();
                    }
                    else if (query.Where != undefined) {
                        _this.executeWhereLogic();
                    }
                    else {
                        _this.executeWhereUndefinedLogic();
                    }
                    return _this;
                }
                /**
                 * For matching the different column value existance
                 *
                 * @private
                 * @param {any} where
                 * @param {any} value
                 * @returns
                 *
                 * @memberOf SelectLogic
                 */
                SelectLogic.prototype.checkForWhereConditionMatch = function (where, value) {
                    var TempColumn;
                    for (TempColumn in where) {
                        if (Array.isArray(where[TempColumn])) {
                            var i, Status = true;
                            for (i = 0; i < TempColumn.length; i++) {
                                if (where[TempColumn][i] == value[TempColumn]) {
                                    Status = true;
                                    break;
                                }
                                else {
                                    Status = false;
                                }
                            }
                            ;
                            if (!Status) {
                                return Status;
                            }
                        }
                        else {
                            if (where[TempColumn] != value[TempColumn]) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                return SelectLogic;
            }(IndexDb.BaseSelectLogic));
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
                    Transaction.ontimeout = function () {
                        console.log('transaction timed out');
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
                            else {
                                return;
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
                        if (typeof query.From === 'object') {
                            new IndexDb.SelectJoinLogic(query, onSuccess, onError);
                        }
                        else {
                            new IndexDb.SelectLogic(query, onSuccess, onError);
                        }
                    };
                    this.createDb = function (objMain, onSuccess, onError) {
                        new IndexDb.CreateDbLogic(objMain, onSuccess, onError);
                    };
                    this.clear = function (tableName, onSuccess, onError) {
                        new IndexDb.ClearLogic(tableName, onSuccess, onError);
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
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
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
/// <reference path="Business/DbHelperLogic.ts" />
/// <reference path="Business/IndexDb/CreateDbLogic.ts" />
/// <reference path="Business/IndexDb/DeleteLogic.ts" />
/// <reference path="Business/IndexDb/DropDbLogic.ts" />
/// <reference path="Business/IndexDb/InsertLogic.ts" />
/// <reference path="Business/IndexDb/OpenDbLogic.ts" />
/// <reference path="Business/IndexDb/BaseSelectLogic.ts" />
/// <reference path="Business/IndexDb/SelectJoinLogic.ts" />
/// <reference path="Business/IndexDb/SelectLogic.ts" />
/// <reference path="Business/IndexDb/UpdateLogic.ts" />
/// <reference path="Business/IndexDb/MainLogic.ts" />
/// <reference path="Business/MainLogic.ts" />
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDb;
        (function (IndexDb) {
            var ClearLogic = (function () {
                function ClearLogic(tableName, onSuccess, onError) {
                    var ObjectStore = IndexDb.DbConnection.transaction([tableName], "readwrite").Transaction.objectStore(tableName), ClearRequest = ObjectStore.clear();
                    ClearRequest.onsuccess = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    ClearRequest.onerror = function (e) {
                        if (onError != null) {
                            onError();
                        }
                    };
                }
                return ClearLogic;
            }());
            IndexDb.ClearLogic = ClearLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
//# sourceMappingURL=JsStorage.js.map