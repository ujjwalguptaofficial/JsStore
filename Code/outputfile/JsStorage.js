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
    var WebWorkerStatus;
    (function (WebWorkerStatus) {
        WebWorkerStatus["Registered"] = "registerd";
        WebWorkerStatus["Failed"] = "failed";
        WebWorkerStatus["NotStarted"] = "not_started";
    })(WebWorkerStatus = JsStore.WebWorkerStatus || (JsStore.WebWorkerStatus = {}));
    ;
    var CodeExecutionHelper = (function () {
        function CodeExecutionHelper() {
            this.RequestQueue = [];
            this.IsCodeExecuting = false;
            this.WorkerStatus = WebWorkerStatus.NotStarted;
            this.prcoessExecutionOfCode = function (request) {
                this.RequestQueue.push(request);
                console.log("request pushed:" + request.Name);
                if (this.RequestQueue.length == 1 && this.WorkerStatus != WebWorkerStatus.NotStarted) {
                    console.log("request executing from processExecutionOfCode:" + request.Name);
                    this.executeCode();
                }
            };
            this.executeCode = function () {
                if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                    console.log("request executing" + this.RequestQueue[0].Name);
                    this.IsCodeExecuting = true;
                    var Request = {
                        Name: this.RequestQueue[0].Name,
                        Query: this.RequestQueue[0].Query
                    };
                    if (this.WorkerStatus == WebWorkerStatus.Registered) {
                        this.executeCodeUsingWorker(Request);
                    }
                    else {
                        this.executeCodeDirect(Request);
                    }
                }
            };
            this.executeCodeDirect = function (request) {
                var That = this;
                new JsStore.Business.Main(function (results) {
                    That.processFinishedRequest(results);
                }).checkConnectionAndExecuteLogic(request);
            };
            this.executeCodeUsingWorker = function (request) {
                this.WorkerInstance.postMessage(request);
            };
            this.processFinishedRequest = function (message) {
                var FinishedRequest = this.RequestQueue.shift();
                this.IsCodeExecuting = false;
                if (FinishedRequest) {
                    console.log("request finished:" + FinishedRequest.Name);
                    if (message.ErrorOccured) {
                        if (FinishedRequest.OnError) {
                            FinishedRequest.OnError(message.ErrorDetails);
                        }
                    }
                    else {
                        if (FinishedRequest.OnSuccess) {
                            if (message.ReturnedValue != null) {
                                FinishedRequest.OnSuccess(message.ReturnedValue);
                            }
                            else {
                                FinishedRequest.OnSuccess();
                            }
                        }
                    }
                    this.executeCode();
                }
            };
            this.createWorker = function () {
                var That = this;
                new JsStore.WebWorker.Main().getWorkerUrl(function (url) {
                    That.WorkerInstance = new Worker(url);
                    That.WorkerInstance.onmessage = function (msg) {
                        That.onMessageFromWorker(msg);
                    };
                    setTimeout(function () {
                        if (That.WorkerStatus != WebWorkerStatus.Failed) {
                            That.WorkerStatus = WebWorkerStatus.Registered;
                        }
                        else {
                            console.warn('JsStore is not runing in web worker');
                        }
                        That.executeCode();
                    }, 100);
                }, function () {
                    setTimeout(function () {
                        console.warn('JsStore is not runing in web worker');
                        That.WorkerStatus = WebWorkerStatus.Failed;
                        That.executeCode();
                    }, 100);
                });
            };
            this.onMessageFromWorker = function (msg) {
                if (typeof msg.data == 'string') {
                    var Datas = msg.data.split(':')[1];
                    switch (Datas) {
                        case 'WorkerFailed':
                            this.WorkerStatus = WebWorkerStatus.Failed;
                            break;
                    }
                }
                else {
                    this.processFinishedRequest(msg.data);
                }
            };
        }
        return CodeExecutionHelper;
    }());
    JsStore.CodeExecutionHelper = CodeExecutionHelper;
})(JsStore || (JsStore = {}));
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
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getError = function (errorType, logError, errorDetail) {
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
        Utils.convertObjectintoLowerCase = function (obj) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        };
        Utils.setDbType = function () {
            self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return Utils;
    }());
    JsStore.Utils = Utils;
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
                this.NotNull = key.NotNull != null ? key.NotNull : false;
                this.DataType = key.DataType != null ? key.DataType : '';
                this.Default = key.Default;
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
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.PrimaryKey) {
                        That.PrimaryKey = item.Name;
                        KeyStore.set("JsStore_" + dbName + "_" + That.Name + "_" + item.Name, true);
                    }
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var That = this;
                KeyStore.get("JsStore_" + dbName + "_" + this.Name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        That.RequireCreation = true;
                    }
                    else if (tableVersion != That.Version) {
                        this.RequireDelete = true;
                    }
                });
            };
            Table.prototype.setDbVersion = function (dbName) {
                var That = this;
                KeyStore.get('JsStore_' + dbName + '_Db_Version', function (dbVersion) {
                    if (!dbVersion) {
                        KeyStore.set('JsStore_' + dbName + '_Db_Version', That.Version);
                    }
                    else if (That.Version > dbVersion) {
                        KeyStore.set('JsStore_' + dbName + '_Db_Version', That.Version);
                    }
                    KeyStore.set("JsStore_" + dbName + "_" + That.Name + "_Version", That.Version);
                });
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
                this.create = function (onSuccess, onError) {
                    console.log('create Database called');
                    var That = this, createDb = function () {
                        setTimeout(function () {
                            console.log('calling create db');
                            var LastTable = That.Tables[That.Tables.length - 1];
                            KeyStore.get("JsStore_" + That.Name + "_" + LastTable.Name + "_Version", function (version) {
                                if (version == LastTable.Version) {
                                    KeyStore.get('JsStore_' + That.Name + '_Db_Version', function (dbVersion) {
                                        console.log('db version is: ' + dbVersion);
                                        JsStore.Business.ActiveDataBase = That;
                                        new JsStore.Business.CreateDb(dbVersion, onSuccess, onError);
                                    });
                                }
                                else {
                                    createDb();
                                }
                            });
                        }, 100);
                    };
                    createDb();
                };
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
        var AjaxReqType;
        (function (AjaxReqType) {
            AjaxReqType["Get"] = "GET";
            AjaxReqType["Post"] = "POST";
        })(AjaxReqType = Business.AjaxReqType || (Business.AjaxReqType = {}));
        var AjaxHelper = (function () {
            function AjaxHelper() {
                this.XMLHttpFactories = [
                    function () { return new XMLHttpRequest(); },
                    function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
                    function () { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); },
                    function () { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); },
                    function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
                    function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
                ];
                this.sendRequest = function (option) {
                    var Req = this.createXMLHTTPObject();
                    if (!Req)
                        return;
                    Req.open(option.Type, option.Url, true);
                    if (option.Type == AjaxReqType.Post) {
                        var ContentType = option.ContentType ? option.ContentType : 'application/x-www-form-urlencoded';
                        Req.setRequestHeader('Content-type', ContentType);
                    }
                    Req.onreadystatechange = function () {
                        if (Req.readyState != 4)
                            return;
                        if (Req.status != 200 && Req.status != 304) {
                            if (option.OnError) {
                                option.OnError(Req.responseText, Req.status);
                            }
                        }
                        else {
                            if (option.OnSuccess) {
                                option.OnSuccess(Req.responseText, Req.status);
                            }
                        }
                    };
                    if (Req.readyState == 4)
                        return;
                    Req.send(option.PostData);
                };
                this.createXMLHTTPObject = function () {
                    var xmlhttp = false;
                    for (var i = 0; i < this.XMLHttpFactories.length; i++) {
                        try {
                            xmlhttp = this.XMLHttpFactories[i]();
                        }
                        catch (e) {
                            continue;
                        }
                        break;
                    }
                    return xmlhttp;
                };
            }
            return AjaxHelper;
        }());
        Business.AjaxHelper = AjaxHelper;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Base = (function () {
            function Base() {
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
                this.onTransactionTimeout = function (e) {
                    console.log('transaction timed out');
                };
                this.isNull = function (value) {
                    return value == null || value.length == 0;
                };
                this.onExceptionOccured = function (ex, info) {
                    if (ex.name == "NotFoundError") {
                        JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, true, info);
                    }
                    else {
                        console.error(ex);
                    }
                };
            }
            Base.prototype.checkForWhereConditionMatch = function (where, value) {
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
            Base.prototype.checkWhereSchema = function (suppliedValue, tableName) {
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
                                    That.Error = JsStore.Utils.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                                }
                                if (column.DataType && typeof value != column.DataType) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.Utils.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
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
            return Base;
        }());
        Business.Base = Base;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var CreateDb = (function () {
            function CreateDb(dbVersion, onSuccess, onError) {
                var That = this, DbRequest = indexedDB.open(Business.ActiveDataBase.Name, dbVersion);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close();
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        Business.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
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
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
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
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
                                }
                            });
                        }
                        KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_Version", item.Version);
                    }
                    catch (e) {
                        console.error(e);
                    }
                };
            }
            return CreateDb;
        }());
        Business.CreateDb = CreateDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete = (function (_super) {
            __extends(Delete, _super);
            function Delete(query, onSuccess, onError) {
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
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
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
            return Delete;
        }(Business.Base));
        Business.Delete = Delete;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var DropDb = (function () {
            function DropDb(name, onSuccess, onError) {
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
                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                    KeyStore.remove('JsStore_' + Business.ActiveDataBase.Name + '_Db_Version');
                    Business.ActiveDataBase.Tables.forEach(function (item) {
                        KeyStore.remove("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name);
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
            }
            return DropDb;
        }());
        Business.DropDb = DropDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert = (function (_super) {
            __extends(Insert, _super);
            function Insert(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.ValuesAffected = [];
                _this.ValuesIndex = 0;
                _this.onTransactionCompleted = function () {
                    if (this.OnSuccess != null) {
                        this.OnSuccess(this.IsReturn ? this.ValuesAffected : this.RowAffected);
                    }
                };
                _this.insertData = function (value) {
                    if (value) {
                        var That = this;
                        That.checkSchemaAndModifyValue(value, function () {
                            if (!That.ErrorOccured) {
                                var Transaction = Business.DbConnection.transaction([That.Query.Into], "readwrite"), ObjectStore = Transaction.objectStore(That.Query.Into);
                                var AddResult = ObjectStore.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorOccured(e);
                                };
                                AddResult.onsuccess = function (e) {
                                    That.ValuesAffected.push(value);
                                    ++That.RowAffected;
                                    That.insertData(That.Query.Values[this.ValuesIndex++]);
                                };
                            }
                            else {
                                That.onErrorOccured(That.Error, true);
                            }
                        });
                    }
                    else {
                        this.onTransactionCompleted();
                    }
                };
                _this.getTable = function (tableName) {
                    var CurrentTable, That = this;
                    Business.ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tableName) {
                            CurrentTable = table;
                            return false;
                        }
                        return true;
                    });
                    return CurrentTable;
                };
                try {
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this;
                    _this.Table = _this.getTable(query.Into);
                    _this.insertData(_this.Query.Values[_this.ValuesIndex++]);
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.Into });
                }
                return _this;
            }
            Insert.prototype.checkSchemaAndModifyValue = function (value, callBack) {
                var That = this, TableName = this.Table.Name, Index = 0, checkAndModifyInternal = function (column) {
                    if (column) {
                        var CheckNotNullAndDataType = function () {
                            if (column.NotNull && value[column.Name] == null) {
                                That.ErrorOccured = true;
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                            }
                            if (column.DataType && typeof value[column.Name] != column.DataType) {
                                That.ErrorOccured = true;
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                            }
                            checkAndModifyInternal(That.Table.Columns[Index++]);
                        };
                        if (!That.ErrorOccured) {
                            if (column.AutoIncrement) {
                                KeyStore.get("JsStore_" + Business.ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue) {
                                    value[column.Name] = ++columnValue;
                                    KeyStore.set(TableName + "_" + column.Name + "_Value", columnValue);
                                    CheckNotNullAndDataType();
                                });
                            }
                            else if (column.Default && value[column.Name] == null) {
                                value[column.Name] = column.Default;
                                CheckNotNullAndDataType();
                            }
                            else {
                                CheckNotNullAndDataType();
                            }
                        }
                    }
                    else {
                        callBack();
                    }
                };
                checkAndModifyInternal(That.Table.Columns[Index++]);
            };
            return Insert;
        }(Business.Base));
        Business.Insert = Insert;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var OpenDb = (function () {
            function OpenDb(dbVersion, onSuccess, onError) {
                if (Business.Status.ConStatus != JsStore.ConnectionStatus.Connected) {
                    if (Business.ActiveDataBase.Name.length > 0) {
                        var DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, dbVersion), That = this;
                        DbRequest.onerror = function (event) {
                            if (onError != null) {
                                onError(event.target.error);
                            }
                        };
                        DbRequest.onsuccess = function (event) {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                            Business.DbConnection = DbRequest.result;
                            Business.DbConnection.onclose = function () {
                                Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                Business.Status.LastError = "Connection Closed, trying to reconnect";
                            };
                            Business.DbConnection.onversionchange = function (e) {
                                if (e.newVersion === null) {
                                    e.target.close();
                                }
                            };
                            Business.DbConnection.onerror = function (e) {
                                Business.Status.LastError = "Error occured in connection :" + e.target.result;
                            };
                            Business.DbConnection.onabort = function (e) {
                                Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                Business.Status.LastError = "Connection Aborted";
                            };
                            if (onSuccess != null) {
                                onSuccess();
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
            return OpenDb;
        }());
        Business.OpenDb = OpenDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BaseSelect = (function (_super) {
            __extends(BaseSelect, _super);
            function BaseSelect() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.Results = [];
                _this.SendResultFlag = true;
                _this.Sorted = false;
                _this.getKeyRange = function (whereIn) {
                    var KeyRange;
                    switch (whereIn.Op) {
                        case '-':
                            KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, true, true);
                            break;
                        case '=-':
                            KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, false, true);
                            break;
                        case '-=':
                            KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, true, false);
                            break;
                        case '=-=':
                            KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, false, false);
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
                            JsStore.Utils.getError(JsStore.ErrorType.InvalidOp, true, { Op: whereIn.Op });
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
                        var LowValue = Value.Low, Highvalue = Value.High;
                        if (whereIn.Op == '-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] > LowValue && item[Column] < Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] <= Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] < Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] <= Highvalue) {
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
                            JsStore.Utils.getError(JsStore.ErrorType.InvalidOp, true, { Op: whereIn.Op });
                    }
                };
                return _this;
            }
            return BaseSelect;
        }(Business.Base));
        Business.BaseSelect = BaseSelect;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var SelectHelper = (function (_super) {
            __extends(SelectHelper, _super);
            function SelectHelper() {
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
                            JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                        }
                    }
                };
                return _this;
            }
            return SelectHelper;
        }(Business.BaseSelect));
        Business.SelectHelper = SelectHelper;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var SelectJoin = (function (_super) {
            __extends(SelectJoin, _super);
            function SelectJoin(query, onSuccess, onError) {
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
                    new Business.Select({
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
                        new Business.Select({
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
                                new Business.Select({
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
                    new Business.Select({
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
            SelectJoin.prototype.startExecutionJoinLogic = function () {
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
            return SelectJoin;
        }(Business.BaseSelect));
        Business.SelectJoin = SelectJoin;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select = (function (_super) {
            __extends(Select, _super);
            function Select(query, onSuccess, onError) {
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
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
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
                            var OrderType = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                            this.Sorted = true;
                            CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, OrderType);
                        }
                        else {
                            JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: this.Query.Order.By });
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
                            if (That.OnSuccess) {
                                That.OnSuccess(That.Results);
                            }
                        }
                        else if (That.SendResultFlag) {
                            if (That.OnSuccess) {
                                That.OnSuccess(That.Results);
                            }
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
            return Select;
        }(Business.SelectHelper));
        Business.Select = Select;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update = (function (_super) {
            __extends(Update, _super);
            function Update(query, onSuccess, onError) {
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
            Update.prototype.executeWhereUndefinedlogic = function () {
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
            Update.prototype.executeWhereLogic = function () {
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
                            That.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorOccured(That.Error, true);
                        }
                        break;
                    }
                    else {
                        return;
                    }
                }
            };
            Update.prototype.checkSchema = function (suppliedValue, tableName) {
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
                                    That.Error = JsStore.Utils.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                                }
                                if (column.DataType && typeof value != column.DataType) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.Utils.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                                }
                            };
                            executeCheck(suppliedValue[column.Name]);
                        }
                    }
                });
            };
            return Update;
        }(Business.Base));
        Business.Update = Update;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Clear = (function () {
            function Clear(tableName, onSuccess, onError) {
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
            return Clear;
        }());
        Business.Clear = Clear;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        Business.Status = {
            ConStatus: JsStore.ConnectionStatus.NotStarted,
            LastError: ""
        };
        var Main = (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    console.log('executing logic from checkConnection:' + request.Name);
                    if (request.Name == 'create_db' || request.Name == 'open_db') {
                        this.executeLogic(request);
                    }
                    else {
                        if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                            this.executeLogic(request);
                        }
                        else if (Business.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                            var That = this;
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                        else if (Business.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.openDb(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, function (err) {
                                console.error(err);
                            });
                        }
                    }
                };
                this.returnResult = function (result) {
                    if (this.OnSuccess) {
                        this.OnSuccess(result);
                    }
                    else {
                        self.postMessage(result);
                    }
                };
                this.executeLogic = function (request) {
                    var That = this, OnSuccess = function (results) {
                        That.returnResult({
                            ReturnedValue: results
                        });
                    }, OnError = function (err) {
                        That.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'select':
                            this.select(request.Query, OnSuccess, OnError);
                            break;
                        case 'insert':
                            this.insert(request.Query, OnSuccess, OnError);
                            break;
                        case 'update': break;
                        case 'delete': break;
                        case 'create_db':
                            this.createDb(request.Query, OnSuccess, OnError);
                            break;
                        case 'clear': break;
                        case 'dropDb': break;
                        case 'count': break;
                    }
                };
                this.openDb = function (onSuccess, onError) {
                    KeyStore.get(Business.ActiveDataBase.Name + 'Db_Version', function (dbVersion) {
                        new Business.OpenDb(dbVersion, onSuccess, onError);
                    });
                };
                this.closeDb = function () {
                    if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                        Business.DbConnection.close();
                    }
                };
                this.dropDb = function (onSuccess, onError) {
                    new Business.DropDb(Business.ActiveDataBase.Name, onSuccess, onError);
                };
                this.update = function (query, onSuccess, onError) {
                    new Business.Update(query, onSuccess, onError);
                };
                this.insert = function (query, onSuccess, onError) {
                    if (!Array.isArray(query.Values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (query.Values.length > 0) {
                        new Business.Insert(query, onSuccess, onError);
                    }
                    else {
                        if (onError != null) {
                            onError(JsStore.Utils.getError(JsStore.ErrorType.NoValueSupplied, true, null));
                        }
                    }
                };
                this.delete = function (query, onSuccess, onError) {
                    new Business.Delete(query, onSuccess, onError);
                };
                this.select = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        new Business.SelectJoin(query, onSuccess, onError);
                    }
                    else {
                        new Business.Select(query, onSuccess, onError);
                    }
                };
                this.count = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        query['Count'] = true;
                        new Business.SelectJoin(query, onSuccess, onError);
                    }
                    else {
                        new Business.Count(query, onSuccess, onError);
                    }
                };
                this.createDb = function (dataBase, onSuccess, onError) {
                    new DataBase(dataBase).create(onSuccess, onError);
                };
                this.clear = function (tableName, onSuccess, onError) {
                    new Business.Clear(tableName, onSuccess, onError);
                };
                this.OnSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var Model = JsStore.Model;
