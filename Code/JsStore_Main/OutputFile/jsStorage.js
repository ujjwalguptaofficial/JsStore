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
var JsStore;
(function (JsStore) {
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
    })(ErrorType = JsStore.ErrorType || (JsStore.ErrorType = {}));
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_started";
    })(ConnectionStatus = JsStore.ConnectionStatus || (JsStore.ConnectionStatus = {}));
    JsStore.Status = {
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var UtilityLogic = (function () {
        function UtilityLogic() {
        }
        UtilityLogic.getError = function (errorType, logError, errorDetail) {
            if (logError === void 0) { logError = false; }
            var Error = {
                Name: JsStore.ErrorType[errorType],
                Value: ''
            };
            switch (errorType) {
                case JsStore.ErrorType.NotArray:
                    Error.Value = "Supplied value is not an array";
                    break;
                case JsStore.ErrorType.UndefinedColumn:
                    Error.Value = "Column is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedValue:
                    Error.Value = "Value is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedColumnName:
                    Error.Value = "Column name is undefined";
                    break;
                case JsStore.ErrorType.UndefinedColumnValue:
                    Error.Value = "Column value is undefined";
                    break;
                case JsStore.ErrorType.NoValueSupplied:
                    Error.Value = "No value supplied";
                    break;
                case JsStore.ErrorType.InvalidOp:
                    Error.Value = "Invalid Op Value '" + errorDetail['Op'] + "'";
                    break;
                case JsStore.ErrorType.ColumnNotExist:
                    Error.Value = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.NullValue:
                    Error.Value = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case JsStore.ErrorType.BadDataType:
                    Error.Value = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case JsStore.ErrorType.NextJoinNotExist:
                    Error.Value = "Next join details not supplied";
                    break;
                case JsStore.ErrorType.TableNotExist:
                    Error.Value = "Table '" + errorDetail['TableName'] + "' does not exist";
                    ;
                    break;
                default: console.error('the error type is not defined');
            }
            if (logError) {
                console.error("JsStorage Error :- " + Error.Value);
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
        UtilityLogic.setDbType = function () {
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            if (indexedDB) {
                window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return UtilityLogic;
    }());
    JsStore.UtilityLogic = UtilityLogic;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
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
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var Table = (function () {
            function Table(table, dbName) {
                this.Name = "";
                this.Columns = [];
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
                this.setPrimaryKey(dbName);
            }
            Table.prototype.setPrimaryKey = function (dbName) {
                var That = this, Length = this.Columns.length;
                this.Columns.every(function (item) {
                    if (item.PrimaryKey) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStore_" + dbName + "_" + That.Name + "_" + item.Name, "true");
                        return false;
                    }
                    return true;
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var TableVersion = localStorage.getItem("JsStore_" + dbName + "_" + this.Name);
                if (TableVersion == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
            };
            Table.prototype.setDbVersion = function (dbName) {
                var Version = this.Version.toString(), DbVersion = Number(localStorage.getItem('JsStore_' + dbName + '_Db_Version'));
                if (this.Version > DbVersion) {
                    localStorage.setItem('JsStore_' + dbName + '_Db_Version', Version);
                }
                localStorage.setItem("JsStore_" + dbName + "_" + this.Name, Version);
            };
            return Table;
        }());
        Model.Table = Table;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
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
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BaseLogic = (function () {
            function BaseLogic() {
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.RowAffected = 0;
                this.onErrorOccured = function (e, customError) {
                    if (customError === void 0) { customError = false; }
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            if (!customError) {
                                this.OnError(e.target.error);
                            }
                            else {
                                this.OnError(e);
                            }
                        }
                    }
                };
                this.isNull = function (value) {
                    return value == null || value.length == 0;
                };
                this.onExceptionOccured = function (ex, info) {
                    if (ex.name == "NotFoundError") {
                        JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, info);
                    }
                    else {
                        console.error(ex);
                    }
                };
            }
            BaseLogic.prototype.checkForWhereConditionMatch = function (where, value) {
                for (var Column in where) {
                    if (Array.isArray(where[Column])) {
                        var Status = true;
                        for (var i = 0, length = where[Column].length; i < length; i++) {
                            if (where[Column][i] == value[Column]) {
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
                        if (where[Column] != value[Column]) {
                            return false;
                        }
                    }
                }
                return true;
            };
            BaseLogic.prototype.checkWhereSchema = function (suppliedValue, tableName) {
                var CurrentTable, That = this;
                Business.ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                CurrentTable.Columns.forEach(function (column) {
                    if (!That.ErrorOccured) {
                        if (column.Name in suppliedValue) {
                            var Value = suppliedValue[column.Name], executeCheck = function (value) {
                                if (column.NotNull && That.isNull(value)) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                                }
                                if (column.DataType && typeof value != column.DataType) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                                }
                            };
                            if (Array.isArray(Value)) {
                                Value.forEach(function (item) {
                                    executeCheck(item);
                                });
                            }
                            else {
                                executeCheck(Value);
                            }
                        }
                    }
                });
            };
            return BaseLogic;
        }());
        Business.BaseLogic = BaseLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var CreateDbLogic = (function () {
            function CreateDbLogic(objMain, dbVersion, onSuccess, onError) {
                var That = this, DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, dbVersion);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    JsStore.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        JsStore.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        JsStore.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close();
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        JsStore.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        JsStore.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        JsStore.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess(objMain);
                    }
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    Business.ActiveDataBase.Tables.forEach(function (item) {
                        if (item.RequireDelete) {
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
                        localStorage.setItem("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                    }
                    catch (e) {
                        console.error(e);
                    }
                };
            }
            return CreateDbLogic;
        }());
        Business.CreateDbLogic = CreateDbLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var DeleteLogic = (function (_super) {
            __extends(DeleteLogic, _super);
            function DeleteLogic(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.executeWhereUndefinedLogic = function () {
                    var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            Cursor.delete();
                            ++That.RowAffected;
                            Cursor.continue();
                        }
                    };
                    CursorOpenRequest.onerror = function (e) {
                        That.onErrorOccured(e);
                    };
                };
                _this.executeWhereDefinedLogic = function () {
                    var That = this, executeInnerDeleteLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                    Cursor.delete();
                                    ++That.RowAffected;
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    for (var Column in this.Query.Where) {
                        if (!That.ErrorOccured) {
                            if (That.ObjectStore.indexNames.contains(Column)) {
                                if (Array.isArray(this.Query.Where[Column])) {
                                    for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                        executeInnerDeleteLogic(Column, this.Query.Where[Column][i]);
                                    }
                                }
                                else {
                                    executeInnerDeleteLogic(Column, this.Query.Where[Column]);
                                }
                            }
                            else {
                                That.ErrorOccured = true;
                                That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                That.onErrorOccured(That.Error, true);
                                return;
                            }
                        }
                        else {
                            return;
                        }
                    }
                };
                try {
                    var That = _this;
                    _this.Query = query;
                    _this.Transaction = Business.DbConnection.transaction([query.From], "readwrite");
                    _this.ObjectStore = _this.Transaction.objectStore(query.From);
                    _this.Transaction.oncomplete = function () {
                        if (onSuccess != null) {
                            onSuccess(That.RowAffected);
                        }
                    };
                    _this.Transaction.onerror = function (e) {
                        That.onErrorOccured(e);
                    };
                    if (query.Where == undefined) {
                        _this.executeWhereUndefinedLogic();
                    }
                    else {
                        _this.executeWhereDefinedLogic();
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.From });
                }
                return _this;
            }
            return DeleteLogic;
        }(Business.BaseLogic));
        Business.DeleteLogic = DeleteLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
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
                    JsStore.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                    localStorage.removeItem('JsStore_' + Business.ActiveDataBase.Name + '_Db_Version');
                    Business.ActiveDataBase.Tables.forEach(function (item) {
                        localStorage.removeItem("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name);
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
            }
            return DropDbLogic;
        }());
        Business.DropDbLogic = DropDbLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var InsertLogic = (function (_super) {
            __extends(InsertLogic, _super);
            function InsertLogic(tableName, values, isReturn, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.ValuesAffected = [];
                try {
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this, Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                    Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess(isReturn ? That.ValuesAffected : That.RowAffected);
                        }
                    },
                        Transaction.ontimeout = function () {
                            console.log('transaction timed out');
                        };
                    var Store = Transaction.objectStore(tableName);
                    values.forEach(function (value) {
                        That.checkSchemaAndModifyValue(value, tableName);
                        if (!That.ErrorOccured) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            };
                            AddResult.onsuccess = function (e) {
                                if (isReturn) {
                                    That.ValuesAffected.push(value);
                                }
                                else {
                                    ++That.RowAffected;
                                }
                            };
                        }
                        else {
                            That.onErrorOccured(That.Error, true);
                        }
                    });
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: tableName });
                }
                return _this;
            }
            InsertLogic.prototype.checkSchemaAndModifyValue = function (value, tableName) {
                var CurrentTable, That = this;
                Business.ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                CurrentTable.Columns.forEach(function (column) {
                    if (!That.ErrorOccured) {
                        if (column.AutoIncrement) {
                            var ColumnValue = Number(localStorage.getItem(tableName + "_" + column.Name + "value:"));
                            value[column.Name] = ++ColumnValue;
                            localStorage.setItem(tableName + "_" + column.Name + "value:", ColumnValue.toString());
                        }
                        else if (column.CurrentDate) {
                            var CurDate = new Date();
                            value[column.Name] = {
                                DD: CurDate.getDate(),
                                MM: CurDate.getMonth() + 1,
                                YY: CurDate.getFullYear()
                            };
                        }
                        if (column.NotNull && value[column.Name] == null) {
                            That.ErrorOccured = true;
                            That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                        }
                        if (column.DataType && typeof value[column.Name] != column.DataType) {
                            That.ErrorOccured = true;
                            That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                        }
                    }
                });
            };
            return InsertLogic;
        }(Business.BaseLogic));
        Business.InsertLogic = InsertLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var OpenDbLogic = (function () {
            function OpenDbLogic(objMain, onSuccess, onError) {
                if (JsStore.Status.ConStatus != JsStore.ConnectionStatus.Connected) {
                    if (Business.ActiveDataBase.Name.length > 0) {
                        var DbVersion = Number(localStorage.getItem(Business.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, DbVersion), That = this;
                        DbRequest.onerror = function (event) {
                            if (onError != null) {
                                onError(event.target.error);
                            }
                        };
                        DbRequest.onsuccess = function (event) {
                            JsStore.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                            Business.DbConnection = DbRequest.result;
                            Business.DbConnection.onclose = function () {
                                JsStore.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                JsStore.Status.LastError = "Connection Closed, trying to reconnect";
                            };
                            Business.DbConnection.onversionchange = function (e) {
                                if (e.newVersion === null) {
                                    e.target.close();
                                }
                            };
                            Business.DbConnection.onerror = function (e) {
                                JsStore.Status.LastError = "Error occured in connection :" + e.target.result;
                            };
                            Business.DbConnection.onabort = function (e) {
                                JsStore.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                JsStore.Status.LastError = "Connection Aborted";
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
        Business.OpenDbLogic = OpenDbLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BaseSelectLogic = (function (_super) {
            __extends(BaseSelectLogic, _super);
            function BaseSelectLogic() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.Results = [];
                _this.SendResultFlag = true;
                _this.Sorted = false;
                _this.getKeyRange = function (whereIn) {
                    var KeyRange;
                    switch (whereIn.Op) {
                        case '-':
                            KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End, true, true);
                            break;
                        case '=-':
                            KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End, false, true);
                            break;
                        case '-=':
                            KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End, true, false);
                            break;
                        case '=-=':
                            KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End, false, false);
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
                        case '~': break;
                        case '=':
                            KeyRange = IDBKeyRange.only(whereIn.Value);
                            break;
                        default:
                            this.ErrorOccured = true;
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.InvalidOp, true, { Op: whereIn.Op });
                    }
                    return KeyRange;
                };
                _this.filterResultBasedOnOp = function (whereIn) {
                    var That = this, Column = whereIn.Column, Value = whereIn.Value, ValuesFound = [], executeGreaterThan = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] > Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    }, executeLessThan = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] > Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    }, executeContains = function () {
                        if (typeof That.Results[0][Column] == 'string') {
                            Value = Value.toLowerCase();
                            That.Results.forEach(function (item) {
                                if (item[Column].toLowerCase().indexOf(Value) >= 0) {
                                    ValuesFound.push(item);
                                }
                            });
                            That.Results = ValuesFound;
                        }
                        else {
                            executeEqualTo();
                        }
                    }, executeEqualTo = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] == Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    }, executeBetweenIn = function () {
                        var LowValue = whereIn.Start, Highvalue = whereIn.End;
                        if (whereIn.Op == '-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] > LowValue && item[Column] < LowValue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] < LowValue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] > LowValue && item[Column] <= LowValue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] <= LowValue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        That.Results = ValuesFound;
                    }, executeGreaterThanEqual = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] >= Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    }, executeLessThanEqual = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] <= Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    };
                    switch (whereIn.Op) {
                        case '-':
                        case '=-':
                        case '-=':
                        case '=-=':
                            executeBetweenIn();
                            break;
                        case '>':
                            executeGreaterThan();
                            break;
                        case '>=':
                            executeGreaterThanEqual();
                            break;
                        case '<':
                            executeLessThan();
                            break;
                        case '<=':
                            executeLessThanEqual();
                            break;
                        case '~':
                            executeContains();
                            break;
                        case '=':
                            executeEqualTo();
                            break;
                        default:
                            this.ErrorOccured = true;
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.InvalidOp, true, { Op: whereIn.Op });
                    }
                };
                return _this;
            }
            return BaseSelectLogic;
        }(Business.BaseLogic));
        Business.BaseSelectLogic = BaseSelectLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var SelectHelperLogic = (function (_super) {
            __extends(SelectHelperLogic, _super);
            function SelectHelperLogic() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.executeMultipleWhereInLogic = function (whereInArray) {
                    var That = this, KeyRange, CurrentIndex = 0, ExecuteLogic = function () {
                        ++CurrentIndex;
                        if (CurrentIndex != whereInArray.length) {
                            That.filterResultBasedOnOp(whereInArray[CurrentIndex]);
                            ExecuteLogic();
                        }
                        else if (That.OnSuccess) {
                            That.OnSuccess(That.Results);
                        }
                    };
                    this.SendResultFlag = false;
                    this.executeSingleWhereInLogic(whereInArray[CurrentIndex], function () {
                        ExecuteLogic();
                    });
                };
                _this.executeSingleWhereInLogic = function (whereIn, callBack) {
                    if (callBack === void 0) { callBack = null; }
                    var That = this, KeyRange = this.getKeyRange(whereIn);
                    if (!this.ErrorOccured) {
                        var CursorOpenRequest, OnCursorSuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results.push(Cursor.value);
                                Cursor.continue();
                            }
                            else if (callBack) {
                                callBack();
                            }
                        }, OnCursorError = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                            if (whereIn.Op == '~' && typeof whereIn.Value == 'string') {
                                var Value = whereIn.Value.toLowerCase(), Column = whereIn.Column;
                                CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor = e.target.result;
                                    if (Cursor) {
                                        if (Cursor.value[Column].toLowerCase().indexOf(Value) >= 0) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                    else if (callBack) {
                                        callBack();
                                    }
                                };
                            }
                            else {
                                CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                            }
                            CursorOpenRequest.onerror = OnCursorError;
                        }
                        else {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                        }
                    }
                };
                return _this;
            }
            return SelectHelperLogic;
        }(Business.BaseSelectLogic));
        Business.SelectHelperLogic = SelectHelperLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var SelectJoinLogic = (function (_super) {
            __extends(SelectJoinLogic, _super);
            function SelectJoinLogic(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.QueryStack = [];
                _this.CurrentQueryStackIndex = 0;
                _this.onTransactionCompleted = function (e) {
                    if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                        if (this.Query['Count']) {
                            this.OnSuccess(this.Results.length);
                        }
                        else {
                            if (this.Query['Skip'] && this.Query['Limit']) {
                                this.Results.splice(0, this.Query['Skip']);
                                this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                            }
                            else if (this.Query['Skip']) {
                                this.Results.splice(0, this.Query['Skip']);
                            }
                            else if (this.Query['Limit']) {
                                this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                            }
                            this.OnSuccess(this.Results);
                        }
                    }
                };
                _this.executeWhereJoinLogic = function (joinQuery, query) {
                    var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length;
                    new Business.SelectLogic({
                        From: query.Table,
                        Where: query.Where,
                        WhereIn: query.WhereIn,
                        Order: query.Order
                    }, function (results) {
                        results.forEach(function (value, index) {
                            for (var i = 0; i < ResultLength; i++) {
                                Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                doJoin(Item, value, i);
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
                        That.onErrorOccured(error);
                    });
                    var doJoin = function (value1, value2, itemIndex) {
                        Results[JoinIndex] = {};
                        if (value1 == value2[query.Column]) {
                            Results[JoinIndex][query.Table] = value2;
                            for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                            }
                            ++JoinIndex;
                        }
                        else if (query.JoinType == 'left') {
                            Results[JoinIndex] = {};
                            Results[JoinIndex][query.Table] = null;
                            for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                            }
                            ++JoinIndex;
                        }
                    };
                };
                _this.executeRightJoin = function (joinQuery, query) {
                    var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length, ItemIndex = 0, Where = {}, onExecutionFinished = function () {
                        That.Results = Results;
                        if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                            That.startExecutionJoinLogic();
                        }
                        else {
                            That.onTransactionCompleted(null);
                        }
                    }, doRightJoin = function (results) {
                        var ValueFound = false;
                        results.forEach(function (item, index) {
                            for (ItemIndex = 0; ItemIndex < ResultLength; ItemIndex++) {
                                if (item[query.Column] == TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column]) {
                                    ValueFound = true;
                                    break;
                                }
                            }
                            Results[index] = {};
                            Results[index][query.Table] = item;
                            if (ValueFound) {
                                ValueFound = false;
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[index][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                }
                            }
                            else {
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[index][That.QueryStack[j].Table] = null;
                                }
                            }
                        });
                    }, executeLogic = function () {
                        new Business.SelectLogic({
                            From: query.Table,
                            Where: query.Where,
                            WhereIn: query.WhereIn,
                            Order: query.Order
                        }, function (results) {
                            doRightJoin(results);
                            onExecutionFinished();
                        }, function (error) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(error);
                        });
                    };
                    executeLogic();
                };
                _this.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
                    var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length, ItemIndex = 0, Where = {}, onExecutionFinished = function () {
                        That.Results = Results;
                        if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                            That.startExecutionJoinLogic();
                        }
                        else {
                            That.onTransactionCompleted(null);
                        }
                    }, doJoin = function (results) {
                        if (results.length > 0) {
                            results.forEach(function (value) {
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = value;
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                }
                                ++JoinIndex;
                            });
                        }
                        else if (query.JoinType == 'left') {
                            Results[JoinIndex] = {};
                            Results[JoinIndex][query.Table] = null;
                            for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                            }
                            ++JoinIndex;
                        }
                    }, executeLogic = function () {
                        if (ItemIndex < ResultLength) {
                            if (!That.ErrorOccured) {
                                Where[query.Column] = TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column];
                                new Business.SelectLogic({
                                    From: query.Table,
                                    Where: Where,
                                    Order: query.Order
                                }, function (results) {
                                    doJoin(results);
                                    ++ItemIndex;
                                    executeLogic();
                                }, function (error) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(error);
                                });
                            }
                        }
                        else {
                            onExecutionFinished();
                        }
                    };
                    executeLogic();
                };
                _this.OnSuccess = onSuccess;
                _this.OnError = onError;
                _this.Query = query;
                var That = _this, TableList = [];
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
                if (!_this.ErrorOccured) {
                    new Business.SelectLogic({
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
                        That.onErrorOccured(error);
                    });
                }
                return _this;
            }
            SelectJoinLogic.prototype.startExecutionJoinLogic = function () {
                var JoinQuery;
                if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
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
                if (Query.JoinType == 'right') {
                    this.executeRightJoin(JoinQuery, Query);
                }
                else if (Query.WhereIn || Query.Where) {
                    this.executeWhereJoinLogic(JoinQuery, Query);
                }
                else {
                    this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                }
            };
            return SelectJoinLogic;
        }(Business.BaseSelectLogic));
        Business.SelectJoinLogic = SelectJoinLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var SelectLogic = (function (_super) {
            __extends(SelectLogic, _super);
            function SelectLogic(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.executeWhereInLogic = function () {
                    if (Array.isArray(this.Query.WhereIn)) {
                        if (this.Query.WhereIn.length > 0) {
                            this.executeMultipleWhereInLogic(this.Query.WhereIn);
                        }
                        else {
                            this.executeWhereUndefinedLogic();
                        }
                    }
                    else {
                        this.executeSingleWhereInLogic(this.Query.WhereIn);
                    }
                };
                _this.executeWhereLogic = function () {
                    var Column, SkipRecord = this.Query.Skip, LimitRecord = this.Query.Limit, That = this, executeInnerWhereLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
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
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(SkipRecord - 1);
                                    }
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
                            };
                        }
                        else if (LimitRecord) {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor && That.Results.length != LimitRecord) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
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
                            };
                        }
                    };
                    for (Column in this.Query.Where) {
                        if (!this.ErrorOccured) {
                            if (this.ObjectStore.indexNames.contains(Column)) {
                                if (Array.isArray(this.Query.Where[Column])) {
                                    for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                        executeInnerWhereLogic(Column, this.Query.Where[Column][i]);
                                    }
                                }
                                else {
                                    executeInnerWhereLogic(Column, this.Query.Where[Column]);
                                }
                            }
                            else {
                                That.ErrorOccured = true;
                                That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                That.onErrorOccured(That.Error, true);
                            }
                            break;
                        }
                        else {
                            return;
                        }
                    }
                };
                _this.executeWhereUndefinedLogic = function () {
                    var That = this, CursorOpenRequest;
                    if (this.Query.Order && this.Query.Order.By) {
                        if (That.ObjectStore.indexNames.contains(this.Query.Order.By)) {
                            var Order = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                            this.Sorted = true;
                            CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, Order);
                        }
                        else {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: this.Query.Order.By });
                            return false;
                        }
                    }
                    else {
                        CursorOpenRequest = this.ObjectStore.openCursor();
                    }
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            That.Results.push(Cursor.value);
                            Cursor.continue();
                        }
                    };
                    CursorOpenRequest.onerror = function (e) {
                        That.onErrorOccured(e);
                    };
                };
                var That = _this;
                _this.Query = query;
                _this.OnSuccess = onSuccess;
                _this.OnError = onError;
                try {
                    _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                    _this.Transaction.oncomplete = function (e) {
                        if (That.Results.length > 0 && !That.Sorted && query.Order && query.Order.By) {
                            query.Order.Type = query.Order.Type ? query.Order.Type.toLowerCase() : 'asc';
                            var OrderColumn = query.Order.By, sortNumberInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn] - b[OrderColumn];
                                });
                            }, sortNumberInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn] - a[OrderColumn];
                                });
                            }, sortAlphabetInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn].toLowerCase().localeCompare(b[OrderColumn].toLowerCase());
                                });
                            }, sortAlphabetInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn].toLowerCase().localeCompare(a[OrderColumn].toLowerCase());
                                });
                            };
                            if (typeof That.Results[0][OrderColumn] == 'string') {
                                if (query.Order.Type == 'asc') {
                                    sortAlphabetInAsc();
                                }
                                else {
                                    sortAlphabetInDesc();
                                }
                            }
                            else if (typeof That.Results[0][OrderColumn] == 'number') {
                                if (query.Order.Type == 'asc') {
                                    sortNumberInAsc();
                                }
                                else {
                                    sortNumberInDesc();
                                }
                            }
                            onSuccess(That.Results);
                        }
                        else if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    };
                    _this.Transaction.ontimeout = function () {
                        console.log('transaction timed out');
                    };
                    _this.ObjectStore = _this.Transaction.objectStore(query.From);
                    if (query.WhereIn != undefined) {
                        _this.executeWhereInLogic();
                    }
                    else if (query.Where != undefined) {
                        _this.executeWhereLogic();
                    }
                    else {
                        _this.executeWhereUndefinedLogic();
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.From });
                }
                return _this;
            }
            return SelectLogic;
        }(Business.SelectHelperLogic));
        Business.SelectLogic = SelectLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var UpdateLogic = (function (_super) {
            __extends(UpdateLogic, _super);
            function UpdateLogic(query, onSuccess, onError) {
                var _this = this;
                try {
                    _this = _super.call(this) || this;
                    _this.OnError = onError;
                    _this.checkSchema(query.Set, query.In);
                    if (!_this.ErrorOccured) {
                        _this.Query = query;
                        _this.OnSuccess = onSuccess;
                        _this.Transaction = Business.DbConnection.transaction([query.In], "readwrite");
                        _this.ObjectStore = _this.Transaction.objectStore(query.In);
                        var That = _this;
                        _this.Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(That.RowAffected);
                            }
                        };
                        _this.Transaction.ontimeout = function () {
                            console.log('transaction timed out');
                        };
                        if (query.Where == undefined) {
                            _this.executeWhereUndefinedlogic();
                        }
                        else {
                            _this.executeWhereLogic();
                        }
                    }
                    else {
                        _this.onErrorOccured(_this.Error, true);
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.In });
                }
                return _this;
            }
            UpdateLogic.prototype.executeWhereUndefinedlogic = function () {
                var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                CursorOpenRequest.onsuccess = function (e) {
                    var Cursor = e.target.result;
                    if (Cursor) {
                        for (var key in That.Query.Set) {
                            Cursor.value[key] = That.Query.Set[key];
                        }
                        Cursor.update(Cursor.value);
                        ++That.RowAffected;
                        Cursor.continue();
                    }
                };
                CursorOpenRequest.onerror = function (e) {
                    That.onErrorOccured(e);
                };
            };
            UpdateLogic.prototype.executeWhereLogic = function () {
                var That = this, executeInnerUpdateLogic = function (column, value) {
                    var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                for (var key in That.Query.Set) {
                                    Cursor.value[key] = That.Query.Set[key];
                                }
                                Cursor.update(Cursor.value);
                                ++That.RowAffected;
                            }
                            Cursor.continue();
                        }
                    };
                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    };
                };
                for (var Column in this.Query.Where) {
                    if (!this.ErrorOccured) {
                        if (this.ObjectStore.indexNames.contains(Column)) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    executeInnerUpdateLogic(Column, this.Query.Where[Column][i]);
                                }
                            }
                            else {
                                executeInnerUpdateLogic(Column, this.Query.Where[Column]);
                            }
                        }
                        else {
                            That.ErrorOccured = true;
                            That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorOccured(That.Error, true);
                        }
                        break;
                    }
                    else {
                        return;
                    }
                }
            };
            UpdateLogic.prototype.checkSchema = function (suppliedValue, tableName) {
                var CurrentTable, That = this;
                Business.ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                CurrentTable.Columns.forEach(function (column) {
                    if (!That.ErrorOccured) {
                        if (column.Name in suppliedValue) {
                            var executeCheck = function (value) {
                                if (column.NotNull && That.isNull(value)) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                                }
                                if (column.DataType && typeof value != column.DataType) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                                }
                            };
                            executeCheck(suppliedValue[column.Name]);
                        }
                    }
                });
            };
            return UpdateLogic;
        }(Business.BaseLogic));
        Business.UpdateLogic = UpdateLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var ClearLogic = (function () {
            function ClearLogic(tableName, onSuccess, onError) {
                var ObjectStore = Business.DbConnection.transaction([tableName], "readwrite").Transaction.objectStore(tableName), ClearRequest = ObjectStore.clear();
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
        Business.ClearLogic = ClearLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var MainLogic = (function () {
            function MainLogic(dataBase) {
                this.openDb = function (objMain, onSuccess, onError) {
                    new Business.OpenDbLogic(objMain, onSuccess, onError);
                };
                this.closeDb = function () {
                    if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                        Business.DbConnection.close();
                    }
                };
                this.dropDb = function (onSuccess, onError) {
                    new Business.DropDbLogic(Business.ActiveDataBase.Name, onSuccess, onError);
                };
                this.update = function (query, onSuccess, onError) {
                    new Business.UpdateLogic(query, onSuccess, onError);
                };
                this.insert = function (tableName, values, isReturn, onSuccess, onError) {
                    if (!Array.isArray(values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (values.length > 0) {
                        var ObjInsert = new Business.InsertLogic(tableName, values, isReturn, onSuccess, onError);
                    }
                    else {
                        if (onError != null) {
                            onError(JsStore.UtilityLogic.getError(JsStore.ErrorType.NoValueSupplied, true, null));
                        }
                    }
                };
                this.delete = function (query, onSuccess, onError) {
                    new Business.DeleteLogic(query, onSuccess, onError);
                };
                this.select = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        new Business.SelectJoinLogic(query, onSuccess, onError);
                    }
                    else {
                        new Business.SelectLogic(query, onSuccess, onError);
                    }
                };
                this.count = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        query['Count'] = true;
                        new Business.SelectJoinLogic(query, onSuccess, onError);
                    }
                    else {
                        new Business.CountLogic(query, onSuccess, onError);
                    }
                };
                this.createDb = function (objMain, dbVersion, onSuccess, onError) {
                    new Business.CreateDbLogic(objMain, dbVersion, onSuccess, onError);
                };
                this.clear = function (tableName, onSuccess, onError) {
                    new Business.ClearLogic(tableName, onSuccess, onError);
                };
                Business.ActiveDataBase = dataBase;
            }
            return MainLogic;
        }());
        Business.MainLogic = MainLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var Model = JsStore.Model;
