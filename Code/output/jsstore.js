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
/**
 * @license :JsStore.js - v1.3.2 - 15/12/2017
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */ 
var KeyStore;
(function (KeyStore) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf UtilityLogic
         */
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
                JsStore.status = {
                    ConStatus: JsStore.ConnectionStatus.UnableToStart,
                    LastError: JsStore.ErrorType.IndexedDbUndefined
                };
            }
        };
        return Utils;
    }());
    KeyStore.Utils = Utils;
})(KeyStore || (KeyStore = {}));
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
    var Business;
    (function (Business) {
        var Base = /** @class */ (function () {
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
        var Get = /** @class */ (function (_super) {
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
        var Set = /** @class */ (function (_super) {
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
        var Remove = /** @class */ (function (_super) {
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
        var InitDb = /** @class */ (function () {
            function InitDb(dbName, tableName, onSuccess, onError) {
                var That = this, DbRequest = self.indexedDB.open(dbName, 1);
                DbRequest.onerror = function (event) {
                    if (event.target.error.name == 'InvalidStateError') {
                        JsStore.status = {
                            ConStatus: JsStore.ConnectionStatus.UnableToStart,
                            LastError: JsStore.ErrorType.IndexedDbBlocked,
                        };
                    }
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
                            e.target.close(); // Manually close our connection to the db
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
        var Main = /** @class */ (function () {
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
                            }, 100);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.createDb(KeyStore.TableName, function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 100);
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
    /**
     * Initialize KeyStore
     *
     */
    KeyStore.init = function () {
        KeyStore.Utils.setDbType();
        if (indexedDB) {
            KeyStore.prcoessExecutionOfCode({
                Name: 'create_db',
                Query: KeyStore.TableName
            });
        }
    };
    /**
    * return the value by key
    *
    * @param {string} key
    * @param {Function} onSuccess
    * @param {Function} [onError=null]
    */
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
    /**
    * insert or update value
    *
    * @param {any} key
    * @param {any} value
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
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
    /**
    * delete value
    *
    * @param {string} key
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
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
var JsStore;
(function (JsStore) {
    var ErrorType;
    (function (ErrorType) {
        ErrorType["UndefinedColumn"] = "undefined_column";
        ErrorType["UndefinedValue"] = "undefined_value";
        ErrorType["UndefinedColumnName"] = "undefined_column_name";
        ErrorType["UndefinedColumnValue"] = "undefined_column_value";
        ErrorType["NotArray"] = "not_array";
        ErrorType["NoValueSupplied"] = "no_value_supplied";
        ErrorType["ColumnNotExist"] = "column_not_exist";
        ErrorType["InvalidOp"] = "invalid_operator";
        ErrorType["NullValue"] = "null_value";
        ErrorType["BadDataType"] = "bad_data_type";
        ErrorType["NextJoinNotExist"] = "next_join_not_exist";
        ErrorType["TableNotExist"] = "table_not_exist";
        ErrorType["DbNotExist"] = "db_not_exist";
        ErrorType["IndexedDbUndefined"] = "indexeddb_undefined";
        ErrorType["IndexedDbBlocked"] = "indexeddb_blocked";
    })(ErrorType = JsStore.ErrorType || (JsStore.ErrorType = {}));
    var Occurence;
    (function (Occurence) {
        Occurence["First"] = "f";
        Occurence["Last"] = "l";
        Occurence["Any"] = "a";
    })(Occurence = JsStore.Occurence || (JsStore.Occurence = {}));
    ;
    var WebWorkerStatus;
    (function (WebWorkerStatus) {
        WebWorkerStatus["Registered"] = "registerd";
        WebWorkerStatus["Failed"] = "failed";
        WebWorkerStatus["NotStarted"] = "not_started";
    })(WebWorkerStatus = JsStore.WebWorkerStatus || (JsStore.WebWorkerStatus = {}));
    ;
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_started";
        ConnectionStatus["UnableToStart"] = "unable_to_start";
    })(ConnectionStatus = JsStore.ConnectionStatus || (JsStore.ConnectionStatus = {}));
    var WhereQryOption;
    (function (WhereQryOption) {
        WhereQryOption["In"] = "In";
        WhereQryOption["Like"] = "Like";
        WhereQryOption["Or"] = "Or";
    })(WhereQryOption = JsStore.WhereQryOption || (JsStore.WhereQryOption = {}));
    var DataType;
    (function (DataType) {
        DataType["String"] = "string";
        DataType["Object"] = "object";
        DataType["Array"] = "array";
    })(DataType = JsStore.DataType || (JsStore.DataType = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    JsStore.enable_log = false, JsStore.db_version = 0, JsStore.status = {
        ConStatus: JsStore.ConnectionStatus.NotStarted,
        LastError: ""
    }, JsStore.temp_results = [];
    JsStore.throwError = function (error) {
        throw error;
    };
    JsStore.getObjectFirstKey = function (value) {
        for (var key in value) {
            return key;
        }
        return null;
    };
    JsStore.log = function (msg) {
        if (JsStore.enable_log) {
            console.log(msg);
        }
    };
    JsStore.logError = function (msg) {
        if (JsStore.enable_log) {
            console.error(msg);
        }
    };
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.getError = function (errorType, errorDetail) {
            var Error = {
                Name: errorType,
                Message: ''
            };
            switch (errorType) {
                case JsStore.ErrorType.NotArray:
                    Error.Message = "Supplied value is not an array";
                    break;
                case JsStore.ErrorType.UndefinedColumn:
                    Error.Message = "Column is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedValue:
                    Error.Message = "Value is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedColumnName:
                    Error.Message = "Column name is undefined";
                    break;
                case JsStore.ErrorType.UndefinedColumnValue:
                    Error.Message = "Column value is undefined";
                    break;
                case JsStore.ErrorType.NoValueSupplied:
                    Error.Message = "No value supplied";
                    break;
                case JsStore.ErrorType.InvalidOp:
                    Error.Message = "Invalid Op Value '" + errorDetail['Op'] + "'";
                    break;
                case JsStore.ErrorType.ColumnNotExist:
                    Error.Message = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.NullValue:
                    Error.Message = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case JsStore.ErrorType.BadDataType:
                    Error.Message = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case JsStore.ErrorType.NextJoinNotExist:
                    Error.Message = "Next join details not supplied";
                    break;
                case JsStore.ErrorType.TableNotExist:
                    Error.Message = "Table '" + errorDetail['TableName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.DbNotExist:
                    Error.Message = "Database '" + errorDetail['DbName'] + "' does not exist";
                    break;
                default: console.error('the error type is not defined');
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
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf MainLogic
         */
        Utils.setDbType = function () {
            self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else {
                JsStore.throwError('Your browser doesnot support IndexedDb');
            }
        };
        return Utils;
    }());
    JsStore.Utils = Utils;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    /**
     * checks whether db exist or not
     *
     * @param {DbInfo} dbInfo
     * @param {() => void} [callback=null]
     * @param {() => void} [errCallBack=null]
     * @returns
     */
    var isDbExist = function (dbInfo, callback, errCallBack) {
        if (callback === void 0) { callback = null; }
        if (errCallBack === void 0) { errCallBack = null; }
        var use_promise = callback ? false : true;
        if (JsStore.status.ConStatus !== JsStore.ConnectionStatus.UnableToStart) {
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    if (typeof dbInfo === 'string') {
                        getDbVersion(dbInfo, function (dbVersion) {
                            resolve(Boolean(dbVersion));
                        });
                    }
                    else {
                        getDbVersion(dbInfo.DbName, function (dbVersion) {
                            resolve(dbInfo.Table.Version <= dbVersion);
                        });
                    }
                });
            }
            else {
                if (typeof dbInfo === 'string') {
                    getDbVersion.call(this, dbInfo, function (dbVersion) {
                        callback.call(this, Boolean(dbVersion));
                    });
                }
                else {
                    getDbVersion.call(this, dbInfo.DbName, function (dbVersion) {
                        callback.call(this, dbInfo.Table.Version <= dbVersion);
                    });
                }
            }
        }
        else {
            var error = {
                Name: JsStore.status.LastError,
                Message: ''
            };
            switch (error.Name) {
                case JsStore.ErrorType.IndexedDbBlocked:
                    error.Message = "IndexedDB is blocked";
                    break;
                case JsStore.ErrorType.IndexedDbUndefined:
                    error.Message = "IndexedDB is not supported";
                    break;
            }
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    reject(error);
                });
            }
            else if (errCallBack) {
                errCallBack(error);
            }
        }
    };
    /**
     * get Db Version
     *
     * @param {string} dbName
     * @param {(version: number) => void} callback
     */
    var getDbVersion = function (dbName, callback) {
        var that = this;
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback.call(that, Number(dbVersion));
        });
    };
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @param {(any) => void} callback
     */
    var getDbSchema = function (dbName, callback) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                callback(result);
            });
        }
    };
    /**
     * check for null value
     *
     * @param {any} value
     * @returns
     */
    JsStore.isNull = function (value) {
        if (value == null) {
            return true;
        }
        else {
            switch (typeof value) {
                case 'string': return value.length === 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    };
    /**
     * Enable log
     *
     */
    var enableLog = function () {
        JsStore.enable_log = true;
        if (JsStore.worker_instance) {
            JsStore.worker_instance.postMessage({
                Name: 'change_log_status',
                Query: {
                    logging: JsStore.enable_log
                }
            });
        }
    };
    /**
     * disable log
     *
     */
    var disableLog = function () {
        JsStore.enable_log = false;
        if (JsStore.worker_instance) {
            JsStore.worker_instance.postMessage({
                Name: 'change_log_status',
                Query: {
                    logging: JsStore.enable_log
                }
            });
        }
    };
})(JsStore || (JsStore = {}));
// namespace JsStore {
//     export enum Errors {
//         JsStoreUndefined = "Jstore_undefined",
//         UndefinedCon = "undefined_connection",
//         Undefined = "undefined"
//     }
//     export interface IError {
//         _type: Errors;
//         _message: string;
//     }
//     export class Error implements IError {
//         _type: Errors;
//         _message: string;
//         _info: any;
//         constructor(type: Errors, info: any = null) {
//             this._type = type;
//             this._info = info;
//         }
//         public throw = function () {
//             throw this.get();
//         };
//         print = function (isWarn: boolean = false) {
//             var error_obj = this.get();
//             if (isWarn) {
//                 console.warn(error_obj);
//             }
//             else {
//                 console.error(error_obj);
//             }
//         };
//         private get = function () {
//             var error_obj = {
//                 _type: this._type,
//             } as IError;
//             switch (this._type) {
//                 case Errors.UndefinedCon:
//                     error_obj._message = "jsstore connection is not defined";
//                     break;
//                 case Errors.JsStoreUndefined:
//                     error_obj._message = "jsstore is not defined";
//                     break;
//                 default:
//                     error_obj._message = this._message;
//                     break;
//             }
//             return error_obj;
//         };
//     }
// } 
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var Column = /** @class */ (function () {
            function Column(key, tableName) {
                if (key.Name != null) {
                    this._name = key.Name;
                }
                else {
                    JsStore.throwError("Column Name is not defined for table:" + tableName);
                }
                this._autoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this._primaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this._unique = key.Unique != null ? key.Unique : false;
                this._notNull = key.NotNull != null ? key.NotNull : false;
                this._dataType = key.DataType != null ? key.DataType : (key.AutoIncrement ? 'number' : null);
                this._default = key.Default;
                this._multiEntry = key.MultiEntry;
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
        var Table = /** @class */ (function () {
            function Table(table, dbName) {
                // internal Members
                this._requireDelete = false;
                this._requireCreation = false;
                this._primaryKey = "";
                this._name = table.Name;
                this._version = table.Version == null ? 1 : table.Version;
                table.Columns.forEach(function (item) {
                    this.Columns.push(new Model.Column(item, table.Name));
                }, this);
                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey(dbName);
            }
            Table.prototype.setPrimaryKey = function (dbName) {
                this._columns.forEach(function (item) {
                    this._primaryKey = item._primaryKey ? item._name : "";
                }, this);
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var that = this;
                KeyStore.get("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        that._requireCreation = true;
                    }
                    else if (tableVersion < that._version) {
                        that._requireDelete = true;
                    }
                });
            };
            Table.prototype.setDbVersion = function (dbName) {
                JsStore.db_version = JsStore.db_version > this._version ? JsStore.db_version : this._version;
                // setting db version
                KeyStore.set('JsStore_' + dbName + '_Db_Version', JsStore.db_version)
                    .set("JsStore_" + dbName + "_" + this._name + "_Version", JsStore.db_version);
                this._version = JsStore.db_version;
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
        var DataBase = /** @class */ (function () {
            function DataBase(dataBase) {
                this._tables = [];
                this._name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    this._tables.push(new Model.Table(item, this.Name));
                }, this);
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
        var BaseHelper = /** @class */ (function () {
            function BaseHelper() {
                this.getTable = function (tableName) {
                    var current_table;
                    Business.active_db._tables.every(function (table) {
                        if (table._name === tableName) {
                            current_table = table;
                            return false;
                        }
                        return true;
                    });
                    return current_table;
                };
                this.getKeyRange = function (value, op) {
                    var key_range;
                    switch (op) {
                        case '-':
                            key_range = IDBKeyRange.bound(value.Low, value.High, false, false);
                            break;
                        case '>':
                            key_range = IDBKeyRange.lowerBound(value, true);
                            break;
                        case '>=':
                            key_range = IDBKeyRange.lowerBound(value);
                            break;
                        case '<':
                            key_range = IDBKeyRange.upperBound(value, true);
                            break;
                        case '<=':
                            key_range = IDBKeyRange.upperBound(value);
                            break;
                        default:
                            key_range = IDBKeyRange.only(value);
                            break;
                    }
                    return key_range;
                };
                this.getObjectSecondKey = function (value) {
                    var is_second = false;
                    for (var key in value) {
                        if (is_second) {
                            return key;
                        }
                        else {
                            is_second = true;
                        }
                    }
                };
                this.getPrimaryKey = function (tableName) {
                    var PrimaryKey = this.getTable(tableName).PrimaryKey;
                    return PrimaryKey ? PrimaryKey : this.getKeyPath();
                };
                this.getKeyPath = function (tableName) {
                    var transaction = Business.db_connection.transaction([tableName], "readonly"), object_store = transaction.objectStore(tableName);
                    return object_store.keyPath;
                };
                this.sortNumberInAsc = function (values) {
                    values.sort(function (a, b) {
                        return a - b;
                    });
                    return values;
                };
                this.sortNumberInDesc = function (values) {
                    values.sort(function (a, b) {
                        return b - a;
                    });
                    return values;
                };
                this.sortAlphabetInAsc = function (values) {
                    values.sort(function (a, b) {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });
                    return values;
                };
                this.sortAlphabetInDesc = function (values) {
                    values.sort(function (a, b) {
                        return b.toLowerCase().localeCompare(a.toLowerCase());
                    });
                    return values;
                };
            }
            BaseHelper.prototype.getAllCombinationOfWord = function (word, isArray) {
                if (isArray) {
                    var results = [];
                    for (var i = 0, length = word.length; i < length; i++) {
                        results = results.concat(this.getCombination(word[i]));
                    }
                    return results;
                }
                else {
                    return this.getCombination(word);
                }
            };
            BaseHelper.prototype.getCombination = function (word) {
                var results = [], doAndPushCombination = function (subWord, chars, index) {
                    if (index === subWord.length) {
                        results.push(chars.join(""));
                    }
                    else {
                        var ch = subWord.charAt(index);
                        chars[index] = ch.toLowerCase();
                        doAndPushCombination(subWord, chars, index + 1);
                        chars[index] = ch.toUpperCase();
                        doAndPushCombination(subWord, chars, index + 1);
                    }
                };
                doAndPushCombination(word, [], 0);
                return results;
            };
            return BaseHelper;
        }());
        Business.BaseHelper = BaseHelper;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Base = /** @class */ (function (_super) {
            __extends(Base, _super);
            function Base() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.ErrorOccured = false;
                _this.ErrorCount = 0;
                _this.RowAffected = 0;
                _this.SendResultFlag = true;
                _this.onErrorOccured = function (e, customError) {
                    if (customError === void 0) { customError = false; }
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            if (!customError) {
                                var Error = {
                                    Name: e.target.error.name,
                                    Message: e.target.error.message
                                };
                                this.OnError(Error);
                            }
                            else {
                                this.OnError(e);
                            }
                            JsStore.logError(Error);
                        }
                    }
                };
                _this.onTransactionTimeout = function (e) {
                    console.log('transaction timed out');
                };
                _this.onExceptionOccured = function (ex, info) {
                    switch (ex.name) {
                        case 'NotFoundError':
                            var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, info);
                            JsStore.throwError(Error);
                        default: console.error(ex);
                    }
                };
                _this.goToWhereLogic = function () {
                    var Column = JsStore.getObjectFirstKey(this.Query.Where);
                    if (this.Query.IgnoreCase === true) {
                        this.Query.Where = this.makeQryInCaseSensitive(this.Query.Where);
                    }
                    if (this.ObjectStore.indexNames.contains(Column)) {
                        var Value = this.Query.Where[Column];
                        if (typeof Value == 'object') {
                            this.CheckFlag = Boolean(Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1);
                            var Key = JsStore.getObjectFirstKey(Value);
                            switch (Key) {
                                case 'Like':
                                    {
                                        var FilterValue = Value.Like.split('%');
                                        if (FilterValue[1]) {
                                            if (FilterValue.length > 2) {
                                                this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Any);
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Last);
                                            }
                                        }
                                        else {
                                            this.executeLikeLogic(Column, FilterValue[0], JsStore.Occurence.First);
                                        }
                                    }
                                    ;
                                    break;
                                case 'In':
                                    this.executeInLogic(Column, Value['In']);
                                    break;
                                case '-':
                                case '>':
                                case '<':
                                case '>=':
                                case '<=':
                                    this.executeWhereLogic(Column, Value, Key);
                                    break;
                                case 'Aggregate': break;
                                default: this.executeWhereLogic(Column, Value);
                            }
                        }
                        else {
                            this.CheckFlag = Boolean(Object.keys(this.Query.Where).length > 1);
                            this.executeWhereLogic(Column, Value);
                        }
                    }
                    else {
                        this.ErrorOccured = true;
                        this.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, { ColumnName: Column });
                        JsStore.throwError(this.Error);
                    }
                };
                _this.makeQryInCaseSensitive = function (qry) {
                    var Results = [], ColumnValue, KeyValue;
                    for (var column in qry) {
                        ColumnValue = qry[column];
                        if (typeof ColumnValue == 'object') {
                            for (var key in ColumnValue) {
                                KeyValue = ColumnValue[key];
                                switch (key) {
                                    case JsStore.WhereQryOption.In:
                                        Results = Results.concat(this.getAllCombinationOfWord(KeyValue, true));
                                        break;
                                    case JsStore.WhereQryOption.Like:
                                        break;
                                    default:
                                        Results = Results.concat(this.getAllCombinationOfWord(KeyValue));
                                }
                            }
                            qry[column]['In'] = Results;
                        }
                        else {
                            Results = Results.concat(this.getAllCombinationOfWord(ColumnValue));
                            qry[column] = {
                                In: Results
                            };
                        }
                    }
                    return qry;
                };
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
            Base.prototype.checkForWhereConditionMatch = function (rowValue) {
                var Where = this.Query.Where, Status = true;
                var checkIn = function (column, value) {
                    var Values = Where[column].In;
                    for (var i = 0, length = Values.length; i < length; i++) {
                        if (Values[i] == value) {
                            Status = true;
                            break;
                        }
                        else {
                            Status = false;
                        }
                    }
                    ;
                }, checkLike = function (column, value) {
                    var Values = Where[column].Like.split('%'), CompSymbol, CompValue, SymbolIndex;
                    if (Values[1]) {
                        CompValue = Values[1];
                        CompSymbol = Values.length > 2 ? JsStore.Occurence.Any : JsStore.Occurence.Last;
                    }
                    else {
                        CompValue = Values[0];
                        CompSymbol = JsStore.Occurence.First;
                    }
                    value = value.toLowerCase();
                    switch (CompSymbol) {
                        case JsStore.Occurence.Any:
                            SymbolIndex = value.indexOf(CompValue.toLowerCase());
                            if (SymbolIndex < 0) {
                                Status = false;
                            }
                            ;
                            break;
                        case JsStore.Occurence.First:
                            SymbolIndex = value.indexOf(CompValue.toLowerCase());
                            if (SymbolIndex > 0 || SymbolIndex < 0) {
                                Status = false;
                            }
                            ;
                            break;
                        default:
                            SymbolIndex = value.lastIndexOf(CompValue.toLowerCase());
                            if (SymbolIndex < value.length - CompValue.length) {
                                Status = false;
                            }
                            ;
                    }
                }, checkComparisionOp = function (column, value, symbol) {
                    var CompareValue = Where[column][symbol];
                    switch (symbol) {
                        //greater than
                        case '>':
                            if (value <= CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //less than
                        case '<':
                            if (value >= CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //less than equal
                        case '<=':
                            if (value > CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //greather than equal
                        case '>=':
                            if (value < CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //between
                        case '-':
                            if (value < CompareValue.Low || value > CompareValue.High) {
                                Status = false;
                            }
                            ;
                            break;
                    }
                };
                for (var Column in Where) {
                    var ColumnValue = Where[Column];
                    if (Status) {
                        if (typeof ColumnValue == 'object') {
                            for (var key in ColumnValue) {
                                if (Status) {
                                    switch (key) {
                                        case 'In':
                                            checkIn(Column, rowValue[Column]);
                                            break;
                                        case 'Like':
                                            checkLike(Column, rowValue[Column]);
                                            break;
                                        case '-':
                                        case '>':
                                        case '<':
                                        case '>=':
                                        case '<=':
                                            checkComparisionOp(Column, rowValue[Column], key);
                                            break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        else {
                            var CompareValue = rowValue[Column];
                            if (ColumnValue != CompareValue) {
                                Status = false;
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                return Status;
            };
            return Base;
        }(Business.BaseHelper));
        Business.Base = Base;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var CreateDb = /** @class */ (function () {
            function CreateDb(dbVersion, onSuccess, onError) {
                var that = this, table_created_list = [], db_request = indexedDB.open(Business.active_db._name, dbVersion);
                db_request.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                db_request.onsuccess = function (event) {
                    JsStore.status.ConStatus = JsStore.ConnectionStatus.Connected;
                    Business.db_connection = db_request.result;
                    Business.db_connection.onclose = function () {
                        JsStore.status.ConStatus = JsStore.ConnectionStatus.Closed;
                        JsStore.status.LastError = "Connection Closed";
                    };
                    Business.db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                        }
                    };
                    Business.db_connection.onerror = function (e) {
                        JsStore.status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.db_connection.onabort = function (e) {
                        JsStore.status.ConStatus = JsStore.ConnectionStatus.Closed;
                        JsStore.status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess(table_created_list);
                    }
                    // save dbSchema in keystore
                    KeyStore.set("JsStore_" + Business.active_db._name + "_Schema", Business.active_db);
                };
                db_request.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    Business.active_db._tables.forEach(function (item) {
                        if (item._requireDelete) {
                            // Delete the old datastore.    
                            if (db.objectStoreNames.contains(item._name)) {
                                db.deleteObjectStore(item._name);
                            }
                            createObjectStore(db, item);
                        }
                        else if (item._requireDelete) {
                            createObjectStore(db, item);
                        }
                    });
                };
                var createObjectStore = function (db_connection, item) {
                    try {
                        if (item._primaryKey.length > 0) {
                            var store = db_connection.createObjectStore(item._name, {
                                keyPath: item._primaryKey
                            });
                            item._columns.forEach(function (column) {
                                var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                if (column._multiEntry) {
                                    options['multiEntry'] = true;
                                }
                                store.createIndex(column._name, column._name, options);
                                if (column._autoIncrement) {
                                    KeyStore.set("JsStore_" + Business.active_db._name + "_" + item._name + "_" + column._name + "_Value", 0);
                                }
                            });
                        }
                        else {
                            var store = db_connection.createObjectStore(item._name, {
                                autoIncrement: true
                            });
                            item._columns.forEach(function (column) {
                                store.createIndex(column._name, column._name, { unique: column._unique });
                                if (column._autoIncrement) {
                                    KeyStore.set("JsStore_" + Business.active_db._name + "_" + item._name + "_" + column._name + "_Value", 0);
                                }
                            });
                        }
                        table_created_list.push(item._name);
                        // setting the table version
                        KeyStore.set("JsStore_" + Business.active_db._name + "_" + item._name + "_Version", item._version);
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
        var DropDb = /** @class */ (function () {
            function DropDb(name, onSuccess, onError) {
                this.deleteDb = function (name, onSuccess, onError) {
                    var DbDropRequest = indexedDB.deleteDatabase(name);
                    DbDropRequest.onblocked = function () {
                        if (onError != null) {
                            onError("database is blocked, cant be deleted right now.");
                        }
                    };
                    DbDropRequest.onerror = function (e) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbDropRequest.onsuccess = function () {
                        JsStore.status.ConStatus = JsStore.ConnectionStatus.Closed;
                        KeyStore.remove('JsStore_' + Business.active_db._name + '_Db_Version');
                        Business.active_db._tables.forEach(function (table) {
                            KeyStore.remove("JsStore_" + Business.active_db._name + "_" + table._name + "_Version");
                            table._columns.forEach(function (column) {
                                if (column._autoIncrement) {
                                    KeyStore.remove("JsStore_" + Business.active_db._name + "_" + table._name + "_" + column._name + "_Value");
                                }
                            });
                        });
                        KeyStore.remove("JsStore_" + Business.active_db._name + "_Schema");
                        onSuccess();
                    };
                };
                var That = this;
                Business.db_connection.close();
                setTimeout(function () {
                    That.deleteDb(name, onSuccess, onError);
                }, 100);
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
        var InsertHelper = /** @class */ (function (_super) {
            __extends(InsertHelper, _super);
            function InsertHelper() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.ValuesAffected = [];
                _this.onTransactionCompleted = function () {
                    this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
                };
                _this.checkModifyInsertValues = function (table, values) {
                    var That = this, ValueIndex = 0, Value, TableName = table.Name, checkDatas = function () {
                        Value = values[ValueIndex++];
                        checkInternal();
                    }, checkInternal = function () {
                        if (Value) {
                            checkAndModifyValue();
                        }
                        else {
                            That.insertData(values);
                        }
                    }, checkAndModifyValue = function () {
                        var Index = 0, checkAndModifyColumn = function (column) {
                            if (column) {
                                var onValidationError = function (error, details) {
                                    That.ErrorOccured = true;
                                    That.Error = JsStore.Utils.getError(error, details);
                                }, CheckNotNullAndDataType = function () {
                                    //check not null schema
                                    if (column.NotNull && JsStore.isNull(Value[column.Name])) {
                                        onValidationError(JsStore.ErrorType.NullValue, { ColumnName: column.Name });
                                    }
                                    else if (column.DataType && typeof Value[column.Name] != column.DataType) {
                                        onValidationError(JsStore.ErrorType.BadDataType, { ColumnName: column.Name });
                                    }
                                    checkAndModifyColumn(table.Columns[Index++]);
                                };
                                if (!That.ErrorOccured) {
                                    //check auto increment scheme
                                    if (column.AutoIncrement) {
                                        KeyStore.get("JsStore_" + Business.active_db._name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue) {
                                            Value[column.Name] = ++columnValue;
                                            KeyStore.set("JsStore_" + Business.active_db._name + "_" + TableName + "_" + column.Name + "_Value", columnValue);
                                            CheckNotNullAndDataType();
                                        });
                                    }
                                    else if (column.Default && Value[column.Name] == null) {
                                        Value[column.Name] = column.Default;
                                        CheckNotNullAndDataType();
                                    }
                                    else {
                                        CheckNotNullAndDataType();
                                    }
                                }
                                else {
                                    That.onErrorOccured(That.Error, true);
                                }
                            }
                            else {
                                checkDatas();
                            }
                        };
                        checkAndModifyColumn(table.Columns[Index++]);
                    };
                    checkDatas();
                };
                return _this;
            }
            return InsertHelper;
        }(Business.Base));
        Business.InsertHelper = InsertHelper;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert = /** @class */ (function (_super) {
            __extends(Insert, _super);
            function Insert(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.insertData = function (values) {
                    var That = this, ValueIndex = 0, IsReturn = this.Query.Return, insertDataintoTable;
                    if (IsReturn) {
                        insertDataintoTable = function (value) {
                            if (value) {
                                var AddResult = object_store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorOccured(e);
                                };
                                AddResult.onsuccess = function (e) {
                                    That.ValuesAffected.push(value);
                                    insertDataintoTable(values[ValueIndex++]);
                                };
                            }
                        };
                    }
                    else {
                        insertDataintoTable = function (value) {
                            if (value) {
                                var AddResult = object_store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorOccured(e);
                                };
                                AddResult.onsuccess = function (e) {
                                    ++That.RowAffected;
                                    insertDataintoTable(values[ValueIndex++]);
                                };
                            }
                        };
                    }
                    That.Transaction = Business.db_connection.transaction([That.Query.Into], "readwrite");
                    var object_store = That.Transaction.objectStore(That.Query.Into);
                    That.Transaction.oncomplete = function (e) {
                        That.onTransactionCompleted();
                    };
                    insertDataintoTable(values[ValueIndex++]);
                };
                try {
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var Table = _this.getTable(query.Into);
                    if (Table) {
                        if (_this.Query.SkipDataCheck) {
                            _this.insertData(_this.Query.Values);
                            //remove values
                            _this.Query.Values = undefined;
                        }
                        else {
                            _this.checkModifyInsertValues(Table, _this.Query.Values);
                            //remove values
                            _this.Query.Values = undefined;
                        }
                    }
                    else {
                        var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, { TableName: query.Into });
                        JsStore.throwError(Error);
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.Into });
                }
                return _this;
            }
            return Insert;
        }(Business.InsertHelper));
        Business.Insert = Insert;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var BulkInsert = /** @class */ (function (_super) {
            __extends(BulkInsert, _super);
            function BulkInsert(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.ValuesAffected = [];
                _this.ValuesIndex = 0;
                _this.onTransactionCompleted = function () {
                    this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
                };
                _this.bulkinsertData = function () {
                    var That = this;
                    this.Transaction = Business.db_connection.transaction([this.Query.Into], "readwrite");
                    this.ObjectStore = this.Transaction.objectStore(this.Query.Into);
                    this.Transaction.oncomplete = function (e) {
                        That.OnSuccess();
                    };
                    this.Query.Values.forEach(function (value) {
                        That.ObjectStore.add(value);
                    });
                };
                try {
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this;
                    _this.Table = _this.getTable(query.Into);
                    if (_this.Table) {
                        _this.bulkinsertData();
                    }
                    else {
                        var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, { TableName: query.Into });
                        JsStore.throwError(Error);
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.Into });
                }
                return _this;
            }
            return BulkInsert;
        }(Business.Base));
        Business.BulkInsert = BulkInsert;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var OpenDb = /** @class */ (function () {
            function OpenDb(dbVersion, onSuccess, onError) {
                if (Business.active_db._name.length > 0) {
                    var db_request = indexedDB.open(Business.active_db._name, dbVersion), that = this;
                    db_request.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    db_request.onsuccess = function (event) {
                        JsStore.status.ConStatus = JsStore.ConnectionStatus.Connected;
                        Business.db_connection = db_request.result;
                        Business.db_connection.onclose = function () {
                            JsStore.status.ConStatus = JsStore.ConnectionStatus.Closed;
                            JsStore.status.LastError = "Connection Closed, trying to reconnect";
                        };
                        Business.db_connection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                e.target.close(); // Manually close our connection to the db
                            }
                        };
                        Business.db_connection.onerror = function (e) {
                            JsStore.status.LastError = "Error occured in connection :" + e.target.result;
                        };
                        Business.db_connection.onabort = function (e) {
                            JsStore.status.ConStatus = JsStore.ConnectionStatus.Closed;
                            JsStore.status.LastError = "Connection Aborted";
                        };
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                }
                else {
                    var error = "Database name is not supplied.";
                    JsStore.throwError(error);
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
        var Clear = /** @class */ (function (_super) {
            __extends(Clear, _super);
            function Clear(tableName, onSuccess, onError) {
                var _this = _super.call(this) || this;
                var that = _this, object_store = Business.db_connection.transaction([tableName], "readwrite").objectStore(tableName), clear_request = object_store.clear();
                clear_request.onsuccess = function (e) {
                    var current_table = that.getTable(tableName);
                    current_table._columns.forEach(function (column) {
                        if (column._autoIncrement) {
                            KeyStore.set("JsStore_" + Business.active_db._name + "_" + tableName + "_" + column._name + "_Value", 0);
                        }
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                clear_request.onerror = function (e) {
                    if (onError != null) {
                        onError(e);
                    }
                };
                return _this;
            }
            return Clear;
        }(Business.Base));
        Business.Clear = Clear;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Main = /** @class */ (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    JsStore.log('checking connection and executing request:' + request.Name);
                    switch (request.Name) {
                        case 'create_db':
                        case 'open_db':
                            this.executeLogic(request);
                            break;
                        case 'change_log_status':
                            this.changeLogStatus(request);
                        default:
                            switch (JsStore.status.ConStatus) {
                                case JsStore.ConnectionStatus.Connected:
                                    {
                                        this.executeLogic(request);
                                    }
                                    break;
                                case JsStore.ConnectionStatus.Closed:
                                    {
                                        var that = this;
                                        this.openDb(Business.active_db._name, function () {
                                            that.checkConnectionAndExecuteLogic(request);
                                        });
                                    }
                                    break;
                            }
                    }
                };
                this.changeLogStatus = function (request) {
                    if (request.Query['logging'] === true) {
                        JsStore.enable_log = true;
                    }
                    else {
                        JsStore.enable_log = false;
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
                    var that = this, onSuccess = function (results) {
                        that.returnResult({
                            ReturnedValue: results
                        });
                    }, onError = function (err) {
                        that.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'select':
                            this.select(request.Query, onSuccess, onError);
                            break;
                        case 'insert':
                            this.insert(request.Query, onSuccess, onError);
                            break;
                        case 'update':
                            this.update(request.Query, onSuccess, onError);
                            break;
                        case 'delete':
                            this.delete(request.Query, onSuccess, onError);
                            break;
                        case 'open_db':
                            this.openDb(request.Query, onSuccess, onError);
                            break;
                        case 'create_db':
                            this.createDb(request.Query, onSuccess, onError);
                            break;
                        case 'clear':
                            this.clear(request.Query, onSuccess, onError);
                            break;
                        case 'drop_db':
                            this.dropDb(onSuccess, onError);
                            break;
                        case 'count':
                            this.count(request.Query, onSuccess, onError);
                            break;
                        case 'bulk_insert':
                            this.bulkInsert(request.Query, onSuccess, onError);
                            break;
                        case 'export_json':
                            this.exportJson(request.Query, onSuccess, onError);
                            break;
                        default: console.error('The Api:-' + request.Name + 'does not support');
                    }
                };
                this.openDb = function (dbName, onSuccess, onError) {
                    KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
                        if (dbVersion != null) {
                            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                                Business.active_db = result;
                                var open_db_object = new Business.OpenDb(dbVersion, onSuccess, onError);
                            });
                        }
                        else {
                            var error = JsStore.Utils.getError(JsStore.ErrorType.DbNotExist, { DbName: dbName });
                            throw error;
                        }
                    });
                };
                this.closeDb = function () {
                    if (JsStore.status.ConStatus === JsStore.ConnectionStatus.Connected) {
                        Business.db_connection.close();
                    }
                };
                this.dropDb = function (onSuccess, onError) {
                    var drop_db_object = new Business.DropDb(Business.active_db._name, onSuccess, onError);
                };
                this.update = function (query, onSuccess, onError) {
                    var update_db_object = new Business.Update.Instance(query, onSuccess, onError);
                };
                this.insert = function (query, onSuccess, onError) {
                    if (!Array.isArray(query.Values)) {
                        JsStore.throwError("Value should be array :- supplied value is not array");
                    }
                    else {
                        var insert_object = new Business.Insert(query, onSuccess, onError);
                    }
                };
                this.bulkInsert = function (query, onSuccess, onError) {
                    if (!Array.isArray(query.Values)) {
                        JsStore.throwError("Value should be array :- supplied value is not array");
                    }
                    else {
                        var bulk_insert_object = new Business.BulkInsert(query, onSuccess, onError);
                    }
                };
                this.delete = function (query, onSuccess, onError) {
                    var delete_object = new Business.Delete.Instance(query, onSuccess, onError);
                };
                this.select = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        var select_join_object = new Business.Select.Join(query, onSuccess, onError);
                    }
                    else {
                        var select_object = new Business.Select.Instance(query, onSuccess, onError);
                    }
                };
                this.count = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        query['Count'] = true;
                        var select_join_object = new Business.Select.Join(query, onSuccess, onError);
                    }
                    else {
                        var count_object = new Business.Count.Instance(query, onSuccess, onError);
                    }
                };
                this.createDb = function (dataBase, onSuccess, onError) {
                    var that = this;
                    KeyStore.get("JsStore_" + dataBase.Name + "_Db_Version", function (version) {
                        JsStore.db_version = version;
                        Business.active_db = new JsStore.Model.DataBase(dataBase);
                        var createDbInternal = function () {
                            setTimeout(function () {
                                var last_table = (Business.active_db._tables[Business.active_db._tables.length - 1]);
                                KeyStore.get("JsStore_" + Business.active_db._name + "_" + last_table._name + "_Version", function (tableVersion) {
                                    if (tableVersion === last_table._version) {
                                        var create_db_object = new Business.CreateDb(JsStore.db_version, onSuccess, onError);
                                    }
                                    else {
                                        createDbInternal();
                                    }
                                });
                            }, 200);
                        };
                        createDbInternal();
                    });
                };
                this.clear = function (tableName, onSuccess, onError) {
                    var clear_object = new Business.Clear(tableName, onSuccess, onError);
                };
                this.exportJson = function (query, onSuccess, onError) {
                    this.select(query, function (results) {
                        var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                            type: "text/json"
                        }));
                        onSuccess(url);
                    }, function (err) {
                        onError(err);
                    });
                };
                this._onSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var BaseSelect = /** @class */ (function (_super) {
                __extends(BaseSelect, _super);
                function BaseSelect() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Results = [];
                    _this.Sorted = false;
                    _this.CheckFlag = false;
                    _this.removeDuplicates = function () {
                        var Datas = this.Results;
                        // free results memory
                        this.Results = undefined;
                        var Key = this.getPrimaryKey(this.Query.From);
                        var lookupObject = {};
                        for (var i in Datas) {
                            lookupObject[Datas[i][Key]] = Datas[i];
                        }
                        // free datas memory
                        Datas = [];
                        for (i in lookupObject) {
                            Datas.push(lookupObject[i]);
                        }
                        this.Results = Datas;
                    };
                    return _this;
                }
                return BaseSelect;
            }(Business.Base));
            Select.BaseSelect = BaseSelect;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var NotWhere = /** @class */ (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var Cursor, That = this, CursorOpenRequest, executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeSkip = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeSimple = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            };
                        }, executeLimit = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor && That.Results.length != That.LimitRecord) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            };
                        };
                        if (this.Query.Order && this.Query.Order.By) {
                            if (That.ObjectStore.indexNames.contains(this.Query.Order.By)) {
                                var OrderType = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                                this.Sorted = true;
                                CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, OrderType);
                            }
                            else {
                                var Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, { ColumnName: this.Query.Order.By });
                                JsStore.throwError(Error);
                            }
                        }
                        else {
                            CursorOpenRequest = this.ObjectStore.openCursor();
                        }
                        if (this.SkipRecord && this.LimitRecord) {
                            executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            executeSkip();
                        }
                        else if (this.LimitRecord) {
                            executeLimit();
                        }
                        else {
                            executeSimple();
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Select.BaseSelect));
            Select.NotWhere = NotWhere;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var In = /** @class */ (function (_super) {
                __extends(In, _super);
                function In() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeSkipAndLimitForIn = function (column, values) {
                        var Cursor, Skip = this.SkipRecord, That = this, ColumnStore = this.ObjectStore.index(column), skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (That.Results.length != That.LimitRecord && Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                skipOrPush(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (That.Results.length != That.LimitRecord && Cursor) {
                                            skipOrPush(Cursor.value);
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                    };
                    _this.executeSkipForIn = function (column, values) {
                        var Cursor, Skip = this.SkipRecord, That = this, ColumnStore = this.ObjectStore.index(column), skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                skipOrPush((Cursor.value));
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            skipOrPush((Cursor.value));
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                    };
                    _this.executeLimitForIn = function (column, values) {
                        var Cursor, That = this, ColumnStore = this.ObjectStore.index(column);
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor && That.Results.length != That.LimitRecord) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor && That.Results.length != That.LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                    };
                    _this.executeSimpleForIn = function (column, values) {
                        var Cursor, That = this, ColumnStore = this.ObjectStore.index(column);
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    this.CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                    };
                                    this.CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                    };
                    _this.executeInLogic = function (column, values) {
                        if (this.SkipRecord && this.LimitRecord) {
                            this.executeSkipAndLimitForIn(column, values);
                        }
                        else if (this.SkipRecord) {
                            this.executeSkipForIn(column, values);
                        }
                        else if (this.LimitRecord) {
                            this.executeLimitForIn(column, values);
                        }
                        else {
                            this.executeSimpleForIn(column, values);
                        }
                    };
                    return _this;
                }
                return In;
            }(Select.NotWhere));
            Select.In = In;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Like = /** @class */ (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false;
                        value = value.toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeSkipAndLimit = function () {
                        var Cursor, Skip = this.SkipRecord, That = this, skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (That.Results.length != That.LimitRecord && Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        skipOrPush(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (That.Results.length != That.LimitRecord && Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        skipOrPush(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    _this.executeSkip = function () {
                        var Cursor, Skip = this.SkipRecord, That = this, skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        skipOrPush((Cursor.value));
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        skipOrPush((Cursor.value));
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    _this.executeLimit = function () {
                        var Cursor, That = this;
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (That.Results.length != That.LimitRecord && Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (That.Results.length != That.LimitRecord && Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    _this.executeSimple = function () {
                        var Cursor, That = this;
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompValueLength = this.CompValue.length;
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (this.SkipRecord && this.LimitRecord) {
                            this.executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            this.executeSkip();
                        }
                        else if (this.LimitRecord) {
                            this.executeLimit();
                        }
                        else {
                            this.executeSimple();
                        }
                    };
                    return _this;
                }
                return Like;
            }(Select.In));
            Select.Like = Like;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Where = /** @class */ (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereLogic = function (column, value, op) {
                        var That = this, CursorOpenRequest, Cursor, executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                };
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                };
                            }
                        }, executeSkip = function () {
                            var RecordSkipped = false;
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                };
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                };
                            }
                        }, executeLimit = function () {
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord && That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                };
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                };
                            }
                        }, executeSimple = function () {
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                };
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                };
                            }
                        };
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (this.SkipRecord && this.LimitRecord) {
                            executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            executeSkip();
                        }
                        else if (this.LimitRecord) {
                            executeLimit();
                        }
                        else {
                            executeSimple();
                        }
                    };
                    return _this;
                }
                return Where;
            }(Select.Like));
            Select.Where = Where;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Join = /** @class */ (function (_super) {
                __extends(Join, _super);
                function Join(query, onSuccess, onError) {
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
                        //get the data from query table
                        new Select.Instance({
                            From: query.Table,
                            Where: query.Where,
                            Order: query.Order
                        }, function (results) {
                            //perform join
                            results.forEach(function (value, index) {
                                //search item through each global result
                                for (var i = 0; i < ResultLength; i++) {
                                    Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                    //if (Item == value[query.Column]) {
                                    doJoin(Item, value, i);
                                    //}
                                }
                            });
                            That.Results = Results;
                            //check if further execution needed
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
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                ++JoinIndex;
                            }
                            else if (query.JoinType == 'left') {
                                //left join
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = null;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                //Results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                                ++JoinIndex;
                            }
                        };
                    };
                    _this.executeRightJoin = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length, ItemIndex = 0, Where = {}, onExecutionFinished = function () {
                            That.Results = Results;
                            //check if further execution needed
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
                            new Select.Instance({
                                From: query.Table,
                                Where: query.Where,
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
                            //check if further execution needed
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
                                    //copy other relative data into current result
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                    }
                                    ++JoinIndex;
                                });
                            }
                            else if (query.JoinType == 'left') {
                                //left join
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = null;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                }
                                //Results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                                ++JoinIndex;
                            }
                        }, executeLogic = function () {
                            if (ItemIndex < ResultLength) {
                                if (!That.ErrorOccured) {
                                    Where[query.Column] = TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column];
                                    new Select.Instance({
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
                    //get the data for first table
                    if (!_this.ErrorOccured) {
                        new Select.Instance({
                            From: _this.QueryStack[0].Table,
                            Where: _this.QueryStack[0].Where
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
                Join.prototype.startExecutionJoinLogic = function () {
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
                    else if (Query.Where) {
                        this.executeWhereJoinLogic(JoinQuery, Query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                    }
                };
                return Join;
            }(Select.BaseSelect));
            Select.Join = Join;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var GroupByHelper = /** @class */ (function (_super) {
                __extends(GroupByHelper, _super);
                function GroupByHelper() {
                    var _this = _super.call(this) || this;
                    _this.executeAggregateGroupBy = function () {
                        var GrpQry = this.Query.GroupBy, Datas = this.Results, LookUpObj = {};
                        //free results memory
                        this.Results = undefined;
                        //assign aggregate and free aggregate memory
                        var AggregateQry = this.Query.Aggregate;
                        this.Query.Aggregate = undefined;
                        var Index, ObjKey, Value, AggrColumn;
                        var calculateAggregate = function () {
                            for (var prop in AggregateQry) {
                                switch (prop) {
                                    case 'Count':
                                        var getCount = function () {
                                            Value = LookUpObj[ObjKey];
                                            //get old value
                                            Value = Value ? Value["Count(" + AggrColumn + ")"] : 0;
                                            //add with old value if data exist
                                            Value += Datas[Index][AggrColumn] ? 1 : 0;
                                            return Value;
                                        };
                                        if (typeof AggregateQry[prop] == 'string') {
                                            AggrColumn = AggregateQry[prop];
                                            Datas[Index]["Count(" + AggrColumn + ")"] = getCount();
                                        }
                                        else if (Array.isArray(AggregateQry[prop])) {
                                            for (var item in AggregateQry[prop]) {
                                                AggrColumn = AggregateQry[prop][item];
                                                Datas[Index]["Count(" + AggrColumn + ")"] = getCount();
                                            }
                                        }
                                        break;
                                    case 'Max':
                                        var getMax = function () {
                                            Value = LookUpObj[ObjKey];
                                            //get old value
                                            Value = Value ? Value["Max(" + AggrColumn + ")"] : 0;
                                            Datas[Index][AggrColumn] = Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                            //compare between old value and new value
                                            return Value > Datas[Index][AggrColumn] ? Value : Datas[Index][AggrColumn];
                                        };
                                        if (typeof AggregateQry[prop] == 'string') {
                                            AggrColumn = AggregateQry[prop];
                                            Datas[Index]["Max(" + AggrColumn + ")"] = getMax();
                                        }
                                        else if (Array.isArray(AggregateQry[prop])) {
                                            for (var item in AggregateQry[prop]) {
                                                AggrColumn = AggregateQry[prop][item];
                                                Datas[Index]["Max(" + AggrColumn + ")"] = getMax();
                                            }
                                        }
                                        break;
                                    case 'Min':
                                        var getMin = function () {
                                            Value = LookUpObj[ObjKey];
                                            //get old value
                                            Value = Value ? Value["Min(" + AggrColumn + ")"] : Infinity;
                                            Datas[Index][AggrColumn] = Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : Infinity;
                                            //compare between old value and new value
                                            return Value < Datas[Index][AggrColumn] ? Value : Datas[Index][AggrColumn];
                                        };
                                        if (typeof AggregateQry[prop] == 'string') {
                                            AggrColumn = AggregateQry[prop];
                                            Datas[Index]["Min(" + AggrColumn + ")"] = getMin();
                                        }
                                        else if (Array.isArray(AggregateQry[prop])) {
                                            for (var item in AggregateQry[prop]) {
                                                AggrColumn = AggregateQry[prop][item];
                                                Datas[Index]["Min(" + AggrColumn + ")"] = getMin();
                                            }
                                        }
                                        break;
                                    case 'Sum':
                                        var getSum = function () {
                                            Value = LookUpObj[ObjKey];
                                            //get old value
                                            Value = Value ? Value["Sum(" + AggrColumn + ")"] : 0;
                                            //add with old value if data exist
                                            Value += Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                            return Value;
                                        };
                                        if (typeof AggregateQry[prop] == 'string') {
                                            AggrColumn = AggregateQry[prop];
                                            Datas[Index]["Sum(" + AggrColumn + ")"] = getSum();
                                        }
                                        else if (Array.isArray(AggregateQry[prop])) {
                                            for (var item in AggregateQry[prop]) {
                                                AggrColumn = AggregateQry[prop][item];
                                                Datas[Index]["Sum(" + AggrColumn + ")"] = getSum();
                                            }
                                        }
                                        break;
                                    case 'Avg':
                                        var getAvg = function () {
                                            Value = LookUpObj[ObjKey];
                                            //get old sum value
                                            var Sum = Value ? Value["Sum(" + AggrColumn + ")"] : 0;
                                            //add with old value if data exist
                                            Sum += Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                            Datas[Index]["Sum(" + AggrColumn + ")"] = Sum;
                                            //get old count value
                                            Value = Value ? Value["Count(" + AggrColumn + ")"] : 0;
                                            //add with old value if data exist
                                            Value += Datas[Index][AggrColumn] ? 1 : 0;
                                            Datas[Index]["Count(" + AggrColumn + ")"] = Value;
                                        };
                                        if (typeof AggregateQry[prop] == 'string') {
                                            AggrColumn = AggregateQry[prop];
                                            getAvg();
                                        }
                                        else if (Array.isArray(AggregateQry[prop])) {
                                            for (var item in AggregateQry[prop]) {
                                                AggrColumn = AggregateQry[prop][item];
                                                getAvg();
                                            }
                                        }
                                        break;
                                }
                            }
                        };
                        if (typeof GrpQry == 'string') {
                            for (Index in Datas) {
                                ObjKey = Datas[Index][GrpQry];
                                calculateAggregate();
                                LookUpObj[ObjKey] = Datas[Index];
                            }
                        }
                        else {
                            for (Index in Datas) {
                                ObjKey = "";
                                for (var column in GrpQry) {
                                    ObjKey += Datas[Index][GrpQry[column]];
                                }
                                calculateAggregate();
                                LookUpObj[ObjKey] = Datas[Index];
                            }
                        }
                        //free datas memory
                        Datas = [];
                        for (var i in LookUpObj) {
                            Datas.push(LookUpObj[i]);
                        }
                        //Checking for avg and if exist then fill the datas;
                        if (AggregateQry.Avg) {
                            if (typeof AggregateQry.Avg == 'string') {
                                for (Index in Datas) {
                                    var Sum = Datas[Index]["Sum(" + AggregateQry.Avg + ")"], Count = Datas[Index]["Count(" + AggregateQry.Avg + ")"];
                                    Datas[Index]["Avg(" + AggregateQry.Avg + ")"] = Sum / Count;
                                    if (AggregateQry.Count !== AggregateQry.Avg) {
                                        delete Datas[Index]["Count(" + AggregateQry.Avg + ")"];
                                    }
                                    if (AggregateQry.Sum !== AggregateQry.Avg) {
                                        delete Datas[Index]["Sum(" + AggregateQry.Avg + ")"];
                                    }
                                }
                            }
                            else {
                                var IsCountTypeString = typeof AggregateQry.Count, IsSumTypeString = typeof AggregateQry.Count;
                                for (Index in Datas) {
                                    for (var column in AggregateQry.Avg) {
                                        var AvgColumn = AggregateQry.Avg[column], Sum = Datas[Index]["Sum(" + AvgColumn + ")"], Count = Datas[Index]["Count(" + AvgColumn + ")"];
                                        Datas[Index]["Avg(" + AvgColumn + ")"] = Sum / Count;
                                        if (IsCountTypeString) {
                                            if (AggregateQry.Count !== AvgColumn) {
                                                delete Datas[Index]["Count(" + AvgColumn + ")"];
                                            }
                                            else if (AggregateQry.Count.indexOf(AvgColumn) == -1) {
                                                delete Datas[Index]["Count(" + AvgColumn + ")"];
                                            }
                                        }
                                        if (IsSumTypeString) {
                                            if (AggregateQry.Sum !== AvgColumn) {
                                                delete Datas[Index]["Sum(" + AvgColumn + ")"];
                                            }
                                            else if (AggregateQry.Sum.indexOf(AvgColumn) == -1) {
                                                delete Datas[Index]["Sum(" + AvgColumn + ")"];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.Results = Datas;
                    };
                    _this.processGroupBy = function () {
                        var GrpQry = this.Query.GroupBy, Datas = this.Results, LookUpObj = {};
                        //free results memory
                        this.Results = this.Query.GroupBy = undefined;
                        if (typeof GrpQry == 'string') {
                            for (var i in Datas) {
                                LookUpObj[Datas[i][GrpQry]] = Datas[i];
                            }
                        }
                        else {
                            var ObjKey;
                            for (var i in Datas) {
                                ObjKey = "";
                                for (var column in GrpQry) {
                                    ObjKey += Datas[i][GrpQry[column]];
                                }
                                LookUpObj[ObjKey] = Datas[i];
                            }
                        }
                        //free datas memory
                        Datas = [];
                        for (i in LookUpObj) {
                            Datas.push(LookUpObj[i]);
                        }
                        this.Results = Datas;
                    };
                    return _this;
                }
                return GroupByHelper;
            }(Select.Where));
            Select.GroupByHelper = GroupByHelper;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Helper = /** @class */ (function (_super) {
                __extends(Helper, _super);
                function Helper() {
                    var _this = _super.call(this) || this;
                    _this.processOrderBy = function () {
                        var Order = this.Query.Order;
                        if (Order && this.Results.length > 0 && !this.Sorted && Order.By) {
                            Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
                            var That = this, OrderColumn = Order.By, sortNumberInAsc = function () {
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
                            if (typeof this.Results[0][OrderColumn] == 'string') {
                                if (Order.Type == 'asc') {
                                    sortAlphabetInAsc();
                                }
                                else {
                                    sortAlphabetInDesc();
                                }
                            }
                            else if (typeof this.Results[0][OrderColumn] == 'number') {
                                if (Order.Type == 'asc') {
                                    sortNumberInAsc();
                                }
                                else {
                                    sortNumberInDesc();
                                }
                            }
                        }
                    };
                    _this.processAggregateQry = function () {
                        var Datas = this.Results, Results = {}, Key;
                        //free results memory
                        this.Results = undefined;
                        for (var prop in this.Query.Aggregate) {
                            switch (prop) {
                                case 'Count':
                                    var getCount = function () {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result += Datas[i][Key] ? 1 : 0;
                                        }
                                        ;
                                        return Result;
                                    };
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        Key = this.Query.Aggregate[prop];
                                        Results["Count(" + Key + ")"] = getCount();
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var key in this.Query.Aggregate[prop]) {
                                            Key = this.Query.Aggregate[prop][key];
                                            Results["Count(" + Key + ")"] = getCount();
                                        }
                                    }
                                    break;
                                case 'Max':
                                    var getMax = function () {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result = Result > Datas[i][Key] ? Result : Datas[i][Key];
                                        }
                                        ;
                                        return Result;
                                    };
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        Key = this.Query.Aggregate[prop];
                                        Results["Max(" + Key + ")"] = getMax();
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var key in this.Query.Aggregate[prop]) {
                                            Key = this.Query.Aggregate[prop][key];
                                            Results["Max(" + Key + ")"] = getMax();
                                        }
                                    }
                                    break;
                                case 'Min':
                                    var getMin = function () {
                                        var Result = Infinity, Value = Infinity;
                                        for (var i in Datas) {
                                            Value = Datas[i][Key] ? Datas[i][Key] : Infinity;
                                            Result = Result < Value ? Result : Value;
                                        }
                                        ;
                                        return Result;
                                    };
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        Key = this.Query.Aggregate[prop];
                                        Results["Min(" + Key + ")"] = getMin();
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var key in this.Query.Aggregate[prop]) {
                                            Key = this.Query.Aggregate[prop][key];
                                            Results["Min(" + Key + ")"] = getMin();
                                        }
                                    }
                                    break;
                                case 'Sum':
                                    var getSum = function () {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result += Datas[i][Key];
                                        }
                                        ;
                                        return Result;
                                    };
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        Key = this.Query.Aggregate[prop];
                                        Results["Sum(" + Key + ")"] = getSum();
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var key in this.Query.Aggregate[prop]) {
                                            Key = this.Query.Aggregate[prop][key];
                                            Results["Sum(" + Key + ")"] = getSum();
                                        }
                                    }
                                    break;
                                case 'Avg':
                                    var getAvg = function () {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result += Datas[i][Key];
                                        }
                                        ;
                                        return Result / Datas.length;
                                    };
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        Key = this.Query.Aggregate[prop];
                                        Results["Avg(" + Key + ")"] = getAvg();
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var key in this.Query.Aggregate[prop]) {
                                            Key = this.Query.Aggregate[prop][key];
                                            Results["Avg(" + Key + ")"] = getAvg();
                                        }
                                    }
                                    break;
                            }
                        }
                        //add results to the first index of result
                        for (var prop in Results) {
                            Datas[0][prop] = Results[prop];
                        }
                        this.Results = Datas;
                    };
                    return _this;
                }
                return Helper;
            }(Select.GroupByHelper));
            Select.Helper = Helper;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        if (this.SendResultFlag) {
                            this.processOrderBy();
                            if (this.Query.Distinct) {
                                var GroupBy = [];
                                var Result = this.Results[0];
                                for (var key in Result) {
                                    GroupBy.push(key);
                                }
                                var PrimaryKey = this.getPrimaryKey(this.Query.From), Index = GroupBy.indexOf(PrimaryKey);
                                GroupBy.splice(Index, 1);
                                this.Query.GroupBy = GroupBy.length > 0 ? GroupBy : null;
                            }
                            if (this.Query.GroupBy) {
                                if (this.Query.Aggregate) {
                                    this.executeAggregateGroupBy();
                                }
                                else {
                                    this.processGroupBy();
                                }
                            }
                            else if (this.Query.Aggregate) {
                                this.processAggregateQry();
                            }
                            this.OnSuccess(this.Results);
                        }
                    };
                    _this.createtransactionForOrLogic = function (query) {
                        var That = this;
                        this.Query = query;
                        try {
                            this.Transaction = Business.db_connection.transaction([query.From], "readonly");
                            this.Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted();
                            };
                            this.Transaction.ontimeout = That.onTransactionCompleted;
                            this.ObjectStore = this.Transaction.objectStore(query.From);
                            this.goToWhereLogic();
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: query.From });
                        }
                    };
                    _this.orQuerySuccess = function () {
                        this.Results = this.OrInfo.Results;
                        // free var memory
                        this.OrInfo.Results = undefined;
                        this.removeDuplicates();
                        this.OrInfo.OnSucess(this.Results);
                    };
                    _this.executeOrLogic = function () {
                        this.OrInfo = {
                            OrQuery: this.Query.Where.Or,
                            OnSucess: this.OnSuccess,
                            Results: []
                        };
                        this.TmpQry = {
                            From: this.Query.From,
                            Where: {}
                        };
                        var onSuccess = function () {
                            this.OrInfo.Results = this.OrInfo.Results.concat(this.Results);
                            if (!this.Query.Limit || (this.Query.Limit > this.OrInfo.Results.length)) {
                                this.Results = [];
                                var Key = JsStore.getObjectFirstKey(this.OrInfo.OrQuery);
                                if (Key != null) {
                                    this.TmpQry['Where'][Key] = this.OrInfo.OrQuery[Key];
                                    delete this.OrInfo.OrQuery[Key];
                                    this.createtransactionForOrLogic(this.TmpQry);
                                }
                                else {
                                    this.orQuerySuccess();
                                }
                            }
                            else {
                                this.orQuerySuccess();
                            }
                        };
                        // free or memory
                        this.Query.Where.Or = undefined;
                        this.OnSuccess = onSuccess;
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.SkipRecord = _this.Query.Skip;
                    _this.LimitRecord = _this.Query.Limit;
                    try {
                        _this.Transaction = Business.db_connection.transaction([query.From], "readonly");
                        _this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        _this.Transaction.ontimeout = That.onTransactionCompleted;
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        if (query.Where) {
                            if (query.Where.Or) {
                                _this.executeOrLogic();
                            }
                            _this.goToWhereLogic();
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
                return Instance;
            }(Select.Helper));
            Select.Instance = Instance;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var BaseCount = /** @class */ (function (_super) {
                __extends(BaseCount, _super);
                function BaseCount() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ResultCount = 0;
                    _this.CheckFlag = false;
                    return _this;
                }
                return BaseCount;
            }(Business.Base));
            Count.BaseCount = BaseCount;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var NotWhere = /** @class */ (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this;
                        if (this.ObjectStore.count) {
                            var CountRequest = this.ObjectStore.count();
                            CountRequest.onsuccess = function () {
                                That.ResultCount = CountRequest.result;
                            };
                            CountRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            };
                        }
                        else {
                            var Cursor, CursorOpenRequest = this.ObjectStore.openCursor();
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    ++That.ResultCount;
                                    Cursor.continue();
                                }
                            };
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            };
                        }
                    };
                    return _this;
                }
                return NotWhere;
            }(Count.BaseCount));
            Count.NotWhere = NotWhere;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var In = /** @class */ (function (_super) {
                __extends(In, _super);
                function In() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeInLogic = function (column, values) {
                        var Cursor, That = this, ColumnStore = this.ObjectStore.index(column), CursorOpenRequest;
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                ++That.ResultCount;
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            if (this.ObjectStore.count) {
                                for (var i = 0, length = values.length; i < length; i++) {
                                    if (!That.ErrorOccured) {
                                        CursorOpenRequest = ColumnStore.count(IDBKeyRange.only(values[i]));
                                        CursorOpenRequest.onsuccess = function (e) {
                                            That.ResultCount += e.target.result;
                                        };
                                        CursorOpenRequest.onerror = function (e) {
                                            That.ErrorOccured = true;
                                            That.onErrorOccured(e);
                                        };
                                    }
                                }
                            }
                            else {
                                for (var i = 0, length = values.length; i < length; i++) {
                                    if (!That.ErrorOccured) {
                                        CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                        CursorOpenRequest.onsuccess = function (e) {
                                            Cursor = e.target.result;
                                            if (Cursor) {
                                                ++That.ResultCount;
                                                Cursor.continue();
                                            }
                                        };
                                        CursorOpenRequest.onerror = function (e) {
                                            That.ErrorOccured = true;
                                            That.onErrorOccured(e);
                                        };
                                    }
                                }
                            }
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return In;
            }(Count.NotWhere));
            Count.In = In;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Like = /** @class */ (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false;
                        value = value.toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var Cursor, That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompValueLength = this.CompValue.length;
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        ++That.ResultCount;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        ++That.ResultCount;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    return _this;
                }
                return Like;
            }(Count.In));
            Count.Like = Like;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Where = /** @class */ (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereLogic = function (column, value, op) {
                        var That = this;
                        value = op ? value[op] : value;
                        if (That.CheckFlag) {
                            var Cursor, CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(Cursor.value)) {
                                        ++That.ResultCount;
                                    }
                                    Cursor.continue();
                                }
                            };
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            };
                        }
                        else {
                            if (this.ObjectStore.count) {
                                var CountRequest = this.ObjectStore.index(column).count(this.getKeyRange(value, op));
                                CountRequest.onsuccess = function () {
                                    That.ResultCount = CountRequest.result;
                                };
                                CountRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                };
                            }
                            else {
                                var Cursor, CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = e.target.result;
                                    if (Cursor) {
                                        ++That.ResultCount;
                                        Cursor.continue();
                                    }
                                };
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                };
                            }
                        }
                    };
                    return _this;
                }
                return Where;
            }(Count.Like));
            Count.Where = Where;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        if (this.SendResultFlag) {
                            this.OnSuccess(this.ResultCount);
                        }
                    };
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    try {
                        var createTransaction = function () {
                            this.Transaction = Business.db_connection.transaction([query.From], "readonly");
                            this.ObjectStore = this.Transaction.objectStore(query.From);
                            this.Transaction.oncomplete = function (e) {
                                this.onTransactionCompleted();
                            };
                            this.Transaction.ontimeout = this.onTransactionTimeout;
                        };
                        if (query.Where !== undefined) {
                            if (query.Where.Or) {
                                var select_object = new Business.Select.Instance(query, function (results) {
                                    this.ResultCount = results.length;
                                    this.onTransactionCompleted();
                                }, _this.OnError);
                            }
                            else {
                                createTransaction.call(_this);
                                _this.goToWhereLogic();
                            }
                        }
                        else {
                            createTransaction();
                            _this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        _this.onExceptionOccured(ex, { TableName: query.From });
                    }
                    return _this;
                }
                return Instance;
            }(Count.Where));
            Count.Instance = Instance;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            Update.updateValue = function (suppliedValue, storedValue) {
                for (var key in suppliedValue) {
                    if (typeof suppliedValue[key] != 'object') {
                        storedValue[key] = suppliedValue[key];
                    }
                    else {
                        for (var op in suppliedValue[key]) {
                            switch (op) {
                                case '+':
                                    storedValue[key] += suppliedValue[key][op];
                                    break;
                                case '-':
                                    storedValue[key] -= suppliedValue[key][op];
                                    break;
                                case '*':
                                    storedValue[key] *= suppliedValue[key][op];
                                    break;
                                case '/':
                                    storedValue[key] /= suppliedValue[key][op];
                                    break;
                                default: storedValue[key] = suppliedValue[key];
                            }
                            break;
                        }
                    }
                }
                return storedValue;
            };
        })(Update = Business.Update || (Business.Update = {}));
        var BaseUpdate = /** @class */ (function (_super) {
            __extends(BaseUpdate, _super);
            function BaseUpdate() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.CheckFlag = false;
                return _this;
            }
            return BaseUpdate;
        }(Business.Base));
        Business.BaseUpdate = BaseUpdate;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var NotWhere = /** @class */ (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var Cursor, That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Business.BaseUpdate));
            Update.NotWhere = NotWhere;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var In = /** @class */ (function (_super) {
                __extends(In, _super);
                function In() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeInLogic = function (column, values) {
                        var Cursor, That = this, ColumnStore = this.ObjectStore.index(column), CursorOpenRequest;
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                                ++That.RowAffected;
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                            ++That.RowAffected;
                                            Cursor.continue();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return In;
            }(Update.NotWhere));
            Update.In = In;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Like = /** @class */ (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false;
                        value = value.toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var Cursor, That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompValueLength = this.CompValue.length;
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    return _this;
                }
                return Like;
            }(Update.In));
            Update.Like = Like;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Where = /** @class */ (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereLogic = function (column, value, op) {
                        var Cursor, That = this, CursorOpenRequest;
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        if (That.CheckFlag) {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(Cursor.value)) {
                                        Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                    ++That.RowAffected;
                                    Cursor.continue();
                                }
                            };
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return Where;
            }(Update.Like));
            Update.Where = Where;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        this.OnSuccess(this.RowAffected);
                    };
                    _this.createtransactionForOrLogic = function (query) {
                        var that = this;
                        this.Query = query;
                        try {
                            this.Transaction = Business.db_connection.transaction([query.In], "readwrite");
                            this.Transaction.oncomplete = function (e) {
                                that.onTransactionCompleted();
                            };
                            this.Transaction.ontimeout = this.onTransactionCompleted;
                            this.ObjectStore = this.Transaction.objectStore(query.In);
                            this.goToWhereLogic();
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: query.From });
                        }
                    };
                    _this.executeOrLogic = function () {
                        var that = this, select_object = new Business.Select.Instance({
                            From: this.Query.In,
                            Where: this.Query.Where
                        }, function (results) {
                            var key = that.getPrimaryKey(that.Query.In), in_query = [], where_qry = {};
                            results.forEach(function (value) {
                                in_query.push(value[key]);
                            });
                            where_qry[key] = { In: in_query };
                            that.createtransactionForOrLogic({
                                In: that.Query.In,
                                Where: where_qry,
                                Set: that.Query.Set
                            });
                        }, this.OnError);
                    };
                    try {
                        _this.OnSuccess = onSuccess;
                        _this.OnError = onError;
                        _this.checkSchema(query.Set, query.In);
                        if (!_this.ErrorOccured) {
                            _this.Query = query;
                            var that = _this;
                            var createTransaction = function () {
                                that.Transaction = Business.db_connection.transaction([query.In], "readwrite");
                                that.ObjectStore = that.Transaction.objectStore(query.In);
                                that.Transaction.oncomplete = function (e) {
                                    that.onTransactionCompleted();
                                };
                                that.Transaction.ontimeout = that.onTransactionTimeout;
                            };
                            if (query.Where) {
                                if (query.Where.Or) {
                                    _this.executeOrLogic();
                                }
                                else {
                                    createTransaction();
                                    _this.goToWhereLogic();
                                }
                            }
                            else {
                                createTransaction();
                                _this.executeWhereUndefinedLogic();
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
                Instance.prototype.checkSchema = function (suppliedValue, tableName) {
                    if (suppliedValue) {
                        var current_table = this.getTable(tableName), that = this;
                        if (current_table) {
                            var onValidationError = function (error, details) {
                                that.ErrorOccured = true;
                                that.Error = JsStore.Utils.getError(error, details);
                            };
                            // loop through table column and find data is valid
                            current_table._columns.every(function (column) {
                                if (!that.ErrorOccured) {
                                    if (column._name in suppliedValue) {
                                        var executeCheck = function (value) {
                                            // check not null schema
                                            if (column._notNull && JsStore.isNull(value)) {
                                                onValidationError(JsStore.ErrorType.NullValue, { ColumnName: column._name });
                                            }
                                            // check datatype
                                            if (column._dataType) {
                                                var type = typeof value;
                                                if (type !== column._dataType) {
                                                    if (type !== 'object') {
                                                        onValidationError(JsStore.ErrorType.BadDataType, { ColumnName: column._name });
                                                    }
                                                    else {
                                                        var allowed_prop = ['+', '-', '*', '/'];
                                                        for (var prop in value) {
                                                            if (allowed_prop.indexOf(prop) < 0) {
                                                                onValidationError(JsStore.ErrorType.BadDataType, { ColumnName: column._name });
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        executeCheck(suppliedValue[column._name]);
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                        }
                        else {
                            var error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, { TableName: tableName });
                            JsStore.throwError(Error);
                        }
                    }
                    else {
                        this.ErrorOccured = true;
                    }
                };
                return Instance;
            }(Update.Where));
            Update.Instance = Instance;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var BaseDelete = /** @class */ (function (_super) {
                __extends(BaseDelete, _super);
                function BaseDelete() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.CheckFlag = false;
                    return _this;
                }
                return BaseDelete;
            }(Business.Base));
            Delete.BaseDelete = BaseDelete;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var NotWhere = /** @class */ (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var Cursor, That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Delete.BaseDelete));
            Delete.NotWhere = NotWhere;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var In = /** @class */ (function (_super) {
                __extends(In, _super);
                function In() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeInLogic = function (column, values) {
                        var Cursor, That = this, ColumnStore = this.ObjectStore.index(column), CursorOpenRequest;
                        if (That.CheckFlag) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                Cursor.delete();
                                                ++That.RowAffected;
                                            }
                                            Cursor.continue();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = e.target.result;
                                        if (Cursor) {
                                            Cursor.delete();
                                            ++That.RowAffected;
                                            Cursor.continue();
                                        }
                                    };
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    };
                                }
                            }
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return In;
            }(Delete.NotWhere));
            Delete.In = In;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Like = /** @class */ (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false;
                        value = value.toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this, Cursor;
                        this.CompValue = value.toLowerCase();
                        this.CompValueLength = this.CompValue.length;
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (That.CheckFlag) {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key) &&
                                        That.checkForWhereConditionMatch(Cursor.value)) {
                                        Cursor.delete();
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            this.CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.filterOnOccurence(Cursor.key)) {
                                        Cursor.delete();
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                    };
                    return _this;
                }
                return Like;
            }(Delete.In));
            Delete.Like = Like;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Where = /** @class */ (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereLogic = function (column, value, op) {
                        var Cursor, That = this, CursorOpenRequest;
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        if (That.CheckFlag) {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(Cursor.value)) {
                                        Cursor.delete();
                                        ++That.RowAffected;
                                    }
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = e.target.result;
                                if (Cursor) {
                                    Cursor.delete();
                                    ++That.RowAffected;
                                    Cursor.continue();
                                }
                            };
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return Where;
            }(Delete.Like));
            Delete.Where = Where;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        this.OnSuccess(this.RowAffected);
                    };
                    _this.createtransactionForOrLogic = function (query) {
                        var That = this;
                        this.Query = query;
                        try {
                            this.Transaction = Business.db_connection.transaction([query.From], "readwrite");
                            this.Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted();
                            };
                            this.Transaction.ontimeout = That.onTransactionCompleted;
                            this.ObjectStore = this.Transaction.objectStore(query.From);
                            this.goToWhereLogic();
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: query.From });
                        }
                    };
                    _this.executeOrLogic = function () {
                        this.OrInfo = {
                            OrQuery: this.Query.Where.Or,
                            OnSucess: this.OnSuccess
                        };
                        this.TmpQry = {
                            From: this.Query.From,
                            Where: {}
                        };
                        var onSuccess = function () {
                            var Key = JsStore.getObjectFirstKey(this.OrInfo.OrQuery);
                            if (Key != null) {
                                this.TmpQry['Where'][Key] = this.OrInfo.OrQuery[Key];
                                delete this.OrInfo.OrQuery[Key];
                                this.createtransactionForOrLogic(this.TmpQry);
                            }
                            else {
                                this.OrInfo.OnSucess(this.RowAffected);
                            }
                        };
                        //free or memory
                        this.Query.Where.Or = undefined;
                        this.OnSuccess = onSuccess;
                    };
                    try {
                        var That = _this;
                        _this.Query = query;
                        _this.OnSuccess = onSuccess;
                        _this.OnError = onError;
                        _this.Transaction = Business.db_connection.transaction([query.From], "readwrite");
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        _this.Transaction.oncomplete = function () {
                            That.onTransactionCompleted();
                        };
                        _this.Transaction.onerror = function (e) {
                            That.onErrorOccured(e);
                        };
                        if (query.Where) {
                            if (query.Where.Or) {
                                _this.executeOrLogic();
                            }
                            _this.goToWhereLogic();
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
                return Instance;
            }(Delete.Where));
            Delete.Instance = Instance;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    JsStore.worker_status = JsStore.WebWorkerStatus.NotStarted;
    var CodeExecutionHelper = /** @class */ (function () {
        function CodeExecutionHelper() {
            this._requestQueue = [];
            this._isCodeExecuting = false;
            this.pushApi = function (request, usePromise) {
                if (usePromise === true) {
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        request.OnSuccess = function (result) {
                            resolve(result);
                        };
                        request.OnError = function (error) {
                            reject(error);
                        };
                        that.prcoessExecutionOfCode(request);
                    });
                }
                else {
                    this.prcoessExecutionOfCode(request);
                    return this;
                }
            };
            this.createWorker = function () {
                var that = this;
                try {
                    if (Worker) {
                        var script_url = this.getScriptUrl();
                        if (script_url && script_url.length > 0) {
                            JsStore.worker_instance = new Worker(script_url);
                            JsStore.worker_instance.onmessage = function (msg) {
                                that.onMessageFromWorker(msg);
                            };
                            that.executeCodeUsingWorker({
                                Name: 'change_log_status',
                                Query: {
                                    logging: JsStore.enable_log
                                }
                            });
                            setTimeout(function () {
                                if (JsStore.worker_status !== JsStore.WebWorkerStatus.Failed) {
                                    JsStore.worker_status = JsStore.WebWorkerStatus.Registered;
                                }
                                if (JsStore.status.ConStatus === JsStore.ConnectionStatus.Connected) {
                                    that.executeCode();
                                }
                            }, 100);
                        }
                        else {
                            that.onWorkerFailed();
                        }
                    }
                    else {
                        that.onWorkerFailed();
                    }
                }
                catch (ex) {
                    that.onWorkerFailed();
                }
            };
            this.prcoessExecutionOfCode = function (request) {
                if (JsStore.status.ConStatus === JsStore.ConnectionStatus.NotStarted) {
                    switch (request.Name) {
                        case 'create_db':
                        case 'open_db':
                            this._requestQueue.splice(0, 0, request);
                            if (JsStore.worker_status !== JsStore.WebWorkerStatus.NotStarted) {
                                this.executeCode();
                            }
                            JsStore.status.ConStatus = JsStore.ConnectionStatus.Connected;
                            break;
                        default: this._requestQueue.push(request);
                    }
                }
                else {
                    this.RequestQueue.push(request);
                    if (this.RequestQueue.length === 1 && JsStore.worker_status !== JsStore.WebWorkerStatus.NotStarted) {
                        this.executeCode();
                    }
                }
                JsStore.log("request pushed: " + request.Name);
            };
            this.executeCode = function () {
                if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                    this.IsCodeExecuting = true;
                    var first_request = this.RequestQueue[0], request = {
                        Name: first_request.Name,
                        Query: first_request.Query
                    };
                    JsStore.log("request executing : " + first_request.Name);
                    if (JsStore.worker_status === JsStore.WebWorkerStatus.Registered) {
                        this.executeCodeUsingWorker(request);
                    }
                    else {
                        this.executeCodeDirect(request);
                    }
                }
            };
            this.executeCodeDirect = function (request) {
                var that = this;
                new JsStore.Business.Main(function (results) {
                    that.processFinishedRequest(results);
                }).checkConnectionAndExecuteLogic(request);
            };
            this.executeCodeUsingWorker = function (request) {
                JsStore.worker_instance.postMessage(request);
            };
            this.processFinishedRequest = function (message) {
                var finished_request = this._requestQueue.shift();
                this.IsCodeExecuting = false;
                if (finished_request) {
                    JsStore.log("request finished : " + finished_request.Name);
                    if (message.ErrorOccured) {
                        if (finished_request.OnError) {
                            finished_request.OnError(message.ErrorDetails);
                        }
                    }
                    else {
                        if (finished_request.OnSuccess) {
                            if (message.ReturnedValue != null) {
                                finished_request.OnSuccess(message.ReturnedValue);
                            }
                            else {
                                finished_request.OnSuccess();
                            }
                        }
                    }
                    this.executeCode();
                }
            };
            this.onWorkerFailed = function () {
                console.warn('JsStore is not runing in web worker');
                JsStore.worker_status = JsStore.WebWorkerStatus.Failed;
                if (JsStore.status.ConStatus === JsStore.ConnectionStatus.NotStarted) {
                    this.executeCode();
                }
            };
            this.onMessageFromWorker = function (msg) {
                var that = this;
                if (typeof msg.data === 'string') {
                    var datas = msg.data.split(':')[1];
                    switch (datas) {
                        case 'WorkerFailed':
                            that.onWorkerFailed();
                            break;
                    }
                }
                else {
                    this.processFinishedRequest(msg.data);
                }
            };
        }
        CodeExecutionHelper.prototype.getScriptUrl = function (fileName) {
            var script_url = "";
            var file_name = fileName ? fileName.toLowerCase() : "jsstore";
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length - 1, url = ""; i >= 0; i--) {
                url = scripts[i].src;
                url = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
                if (url.length > 0 && url.indexOf(file_name) >= 0) {
                    script_url = scripts[i].src;
                    return script_url;
                }
            }
            return script_url;
        };
        return CodeExecutionHelper;
    }());
    JsStore.CodeExecutionHelper = CodeExecutionHelper;
})(JsStore || (JsStore = {}));
var Model = JsStore.Model;
var DataBase = Model.DataBase;
var Column = Model.Column;
var Table = Model.Table;
var JsStore;
(function (JsStore) {
    var Instance = /** @class */ (function (_super) {
        __extends(Instance, _super);
        function Instance(dbName) {
            if (dbName === void 0) { dbName = null; }
            var _this = _super.call(this) || this;
            /**
             * open database
             *
             * @param {string} dbName
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @returns
             * @memberof Instance
             */
            _this.openDb = function (dbName, onSuccess, onError) {
                return this.pushApi({
                    Name: 'open_db',
                    Query: dbName,
                    OnSuccess: onSuccess,
                    OnError: onError,
                }, false);
            };
            /**
             * creates DataBase
             *
             * @param {Model.IDataBase} dataBase
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @returns
             * @memberof Instance
             */
            _this.createDb = function (dataBase, onSuccess, onError) {
                return this.pushApi({
                    Name: 'create_db',
                    OnSuccess: onSuccess,
                    OnError: onError,
                    Query: dataBase
                }, false);
            };
            /**
             * drop dataBase
             *
             * @param {Function} onSuccess
             * @param {Function} [onError=null]
             * @memberof Instance
             */
            _this.dropDb = function (onSuccess, onError) {
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'drop_db',
                    Query: null,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * select data from table
             *
             * @param {IQuery} query
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             *
             * @memberOf Main
             */
            _this.select = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                query.OnSuccess = query.OnError = null;
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'select',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * get no of result from table
             *
             * @param {ICount} query
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @memberof Instance
             */
            _this.count = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                query.OnSuccess = query.OnError = null;
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'count',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * insert data into table
             *
             * @param {IInsert} query
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @memberof Instance
             */
            _this.insert = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                query.OnSuccess = query.OnError = null;
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'insert',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * update data into table
             *
             * @param {IUpdate} query
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @memberof Instance
             */
            _this.update = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                query.OnSuccess = query.OnError = null;
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'update',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * delete data from table
             *
             * @param {IDelete} query
             * @param {Function} [onSuccess=null]
             * @param {Function} onError
             * @memberof Instance
             */
            _this.delete = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                query.OnSuccess = query.OnError = null;
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'delete',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * delete all data from table
             *
             * @param {string} tableName
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @memberof Instance
             */
            _this.clear = function (tableName, onSuccess, onError) {
                var use_promise = onSuccess ? false : true;
                return this.pushApi({
                    Name: 'clear',
                    Query: tableName,
                    OnSuccess: onSuccess,
                    OnError: onerror
                }, use_promise);
            };
            /**
             * insert bulk amount of data
             *
             * @param {IInsert} query
             * @param {Function} [onSuccess=null]
             * @param {Function} [onError=null]
             * @returns
             * @memberof Instance
             */
            _this.bulkInsert = function (query, onSuccess, onError) {
                onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
                onError = query.OnError ? query.OnError : onError;
                var use_promise = onSuccess ? false : true;
                query.OnSuccess = query.OnError = null;
                return this.pushApi({
                    Name: 'bulk_insert',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                }, use_promise);
            };
            /**
             * export the result in json file
             *
             * @param {ISelect} qry
             * @memberof Instance
             */
            _this.exportJson = function (query) {
                var onSuccess = function (url) {
                    var link = document.createElement("a");
                    link.href = url;
                    link.download = query.From + ".json";
                    link.click();
                    if (onSuccessCallBack) {
                        onSuccessCallBack(null);
                    }
                }, onError = query['OnError'], onSuccessCallBack = query['OnSuccess'];
                query['OnSuccess'] = query['OnError'] = undefined;
                var use_promise = onSuccessCallBack ? false : true;
                if (use_promise) {
                    return new Promise(function (resolve, reject) {
                        this.pushApi({
                            Name: 'export_json',
                            Query: query,
                            OnSuccess: onSuccess,
                            OnError: onError
                        }, use_promise).then(function (url) {
                            onSuccess(url);
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    });
                }
                else {
                    this.pushApi({
                        Name: 'export_json',
                        Query: query,
                        OnSuccess: onSuccess,
                        OnError: onError
                    }, use_promise);
                }
            };
            if (JsStore.worker_status === JsStore.WebWorkerStatus.Registered) {
                JsStore.worker_instance.terminate();
            }
            else if (JsStore.worker_status === JsStore.WebWorkerStatus.NotStarted) {
                KeyStore.init();
            }
            _this.createWorker();
            if (dbName) {
                _this.openDb(dbName, null, null);
            }
            return _this;
        }
        return Instance;
    }(JsStore.CodeExecutionHelper));
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
if (self && !self.alert) {
    self.onmessage = function (e) {
        JsStore.log("Request executing from WebWorker, request name: " + e.data.Name);
        var Request = e.data, BusinessMain = new JsStore.Business.Main();
        BusinessMain.checkConnectionAndExecuteLogic(Request);
    };
    JsStore.worker_status = JsStore.WebWorkerStatus.Registered;
    KeyStore.init();
}
//# sourceMappingURL=jsstore.js.map