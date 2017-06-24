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
        ErrorType[ErrorType["NullValue"] = 8] = "NullValue";
        ErrorType[ErrorType["BadDataType"] = 9] = "BadDataType";
        ErrorType[ErrorType["NextJoinNotExist"] = 10] = "NextJoinNotExist";
        ErrorType[ErrorType["TableNotExist"] = 11] = "TableNotExist";
    })(ErrorType = JsStorage.ErrorType || (JsStorage.ErrorType = {}));
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Closed"] = 2] = "Closed";
        ConnectionStatus[ConnectionStatus["NotStarted"] = 3] = "NotStarted";
    })(ConnectionStatus = JsStorage.ConnectionStatus || (JsStorage.ConnectionStatus = {}));
    JsStorage.Status = {
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };
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
                        Error.Value = "Column name is undefined";
                        break;
                    case JsStorage.ErrorType.UndefinedColumnValue:
                        Error.Value = "Column value is undefined";
                        break;
                    case JsStorage.ErrorType.NoValueSupplied:
                        Error.Value = "No value supplied";
                        break;
                    case JsStorage.ErrorType.InvalidOp:
                        Error.Value = "Invalid Op Value : " + errorDetail['Op'];
                        break;
                    case JsStorage.ErrorType.ColumnNotExist:
                        Error.Value = "Column :" + errorDetail['ColumnName'] + " does not exist";
                        break;
                    case JsStorage.ErrorType.NullValue:
                        Error.Value = "Null value is not allowed for column: " + errorDetail['ColumnName'];
                        break;
                    case JsStorage.ErrorType.BadDataType:
                        Error.Value = "Supplied value for column: " + errorDetail['ColumnName'] + " does not have valid type";
                        break;
                    case JsStorage.ErrorType.NextJoinNotExist:
                        Error.Value = "Next join details not supplied";
                        break;
                    case JsStorage.ErrorType.TableNotExist:
                        Error.Value = "Table :" + errorDetail['TableName'] + " does not exist";
                        ;
                        break;
                    default: console.warn('the error type is not defined');
                }
                if (logError) {
                    console.warn("JsStorage Error :- " + Error.Value);
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
                this.CurrentDate = key.CurrentDate != null ? key.CurrentDate : false;
                this.NotNull = key.NotNull != null ? key.NotNull : false;
                this.DataType = key.DataType != null ? key.DataType : '';
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
                this.Name = table.Name;
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
                var That = this, Length = this.Columns.length;
                this.Columns.forEach(function (item, index) {
                    if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                    }
                    else if (item.PrimaryKey && That.PrimaryKey.length > 0) {
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                        throw "Multiple primary key are not allowed";
                    }
                    // else if (index == Length && That.PrimaryKey.length == 0) {
                    // }
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
                var That = this;
                this.Name = dataBase.Name;
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
                this.doJoin = function (type, column1, data1, column2, data2) {
                    switch (type) {
                        case 'inner': return data1[column1] == data2[column2];
                    }
                };
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
                        JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                        IndexDb.DbConnection = DbRequest.result;
                        IndexDb.DbConnection.onclose = function () {
                            JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            JsStorage.Status.LastError = "Connection Closed";
                        };
                        IndexDb.DbConnection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                e.target.close(); // Manually close our connection to the db
                            }
                        };
                        IndexDb.DbConnection.onerror = function (e) {
                            JsStorage.Status.LastError = "Error occured in connection :" + e.target.result;
                        };
                        IndexDb.DbConnection.onabort = function (e) {
                            JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            JsStorage.Status.LastError = "Connection aborted";
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
                                    if (column.Unique) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
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
                    try {
                        var That = this, Transaction = IndexDb.DbConnection.transaction([query.From], "readwrite"), ObjectStore = Transaction.objectStore(query.From), ErrorOccured = false, ErrorCount = 0, RowAffected = 0, onErrorGetRequest = function (e) {
                            if (onError != null) {
                                onError(e.target.error);
                            }
                        };
                        Transaction.oncomplete = function () {
                            if (onSuccess != null) {
                                onSuccess(RowAffected);
                            }
                        };
                        Transaction.onerror = onErrorGetRequest;
                        if (query.Where == undefined) {
                            var CursorOpenRequest = ObjectStore.openCursor();
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    Cursor.delete();
                                    ++RowAffected;
                                    Cursor.continue();
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
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            Business.UtilityLogic.getError(JsStorage.ErrorType.TableNotExist, true, { TableName: query.From });
                        }
                        else {
                            console.warn(ex);
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
                    DbDropRequest.onblocked = function () {
                        if (onError != null) {
                            onError("delete database is in progress");
                        }
                        ;
                    };
                    DbDropRequest.onerror = function (e) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbDropRequest.onsuccess = function () {
                        JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                        if (onSuccess != null) {
                            onSuccess();
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
                function InsertLogic(tableName, values, isReturn, onSuccess, onError) {
                    this.RowsAffected = 0;
                    this.ValuesAffected = [];
                    this.ErrorOccured = false;
                    this.ErrorCount = 0;
                    this.onErrorRequest = function (e, customError) {
                        if (customError === void 0) { customError = false; }
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                if (!customError) {
                                    this.OnError(e.target.error, this.TotalRowsAffected);
                                }
                                else {
                                    this.OnError(e, this.TotalRowsAffected);
                                }
                            }
                        }
                    };
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        var That = this, Transaction = IndexDb.DbConnection.transaction([tableName], "readwrite");
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(isReturn ? That.ValuesAffected : That.RowsAffected);
                            }
                        },
                            Transaction.ontimeout = function () {
                                console.log('transaction timed out');
                            };
                        this.Store = Transaction.objectStore(tableName);
                        values.forEach(function (value) {
                            That.checkSchemaAndModifyValue(value, tableName);
                            if (!That.ErrorOccured) {
                                var AddResult = That.Store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorRequest(e);
                                };
                                AddResult.onsuccess = function (e) {
                                    if (isReturn) {
                                        That.ValuesAffected.push(value);
                                    }
                                    else {
                                        ++That.RowsAffected;
                                    }
                                };
                            }
                            else {
                                That.onErrorRequest(That.Error, true);
                            }
                        });
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                /**
                 * check the defined schema and based upon that modify or create the value
                 *
                 * @private
                 * @param {any} value
                 * @param {string} tableName
                 *
                 * @memberof InsertLogic
                 */
                InsertLogic.prototype.checkSchemaAndModifyValue = function (value, tableName) {
                    var CurrentTable, That = this;
                    Business.IndexDb.Db.Tables.every(function (table) {
                        if (table.Name == tableName) {
                            CurrentTable = table;
                            return false;
                        }
                        return true;
                    });
                    CurrentTable.Columns.forEach(function (column) {
                        if (!That.ErrorOccured) {
                            //check auto increment scheme
                            if (column.AutoIncrement) {
                                var ColumnValue = Number(localStorage.getItem(tableName + "_" + column.Name + "value:"));
                                value[column.Name] = ++ColumnValue;
                                localStorage.setItem(tableName + "_" + column.Name + "value:", ColumnValue.toString());
                            }
                            else if (column.CurrentDate) {
                                value[column.Name] = new Date();
                            }
                            //check not null schema
                            if (column.NotNull && value[column.Name] == null) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = Business.UtilityLogic.getError(JsStorage.ErrorType.NullValue, false, { ColumnName: column.Name });
                            }
                            //check datatype
                            if (column.DataType && typeof value[column.Name] != column.DataType) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = Business.UtilityLogic.getError(JsStorage.ErrorType.BadDataType, false, { ColumnName: column.Name });
                            }
                        }
                    });
                };
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
                    if (JsStorage.Status.ConStatus != JsStorage.ConnectionStatus.Connected) {
                        if (IndexDb.ActiveDataBase.Name.length > 0) {
                            var DbVersion = Number(localStorage.getItem(IndexDb.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(IndexDb.ActiveDataBase.Name, DbVersion), That = this;
                            DbRequest.onerror = function (event) {
                                if (onError != null) {
                                    onError(event.target.error);
                                }
                            };
                            DbRequest.onsuccess = function (event) {
                                JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                                IndexDb.DbConnection = DbRequest.result;
                                IndexDb.DbConnection.onclose = function () {
                                    JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                    JsStorage.Status.LastError = "Connection Closed, trying to reconnect";
                                };
                                IndexDb.DbConnection.onversionchange = function (e) {
                                    if (e.newVersion === null) {
                                        e.target.close(); // Manually close our connection to the db
                                    }
                                };
                                IndexDb.DbConnection.onerror = function (e) {
                                    JsStorage.Status.LastError = "Error occured in connection :" + e.target.result;
                                };
                                IndexDb.DbConnection.onabort = function (e) {
                                    JsStorage.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                    JsStorage.Status.LastError = "Connection Aborted";
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
                    _this.onErrorRequest = function (e) {
                        ++this.ErrorCount;
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
                            }, OnCursorError = function (e) {
                                this.ErrorOccured = true;
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
                    _this.CurrentQueryStackIndex = 0;
                    _this.Results = [];
                    _this.onTransactionCompleted = function (e) {
                        if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                            this.OnSuccess(this.Results);
                        }
                    };
                    _this.executeWhereJoinLogic = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex, TmpResults = That.Results;
                        //get the data from query table
                        new IndexDb.SelectLogic({
                            From: query.Table,
                            Where: query.Where,
                            WhereIn: query.WhereIn
                        }, function (results) {
                            //perform join
                            JoinIndex = 0;
                            var Item, ResultLength = TmpResults.length;
                            results.forEach(function (value, index) {
                                //search item through each global result
                                for (var i = 0; i < ResultLength; i++) {
                                    Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                    if (Item == value[query.Column]) {
                                        doJoin(value, i);
                                        ++JoinIndex;
                                    }
                                }
                            });
                            That.Results = Results;
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }, function (error) {
                            this.onErrorRequest(error);
                        });
                        var doJoin = function (value, itemIndex) {
                            // if (Results[JoinIndex] == undefined) {
                            Results[JoinIndex] = {};
                            // }
                            switch (query.JoinType) {
                                //inner join
                                case 'inner':
                                    Results[JoinIndex][query.Table] = value;
                                    //copy other relative data into current result
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                    }
                                    break;
                                //left join
                                case 'left':
                                    if (value != null) {
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    else {
                                        That.Results[JoinIndex][query.Table] = null;
                                    }
                                    ;
                                    break;
                                //right join
                                case 'right':
                                    if (value[query.Column] == That.Results[JoinIndex][joinQuery.Table][joinQuery.Column]) {
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    else {
                                        That.Results.splice(JoinIndex, 0, null);
                                        That.Results[JoinIndex][joinQuery.Table] = null;
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    break;
                            }
                        };
                    };
                    _this.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex, TmpResults = That.Results, CursorOpenRequest, ResultLength = this.Results.length, Transaction = IndexDb.DbConnection.transaction([query.Table], "readonly");
                        Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted(e);
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                        };
                        var ExecuteLogic = function (item, index) {
                            JoinIndex = 0;
                            this.ObjectStore = Transaction.objectStore(query.Table);
                            CursorOpenRequest = this.ObjectStore.index(query.Column).openCursor(IDBKeyRange.only(item[joinQuery.Column]));
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    doJoin(Cursor.value);
                                    Cursor.continue();
                                    ++JoinIndex;
                                }
                                else {
                                    //copy other relative data into current result
                                    if (That.CurrentQueryStackIndex == 1) {
                                        That.Results = Results;
                                    }
                                    else {
                                        for (var i = 0; i < Results.length; i++) {
                                            var ColumnValue = Results[i][joinQuery.Table][joinQuery.Column], TableName;
                                            for (var j = 0; j < TmpResults.length; j++) {
                                                if (ColumnValue == TmpResults[j][joinQuery.Table][joinQuery.Column]) {
                                                    for (var k = 0; k < That.CurrentQueryStackIndex; k++) {
                                                        // Results[JoinIndex][joinQuery.Table] = item;
                                                        TableName = That.QueryStack[k].Table;
                                                        Results[i][TableName] = TmpResults[j][TableName];
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                        That.Results = Results;
                                    }
                                    // if (index == ResultLength - 1 && (That.QueryStack.length > That.CurrentQueryStackIndex + 1)) {
                                    //     That.startExecutionJoinLogic();
                                    // }
                                }
                            };
                            CursorOpenRequest.onerror = That.onErrorRequest;
                            var doJoin = function (value) {
                                Results[JoinIndex] = {};
                                switch (query.JoinType) {
                                    //inner join
                                    case 'inner':
                                        Results[JoinIndex][query.Table] = value;
                                        Results[JoinIndex][joinQuery.Table] = item;
                                        break;
                                    //left join
                                    case 'left':
                                        if (value != null) {
                                            That.Results[index][query.Table] = value;
                                        }
                                        else {
                                            That.Results[index][query.Table] = null;
                                        }
                                        ;
                                        break;
                                    //right join
                                    case 'right':
                                        if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
                                            That.Results[index][query.Table] = value;
                                        }
                                        else {
                                            That.Results.splice(index, 0, null);
                                            That.Results[index][joinQuery.Table] = null;
                                            That.Results[index][query.Table] = value;
                                        }
                                        break;
                                }
                            };
                        };
                        for (var i = 0; i < ResultLength; i++) {
                            ExecuteLogic(TmpResults[i][joinQuery.Table], i);
                        }
                    };
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this, TableList = []; // used to open the multiple object store
                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = query.Join == undefined ? 'inner' : query.Join.toLowerCase();
                            That.QueryStack.push(query.Table2);
                            if (That.QueryStack.length % 2 == 0) {
                                That.QueryStack[That.QueryStack.length - 1].NextJoin = query.NextJoin;
                            }
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
                    // if (this.QueryStack.length > 2) {
                    //     for (var i = 0, length = this.QueryStack.length; i < length; i++) {
                    //         if (i % 2 == 1 && this.QueryStack[i].NextJoin != null) {
                    //         }
                    //         else {
                    //             this.ErrorOccured = true;
                    //             UtilityLogic.getError(ErrorType.NextJoinNotExist, true, {});
                    //             break;
                    //         }
                    //     }
                    // }
                    //get the data for first table
                    if (!_this.ErrorOccured) {
                        new IndexDb.SelectLogic({
                            From: _this.QueryStack[0].Table,
                            Where: _this.QueryStack[0].Where,
                            WhereIn: _this.QueryStack[0].WhereIn
                        }, function (results) {
                            var TableName = That.QueryStack[0].Table;
                            results.forEach(function (item, index) {
                                That.Results[index] = {};
                                That.Results[index][TableName] = item;
                            });
                            That.startExecutionJoinLogic();
                        }, function (error) {
                            That.onErrorRequest(error);
                        });
                    }
                    return _this;
                }
                SelectJoinLogic.prototype.startExecutionJoinLogic = function () {
                    var JoinQuery;
                    if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
                        // if (this.QueryStack[this.CurrentQueryStackIndex].Table == this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table) {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
                        // else {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
                        JoinQuery = {
                            Table: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table,
                            Column: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Column
                        };
                        this.CurrentQueryStackIndex++;
                    }
                    else {
                        JoinQuery = this.QueryStack[this.CurrentQueryStackIndex++];
                    }
                    var Query = this.QueryStack[this.CurrentQueryStackIndex];
                    if (Query.WhereIn || Query.Where) {
                        this.executeWhereJoinLogic(JoinQuery, Query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                    }
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
                            // if (ConditionLength == 0)
                            //     That.onSuccessRequest();
                        };
                        var executeInnerWhereLogic = function (column, value) {
                            if (That.ObjectStore.indexNames.contains(column)) {
                                var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorRequest(e);
                                };
                                if (SkipRecord && LimitRecord) {
                                    var RecordSkipped = false;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped) {
                                                if (That.Results.length != LimitRecord) {
                                                    That.Results.push(Cursor);
                                                    Cursor.continue();
                                                }
                                                else {
                                                    OnSuccessGetRequest();
                                                }
                                            }
                                            else {
                                                RecordSkipped = true;
                                                Cursor.advance(SkipRecord - 1);
                                            }
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else if (SkipRecord) {
                                    var RecordSkipped = false;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped) {
                                                That.Results.push(Cursor);
                                                Cursor.continue();
                                            }
                                            else {
                                                RecordSkipped = true;
                                                Cursor.advance(SkipRecord - 1);
                                            }
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
                        };
                        CursorOpenRequest.onerror = That.onErrorRequest;
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.Transaction = IndexDb.DbConnection.transaction([query.From], "readonly");
                    _this.Transaction.oncomplete = function (e) {
                        if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    };
                    // (<any>(this.Transaction)).ontimeout = function () {
                    //     console.log('transaction timed out');
                    // }
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
                    try {
                        var That = this, ErrorOccured = false, ErrorCount = 0, RowAffected = 0, Transaction = IndexDb.DbConnection.transaction([query.In], "readwrite"), ObjectStore = Transaction.objectStore(query.In), onErrorGetRequest = function (e) {
                            if (ErrorCount == 1) {
                                if (onError != null) {
                                    onError(e.target.error);
                                }
                            }
                        };
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(RowAffected);
                            }
                        },
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
                            };
                            CursorOpenRequest.onerror = onErrorGetRequest;
                        }
                        else {
                            for (var TmpColumn in query.Where) {
                                if (!ErrorOccured) {
                                    if (ObjectStore.indexNames.contains(TmpColumn)) {
                                        var CursorOpenRequest = ObjectStore.index(TmpColumn).openCursor(IDBKeyRange.only(query.Where[TmpColumn]));
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
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            Business.UtilityLogic.getError(JsStorage.ErrorType.TableNotExist, true, { TableName: query.In });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }
                return UpdateLogic;
            }());
            IndexDb.UpdateLogic = UpdateLogic;
        })(IndexDb = Business.IndexDb || (Business.IndexDb = {}));
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
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
                    this.closeDb = function () {
                        if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                            IndexDb.DbConnection.close();
                        }
                    };
                    this.dropDb = function (onSuccess, onError) {
                        var ObjDropDb = new IndexDb.DropDbLogic(IndexDb.ActiveDataBase.Name, onSuccess, onError);
                    };
                    this.update = function (query, onSuccess, onError) {
                        var ObjUpdate = new IndexDb.UpdateLogic(query, onSuccess, onError);
                    };
                    this.insert = function (tableName, values, isReturn, onSuccess, onError) {
                        if (!Array.isArray(values)) {
                            throw "Value should be array :- supplied value is not array";
                        }
                        else if (values.length > 0) {
                            var ObjInsert = new IndexDb.InsertLogic(tableName, values, isReturn, onSuccess, onError);
                        }
                        else {
                            if (onError != null) {
                                onError(Business.UtilityLogic.getError(JsStorage.ErrorType.NoValueSupplied, true, null));
                            }
                        }
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
    var Instance = (function () {
        function Instance() {
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
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                var Db = new DataBase(dataBase);
                this.IndexDbObj = new JsStorage.Business.IndexDb.MainLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                this.IndexDbObj.createDb(this, onSuccess, onError);
                JsStorage.Business.IndexDb.Db = Db;
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
        Instance.prototype.openDb = function (onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
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
        Instance.prototype.closeDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.closeDb();
            }
            else {
            }
        };
        Instance.prototype.dropDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.dropDb(onSuccess, onError);
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
        Instance.prototype.select = function (query, onSuccess, onError) {
            if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.select(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.select(query, onSuccess, onError);
                });
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
        Instance.prototype.insert = function (query, onSuccess, onError) {
            if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    var IsReturn = query.Return ? query.Return : false;
                    this.IndexDbObj.insert(query.Into, query.Values, IsReturn, onSuccess, onError);
                }
                else {
                }
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.insert(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.insert(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.update = function (query, onSuccess, onError) {
            if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.update(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.update(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.update(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.delete = function (query, onSuccess, onError) {
            if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.delete(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.delete(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStorage.Status.ConStatus == JsStorage.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.delete(query, onSuccess, onError);
                });
            }
        };
        return Instance;
    }());
    JsStorage.Instance = Instance;
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
/// <reference path="Business/IndexDb/ClearLogic.ts" />
/// <reference path="Business/IndexDb/MainLogic.ts" />
/// <reference path="Business/MainLogic.ts" />
// module JsStorage {
//     export module Business {
//         export module IndexDb {
//             export class SelectJoinLogic extends BaseSelectLogic {
//                 Query: ITableJoin;
//                 ObjectStoreForJoin: IDBObjectStore;
//                 QueryStack: Array<ITableJoin> = [];
//                 IndexRequest: Array<IDBIndex> = []
//                 private executeWhereInLogic = function () {
//                     if (Array.isArray(this.Query.WhereIn)) {
//                         this.executeMultipleWhereInLogic(this.Query.WhereIn);
//                     }
//                     else {
//                         this.executeSingleWhereInLogic(this.Query.WhereIn);
//                     }
//                 }
//                 private executeWhereLogic = function (query: ITableJoin, queryJoin: ITableJoin, joinType = "inner") {
//                     var Column,
//                         That: SelectJoinLogic = this,
//                         ConditionLength = Object.keys(query.Where).length
//                     for (Column in query.Where) {
//                         if (!this.ErrorOccured) {
//                             if (this.ObjectStore.keyPath != null && this.ObjectStore.keyPath == Column) {
//                                 var GetRequest = this.ObjectStore.get(query.Where[Column]);
//                                 GetRequest.onerror = function (e) {
//                                     That.ErrorOccured = true; ++That.ErrorCount;
//                                     That.onErrorRequest(e);
//                                 }
//                                 GetRequest.onsuccess = function (e) {
//                                     var Result = (<any>e).target.result
//                                     if (Result) {
//                                         //That.doInner(query,Result[query.Column],queryJoin.Column,Result[query.Column])
//                                         That.Results.push();
//                                     }
//                                 }
//                             }
//                             else if (this.ObjectStore.indexNames.contains(Column)) {
//                                 var CursorOpenRequest = this.ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
//                                 CursorOpenRequest.onerror = function (e) {
//                                     That.ErrorOccured = true; ++this.ErrorCount;
//                                     That.onErrorRequest(e);
//                                 }
//                                 if (query.Skip && query.Limit) {
//                                     var RecordSkipped = 0;
//                                     CursorOpenRequest.onsuccess = function (e) {
//                                         var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                         if (Cursor) {
//                                             if (RecordSkipped == query.Skip) {
//                                                 if (That.Results.length != query.Limit) {
//                                                     That.Results.push(Cursor);
//                                                     Cursor.continue();
//                                                 }
//                                             }
//                                             else {
//                                                 ++RecordSkipped;
//                                             }
//                                         }
//                                     }
//                                 }
//                                 else if (query.Skip) { //skip exist
//                                     var RecordSkipped = 0;
//                                     CursorOpenRequest.onsuccess = function (e) {
//                                         var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                         if (Cursor) {
//                                             if (RecordSkipped == query.Limit) {
//                                                 That.Results.push(Cursor);
//                                             }
//                                             else {
//                                                 ++RecordSkipped;
//                                             }
//                                             Cursor.continue();
//                                         }
//                                     }
//                                 }
//                                 else if (query.Limit) {
//                                     CursorOpenRequest.onsuccess = function (e) {
//                                         var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                         if (Cursor && That.Results.length != query.Limit) {
//                                             That.Results.push(Cursor);
//                                             Cursor.continue();
//                                         }
//                                     }
//                                 }
//                                 else {
//                                     CursorOpenRequest.onsuccess = function (e) {
//                                         var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                         if (Cursor) {
//                                             That.Results[That.Results.length - 1][query.Table] = Cursor.value;
//                                             Cursor.continue();
//                                         }
//                                     }
//                                 }
//                             }
//                             else {
//                                 UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
//                             }
//                         }
//                     }
//                 }
//                 // private executeJoinLogic = function (value, onSuccess: Function, onError: Function, results: any = {}, index = 1) {
//                 //     var JoinStatus = true,
//                 //         Results = [],
//                 //         That: SelectJoinLogic = this,
//                 //         CursorJoinRequest = this.IndexRequest[index - 1].openCursor(IDBKeyRange.only(value[this.QueryStack[index].Column]));
//                 //     CursorJoinRequest.onsuccess = function (e) {
//                 //         var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                 //         if (Cursor) {
//                 //             switch (That.QueryStack[index].JoinType) {
//                 //                 case 'inner': Results.push(Cursor.value); break;
//                 //                 case 'left':
//                 //             }
//                 //         }
//                 //         else {
//                 //             ++index;
//                 //             results[this.QueryStack[index].Column] = Results;
//                 //             if (index <= this.IndexRequest.length) {
//                 //                 That.executeJoinLogic(Results, onSuccess, onError, results);
//                 //             }
//                 //             else {
//                 //                 That.Results.push(results);
//                 //                 onSuccess();
//                 //             }
//                 //         }
//                 //     }
//                 //     CursorJoinRequest.onerror = function (e) {
//                 //         onError(e);
//                 //     }
//                 // }
//                 private executeJoinLogic = function (joinData: Array<any>, joinTable: string, joinColumn: string, query: ITableJoin) {
//                     var Column,
//                         SkipRecord = this.Query.Skip,
//                         LimitRecord = this.Query.Limit,
//                         That: SelectJoinLogic = this,
//                         ConditionLength = 0,
//                         OnSuccessGetRequest = function () {
//                             --ConditionLength;
//                             //if (ConditionLength == 0)
//                             // That.onSuccessRequest();
//                         };
//                     var executeInnerWhereLogic = function (column, value) {
//                         if (That.ObjectStore.indexNames.contains(column)) {
//                             var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
//                             CursorOpenRequest.onerror = function (e) {
//                                 That.ErrorOccured = true; ++That.ErrorCount;
//                                 That.onErrorRequest(e);
//                             }
//                             if (SkipRecord && LimitRecord) {
//                                 var RecordSkipped = false;
//                                 CursorOpenRequest.onsuccess = function (e) {
//                                     var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                     if (Cursor) {
//                                         if (RecordSkipped) {
//                                             if (That.Results.length != LimitRecord) {
//                                                 That.Results.push(Cursor);
//                                                 Cursor.continue();
//                                             }
//                                             else {
//                                                 OnSuccessGetRequest();
//                                             }
//                                         }
//                                         else {
//                                             RecordSkipped = true;
//                                             Cursor.advance(SkipRecord - 1);
//                                         }
//                                     }
//                                     else {
//                                         OnSuccessGetRequest();
//                                     }
//                                 }
//                             }
//                             else if (SkipRecord) { //skip exist
//                                 var RecordSkipped = false;
//                                 CursorOpenRequest.onsuccess = function (e) {
//                                     var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                     if (Cursor) {
//                                         if (RecordSkipped) {
//                                             That.Results.push(Cursor);
//                                             Cursor.continue();
//                                         }
//                                         else {
//                                             RecordSkipped = true;
//                                             Cursor.advance(SkipRecord - 1);
//                                         }
//                                     }
//                                     else {
//                                         OnSuccessGetRequest();
//                                     }
//                                 }
//                             }
//                             else if (LimitRecord) {
//                                 CursorOpenRequest.onsuccess = function (e) {
//                                     var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                     if (Cursor && That.Results.length != LimitRecord) {
//                                         That.Results.push(Cursor.value);
//                                         Cursor.continue();
//                                     }
//                                     else {
//                                         OnSuccessGetRequest();
//                                     }
//                                 }
//                             }
//                             else {
//                                 var Index = 0;
//                                 CursorOpenRequest.onsuccess = function (e) {
//                                     var Cursor: IDBCursorWithValue = (<any>e).target.result;
//                                     if (Cursor) {
//                                         if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
//                                             doJoin(Index, Cursor.value);
//                                         }
//                                         Cursor.continue(joinData[joinColumn][Index]);
//                                     }
//                                     else {
//                                         OnSuccessGetRequest();
//                                     }
//                                 }
//                             }
//                         }
//                         else {
//                             UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
//                         }
//                         return false;
//                     }
//                     var doJoin = function (index, value) {
//                         switch (query.JoinType) {
//                             //inner join
//                             case 'inner': if (value[query.Column][index] == joinData[joinColumn][index]) {
//                                 That.Results[index++][query.Table] = value;
//                             }
//                             else { //remove current element
//                                 That.Results.splice(index, 1);
//                             }; break;
//                             //left join
//                             case 'left': if (index[query.Column][index] == joinData[joinColumn][index]) {
//                                 That.Results[index++][query.Table] = value;
//                             }
//                             else { //add null element
//                                 That.Results[index++][query.Table] = null;
//                             };
//                                 break;
//                             //right join
//                             case 'right': if (value[query.Column][index] == joinData[joinColumn][index]) {
//                                 That.Results[index++][query.Table] = value;
//                             }
//                             else { //shift array to 1 position with null as first value and value as second value
//                                 That.Results.splice(index, 0, null);
//                                 That.Results[index++][joinTable] = null;
//                                 That.Results[index++][query.Table] = value;
//                             }
//                                 break;
//                         };
//                     }
//                     for (Column in this.Query.Where) {
//                         if (Array.isArray(this.Query.Where[Column])) {
//                             ConditionLength = this.Query.Where[Column].length;
//                             for (var i = 0; i < this.Query.Where[Column].length; i++) {
//                                 var ExecutionStatus = executeInnerWhereLogic(Column, this.Query.Where[Column][i])
//                                 if (ExecutionStatus == false) {
//                                     break;
//                                 }
//                             }
//                         }
//                         else {
//                             executeInnerWhereLogic(Column, this.Query.Where[Column]);
//                         }
//                         break;
//                     }
//                 }
//                 /**
//                  * For matching the different column value existance
//                  * 
//                  * @private
//                  * @param {any} where 
//                  * @param {any} value 
//                  * @returns 
//                  * 
//                  * @memberOf SelectLogic
//                  */
//                 private checkForWhereConditionMatch(where, value) {
//                     var TempColumn;
//                     for (TempColumn in where) {
//                         if (Array.isArray(where[TempColumn])) {
//                             var i, Status = true;
//                             for (i = 0; i < TempColumn.length; i++) {
//                                 if (where[TempColumn][i] == value[TempColumn]) {
//                                     Status = true;
//                                     break;
//                                 }
//                                 else {
//                                     Status = false;
//                                 }
//                             };
//                             if (!Status) {
//                                 return Status;
//                             }
//                         }
//                         else {
//                             if (where[TempColumn] != value[TempColumn]) {
//                                 return false;
//                             }
//                         }
//                     }
//                     return true;
//                 }
//                 private executeWhereUndefinedLogic = function () {
//                     var That: SelectLogic = this,
//                         CursorOpenRequest = this.ObjectStore.openCursor();
//                     CursorOpenRequest.onsuccess = function (e) {
//                         var Cursor = (<any>e).target.result;
//                         if (Cursor) {
//                             That.Results.push(Cursor.value);
//                             (Cursor as any).continue();
//                         }
//                     }
//                     CursorOpenRequest.onerror = That.onErrorRequest;
//                 }
//                 constructor(query: ISelectJoin, onSuccess: Function, onError: Function) {
//                     super();
//                     this.OnSuccess = onSuccess;
//                     this.OnError = onError;
//                     var That = this,
//                         TableList = []; // used to open the multiple object store
//                     //this.Transaction = DbConnection.transaction([query.From], "readonly");
//                     //this.ObjectStore = this.Transaction.objectStore(query.From);
//                     var convertQueryIntoStack = function (query) {
//                         if (query.hasOwnProperty('Table1')) {
//                             query.Table2.Table = query.Table2.Table.toLowerCase();
//                             query.Table2['JoinType'] = (<IJoin>query).Join == undefined ? 'inner' : (<IJoin>query).Join.toLowerCase();
//                             That.QueryStack.push(query.Table2);
//                             TableList.push(query.Table2.Table);
//                             return convertQueryIntoStack(query.Table1);
//                         }
//                         else {
//                             query.Table = query.Table.toLowerCase();
//                             That.QueryStack.push(query);
//                             TableList.push(query.Table);
//                             return;
//                         }
//                     };
//                     convertQueryIntoStack(query.From);
//                     this.QueryStack.reverse();
//                     console.log(TableList);
//                     //var i = QueryStack.length - 1;
//                     // while (i >= 0) {
//                     //     this.doJoinLogic(QueryStack.pop(), QueryStack.pop());
//                     //     i -= 2;
//                     // }
//                     //this.Transaction = DbConnection.transaction(TableList, "readonly");
//                     // for (var i = 1; i < this.QueryStack.length; i++) {
//                     //     this.IndexRequest[i - 1] = this.Transaction.objectStore(this.QueryStack[i].Table).index(this.QueryStack[i].Column);
//                     // }
//                     console.log(this.QueryStack);
//                     //get the data for first table
//                     new SelectLogic(<ISelect>{
//                         From: this.QueryStack[0].Table,
//                         Where: this.QueryStack[0].Where,
//                         WhereIn: this.QueryStack[0].WhereIn,
//                         Limit: this.QueryStack[0].Limit,
//                         Skip: this.QueryStack[0].Skip
//                     }, function (results) {
//                         this.QueryStack.shift();
//                         That.startExecutionJoinLogic(<ISelect>{
//                             From: this.QueryStack[0].Table,
//                             Where: this.QueryStack[0].Where,
//                             WhereIn: this.QueryStack[0].WhereIn,
//                             Limit: this.QueryStack[0].Limit,
//                             Skip: this.QueryStack[0].Skip
//                         }, function () {
//                             this.QueryStack.shift();
//                         })
//                     }, function (error) {
//                         if (onError) {
//                             onError(error)
//                         }
//                     });
//                     // this.Query = this.QueryStack[this.QueryStack.length - 1];
//                     // this.ObjectStore = this.Transaction.objectStore(this.QueryStack[this.QueryStack.length - 1].Table);
//                     //var CursorOpenRequest = Transaction.
//                 }
//                 private startExecutionJoinLogic(query, callBack: Function) {
//                 }
//                 private doJoinLogic(join1: ITableJoin, join2: ITableJoin) {
//                     var That = this,
//                         Transaction = DbConnection.transaction([join1.Table, join2.Table], "readonly"),
//                         CursorOpenRequest1 = Transaction.objectStore(join1.Table).index(join1.Column).openCursor(),
//                         CursorOpenRequest2 = Transaction.objectStore(join2.Table).index(join2.Column).openCursor(),
//                         onErrorCursorRequest = function (e) {
//                             ++That.ErrorCount;
//                             That.onErrorRequest(e);
//                         }
//                     CursorOpenRequest1.onerror = onErrorCursorRequest;
//                     CursorOpenRequest2.onerror = onErrorCursorRequest;
//                     CursorOpenRequest1.onsuccess = function (e) {
//                     }
//                     CursorOpenRequest2.onsuccess = function (e) {
//                     }
//                 }
//             }
//         }
//     }
// } 
//# sourceMappingURL=JsStorage.js.map