var DataBase = Model.DataBase;
var Column = Model.Column;
var Table = Model.Table;
var JsStore;
(function (JsStore) {
    var Instance = (function () {
        function Instance() {
            JsStore.UtilityLogic.setDbType();
        }
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            var Db = new DataBase(dataBase), DbVersion = Number(localStorage.getItem('JsStore_' + dataBase.Name + '_Db_Version'));
            this.IndexDbObj = new JsStore.Business.MainLogic(Db);
            this.IndexDbObj.createDb(this, DbVersion, onSuccess, onError);
            return this;
        };
        Instance.prototype.openDb = function (onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.IndexDbObj.openDb(this, onSuccess, onError);
        };
        Instance.prototype.closeDb = function (onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.IndexDbObj.closeDb();
        };
        Instance.prototype.dropDb = function (onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.IndexDbObj.dropDb(onSuccess, onError);
        };
        Instance.prototype.select = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.select(query, OnSuccess, OnError);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.select(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.count = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.count(query, OnSuccess, OnError);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.count(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.count(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.insert = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var IsReturn = query.Return ? query.Return : false, OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.insert(query.Into, query.Values, IsReturn, OnSuccess, OnError);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.insert(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.insert(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.update = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.update(query, OnSuccess, OnError);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.update(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.update(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.delete = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.delete(query, OnSuccess, OnError);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.delete(query, onSuccess, onError);
                }, 50);
            }
            else if (JsStore.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.delete(query, onSuccess, onError);
                });
            }
        };
        return Instance;
    }());
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BaseCountLogic = (function (_super) {
            __extends(BaseCountLogic, _super);
            function BaseCountLogic() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.ResultCount = 0;
                _this.executeMultipleWhereInLogic = function (whereInArray) {
                    var That = this, WhereIn, KeyRange;
                    for (WhereIn in whereInArray) {
                        KeyRange = this.getKeyRange();
                        if (!this.ErrorOccured) {
                            var CursorOpenRequest, OnCursorSuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    ++That.ResultCount;
                                    Cursor.continue();
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
                                JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
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
                                ++That.ResultCount;
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
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                        }
                    }
                };
                return _this;
            }
            return BaseCountLogic;
        }(Business.BaseSelectLogic));
        Business.BaseCountLogic = BaseCountLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var CountLogic = (function (_super) {
            __extends(CountLogic, _super);
            function CountLogic(query, onSuccess, onError) {
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
                    var Column, That = this;
                    var executeInnerWhereLogic = function (column, value) {
                        if (That.ObjectStore.indexNames.contains(column)) {
                            var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            };
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                        ++That.ResultCount;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            return false;
                        }
                    };
                    for (Column in this.Query.Where) {
                        if (Array.isArray(this.Query.Where[Column])) {
                            for (var i = 0, length = this.Query.Where[Column].length; i < length; i++) {
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
                    var That = this;
                    if (this.ObjectStore.count) {
                        var CountRequest = this.ObjectStore.count();
                        CountRequest.onsuccess = function () {
                            That.ResultCount += CountRequest.result;
                        };
                    }
                    else {
                        var CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                ++That.ResultCount;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.onErrorOccured(e);
                        };
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnSuccess = onSuccess;
                _this.OnError = onError;
                try {
                    _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                    _this.Transaction.oncomplete = function (e) {
                        if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.ResultCount);
                        }
                    };
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
                }
                catch (ex) {
                    if (ex.name == "NotFoundError") {
                        JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.From });
                    }
                    else {
                        console.warn(ex);
                    }
                }
                return _this;
            }
            return CountLogic;
        }(Business.BaseCountLogic));
        Business.CountLogic = CountLogic;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
//# sourceMappingURL=JsStorage.js.map