var DataBase = Model.DataBase;
var Column = Model.Column;
var Table = Model.Table;
var JsStore;
(function (JsStore) {
    var Instance = (function (_super) {
        __extends(Instance, _super);
        function Instance() {
            var _this = _super.call(this) || this;
            JsStore.Utils.setDbType();
            try {
                _this.createWorker();
            }
            catch (ex) {
                _this.WorkerStatus = JsStore.WebWorkerStatus.Failed;
            }
            return _this;
        }
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'create_db',
                OnSuccess: onSuccess,
                OnError: onError,
                Query: dataBase
            });
            return this;
        };
        Instance.prototype.dropDb = function (onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'drop_db',
                OnSuccess: onSuccess,
                OnError: onError
            });
        };
        Instance.prototype.select = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            this.prcoessExecutionOfCode({
                Name: 'select',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
        };
        Instance.prototype.count = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            this.prcoessExecutionOfCode({
                Name: 'count',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
        };
        Instance.prototype.insert = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            this.prcoessExecutionOfCode({
                Name: 'insert',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
        };
        Instance.prototype.update = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            this.prcoessExecutionOfCode({
                Name: 'update',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
        };
        Instance.prototype.delete = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            this.prcoessExecutionOfCode({
                Name: 'delete',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
        };
        Instance.prototype.clear = function (tableName, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'clear',
                Query: tableName,
                OnSuccess: onSuccess,
                OnError: onerror
            });
        };
        return Instance;
    }(JsStore.CodeExecutionHelper));
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BaseCount = (function (_super) {
            __extends(BaseCount, _super);
            function BaseCount() {
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
                                JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
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
                            JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                        }
                    }
                };
                return _this;
            }
            return BaseCount;
        }(Business.BaseSelect));
        Business.BaseCount = BaseCount;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count = (function (_super) {
            __extends(Count, _super);
            function Count(query, onSuccess, onError) {
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
                            JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
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
                        JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.From });
                    }
                    else {
                        console.warn(ex);
                    }
                }
                return _this;
            }
            return Count;
        }(Business.BaseCount));
        Business.Count = Count;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var WebWorker;
    (function (WebWorker) {
        var Main = (function () {
            function Main() {
                this.getWorkerUrl = function (onSuccess, onFail) {
                    var That = this;
                    new JsStore.Business.AjaxHelper().sendRequest({
                        Url: this.getScriptUrl(),
                        Type: JsStore.Business.AjaxReqType.Get,
                        OnError: function (response, status) {
                            if (status != 0) {
                                console.error('unable to load JsStore, error code:' + status + " response is : " + response);
                            }
                            onFail();
                        },
                        OnSuccess: function (response) {
                            if (response.length > 0) {
                                var Url = That.convertStringIntoWorker(response + That.getWorkerEventsinString());
                                onSuccess(Url);
                            }
                            else {
                                onFail();
                            }
                        },
                        PostData: null,
                        ContentType: null
                    });
                };
                this.getWorkerEventsinString = function () {
                    var WorkerEventsInString = "\n;self.onmessage = function (e) {\n                    console.log(\"WebWorker:\"+e.data.Name);\n                var Request = e.data, IndexDbObject = new JsStore.Business.Main();\n                IndexDbObject.checkConnectionAndExecuteLogic(Request);\n                };";
                    return WorkerEventsInString;
                };
                this.convertStringIntoWorker = function (string) {
                    var BlobStorage = new Blob([string], {
                        type: "text/javascript"
                    }), Url = window.URL.createObjectURL(BlobStorage);
                    return Url;
                };
            }
            Main.prototype.getScriptUrl = function (fileName) {
                var ScriptUrl = "";
                var FileName = fileName ? fileName.toLowerCase() : "jsstorage";
                var Scripts = document.getElementsByTagName('script');
                for (var i = Scripts.length - 1; i >= 0; i--) {
                    ScriptUrl = Scripts[i].src.toLowerCase();
                    if (ScriptUrl.length > 0 && ScriptUrl.indexOf(FileName) >= 0) {
                        console.log(ScriptUrl);
                        break;
                    }
                }
                return ScriptUrl;
            };
            return Main;
        }());
        WebWorker.Main = Main;
    })(WebWorker = JsStore.WebWorker || (JsStore.WebWorker = {}));
})(JsStore || (JsStore = {}));
var KeyStore;
(function (KeyStore) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_connected";
    })(ConnectionStatus = KeyStore.ConnectionStatus || (KeyStore.ConnectionStatus = {}));
    KeyStore.RequestQueue = [], KeyStore.TableName = "LocalStore", KeyStore.IsCodeExecuting = false;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.prcoessExecutionOfCode = function (request) {
        KeyStore.RequestQueue.push(request);
        if (KeyStore.RequestQueue.length == 1) {
            KeyStore.executeCode();
        }
    };
    KeyStore.executeCode = function () {
        if (!KeyStore.IsCodeExecuting && KeyStore.RequestQueue.length > 0) {
            KeyStore.IsCodeExecuting = true;
            var Request = {
                Name: KeyStore.RequestQueue[0].Name,
                Query: KeyStore.RequestQueue[0].Query
            };
            KeyStore.executeCodeDirect(Request);
        }
    };
    KeyStore.executeCodeDirect = function (request) {
        var That = this;
        new KeyStore.Business.Main(function (results) {
            That.processFinishedRequest(results);
        }).checkConnectionAndExecuteLogic(request);
    };
    KeyStore.processFinishedRequest = function (message) {
        var FinishedRequest = KeyStore.RequestQueue.shift();
        KeyStore.IsCodeExecuting = false;
        if (message.ErrorOccured) {
            if (FinishedRequest.OnError) {
                FinishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (FinishedRequest.OnSuccess) {
                if (message.ReturnedValue != null) {
                    FinishedRequest.OnSuccess(message.ReturnedValue);
                }
                else {
                    FinishedRequest.OnSuccess();
                }
            }
        }
        this.executeCode();
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.setDbType = function () {
            self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else if (!self.alert) {
                console.log('worked failed');
                self.postMessage('message:WorkerFailed');
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return Utils;
    }());
    KeyStore.Utils = Utils;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Base = (function () {
            function Base() {
                this.Results = null;
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.onErrorOccured = function (e) {
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError(e.target.error);
                        }
                    }
                    console.error(e);
                };
            }
            return Base;
        }());
        Business.Base = Base;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Get = (function (_super) {
            __extends(Get, _super);
            function Get(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.get = function () {
                    var That = this, getData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        };
                    };
                    for (var column in this.Query.Where) {
                        getData(column, this.Query.Where[column]);
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.Transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(That.Results);
                    }
                };
                _this.get();
                return _this;
            }
            return Get;
        }(Business.Base));
        Business.Get = Get;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Set = (function (_super) {
            __extends(Set, _super);
            function Set(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.setData = function (value) {
                    var That = this, updateIfExistElseInsert = function () {
                        var CursorOpenRequest = That.ObjectStore.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.value['Value'] = value['Value'];
                                Cursor.update(Cursor.value);
                            }
                            else {
                                insertData();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    }, insertData = function () {
                        var AddResult = That.ObjectStore.add(value);
                        AddResult.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    updateIfExistElseInsert();
                };
                try {
                    var That = _this;
                    _this.OnError = onError;
                    _this.Transaction = Business.DbConnection.transaction([query.TableName], "readwrite");
                    _this.ObjectStore = _this.Transaction.objectStore(query.TableName);
                    _this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    _this.setData(query.Set);
                }
                catch (ex) {
                    console.error(ex);
                }
                return _this;
            }
            return Set;
        }(Business.Base));
        Business.Set = Set;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Remove = (function (_super) {
            __extends(Remove, _super);
            function Remove(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.RowAffected = 0;
                _this.remove = function () {
                    var That = this, removeData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                    };
                    for (var Column in this.Query.Where) {
                        if (!That.ErrorOccured) {
                            removeData(Column, That.Query.Where[Column]);
                        }
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
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
                _this.remove();
                return _this;
            }
            return Remove;
        }(Business.Base));
        Business.Remove = Remove;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var InitDb = (function () {
            function InitDb(dbName, tableName, onSuccess, onError) {
                var That = this, DbRequest = self.indexedDB.open(dbName, 1);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    Business.Status.ConStatus = KeyStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close();
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        Business.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result, Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                };
            }
            return InitDb;
        }());
        Business.InitDb = InitDb;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        Business.Status = {
            ConStatus: KeyStore.ConnectionStatus.NotStarted,
            LastError: ""
        };
        var Main = (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    if (request.Name == 'create_db' || request.Name == 'open_db') {
                        this.executeLogic(request);
                    }
                    else {
                        if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
                            this.executeLogic(request);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
                            var That = this;
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.createDb(KeyStore.TableName);
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                    }
                };
                this.returnResult = function (result) {
                    if (this.OnSuccess) {
                        this.OnSuccess(result);
                    }
                };
                this.executeLogic = function (request) {
                    var That = this, OnSuccess = function (results) {
                        That.returnResult({
                            ReturnedValue: results
                        });
                    }, OnError = function (err) {
                        That.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'get':
                            this.get(request.Query, OnSuccess, OnError);
                            break;
                        case 'set':
                            this.set(request.Query, OnSuccess, OnError);
                            break;
                        case 'remove':
                            this.remove(request.Query, OnSuccess, OnError);
                            break;
                        case 'create_db':
                            this.createDb(request.Query, OnSuccess, OnError);
                            break;
                    }
                };
                this.set = function (query, onSuccess, onError) {
                    var ObjInsert = new Business.Set(query, onSuccess, onError);
                };
                this.remove = function (query, onSuccess, onError) {
                    var ObjDelete = new Business.Remove(query, onSuccess, onError);
                };
                this.get = function (query, onSuccess, onError) {
                    new Business.Get(query, onSuccess, onError);
                };
                this.createDb = function (tableName, onSuccess, onError) {
                    var DbName = "KeyStore";
                    new Business.InitDb(DbName, tableName, onSuccess, onError);
                };
                this.OnSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.init = function () {
        KeyStore.Utils.setDbType();
        if (indexedDB) {
            KeyStore.prcoessExecutionOfCode({
                Name: 'create_db',
                Query: KeyStore.TableName
            });
        }
    };
    KeyStore.get = function (key, onSuccess, onError) {
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'get',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
    KeyStore.set = function (key, value, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            TableName: this.TableName,
            Set: {
                Key: key,
                Value: value
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'set',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
    KeyStore.remove = function (key, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'remove',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
})(KeyStore || (KeyStore = {}));
KeyStore.init();
//# sourceMappingURL=JsStorage.js.map