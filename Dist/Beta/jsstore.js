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
/*!
 * @license :JsStore.js - v1.6.4 - 15/03/2018
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT
 */ 
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
            self.indexedDB = self.indexedDB || self.mozIndexedDB ||
                self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction ||
                    self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange ||
                    self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else if (!self.alert) {
                console.log('worked failed');
                self.postMessage('message:WorkerFailed');
            }
            else {
                JsStore.db_status = {
                    ConStatus: JsStore.Connection_Status.UnableToStart,
                    LastError: JsStore.Error_Type.IndexedDbUndefined
                };
            }
        };
        Utils.updateDbStatus = function (status, err) {
            if (err === undefined) {
                KeyStore.db_status.ConStatus = status;
            }
            else {
                KeyStore.db_status = {
                    ConStatus: status,
                    LastError: err
                };
            }
        };
        return Utils;
    }());
    KeyStore.Utils = Utils;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Connection_Status;
    (function (Connection_Status) {
        Connection_Status["Connected"] = "connected";
        Connection_Status["Closed"] = "closed";
        Connection_Status["NotStarted"] = "not_connected";
    })(Connection_Status = KeyStore.Connection_Status || (KeyStore.Connection_Status = {}));
    KeyStore.request_queue = [], KeyStore.table_name = "LocalStore", KeyStore.is_code_executing = false, KeyStore.db_status = {
        ConStatus: Connection_Status.NotStarted,
        LastError: ""
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.prcoessExecutionOfCode = function (request) {
        KeyStore.request_queue.push(request);
        if (KeyStore.request_queue.length === 1) {
            KeyStore.executeCode();
        }
    };
    KeyStore.executeCode = function () {
        if (!KeyStore.is_code_executing && KeyStore.request_queue.length > 0) {
            KeyStore.is_code_executing = true;
            var request = {
                Name: KeyStore.request_queue[0].Name,
                Query: KeyStore.request_queue[0].Query
            };
            KeyStore.executeCodeDirect(request);
        }
    };
    KeyStore.executeCodeDirect = function (request) {
        new KeyStore.Business.Main(function (results) {
            this.processFinishedRequest(results);
        }.bind(this)).checkConnectionAndExecuteLogic(request);
    };
    KeyStore.processFinishedRequest = function (message) {
        var finished_request = KeyStore.request_queue.shift();
        KeyStore.is_code_executing = false;
        if (message.ErrorOccured) {
            if (finished_request.OnError) {
                finished_request.OnError(message.ErrorDetails);
            }
            else {
                console.error(message.ErrorDetails);
            }
        }
        else if (finished_request.OnSuccess) {
            finished_request.OnSuccess(message.ReturnedValue);
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
                this._results = null;
                this._errorOccured = false;
                this._errorCount = 0;
            }
            Base.prototype.onErrorOccured = function (e) {
                ++this._errorCount;
                if (this._errorCount === 1) {
                    if (this._onError != null) {
                        this._onError(e.target.error);
                    }
                }
                console.error(e);
            };
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
                _this._query = query;
                _this._onSuccess = onSuccess;
                _this._onError = onError;
                return _this;
            }
            Get.prototype.execute = function () {
                var getData = function (column, value) {
                    var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.on_errorOccured(e);
                    }.bind(this);
                    cursor_request.onsuccess = function (e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            this._results = cursor.value['Value'];
                        }
                    }.bind(this);
                }.bind(this);
                this.initTransaction();
                for (var prop in this._query.Where) {
                    getData(prop, this._query.Where[prop]);
                    break;
                }
            };
            Get.prototype.initTransaction = function () {
                Business.createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                this._objectStore = Business.db_transaction.objectStore(this._query.From);
            };
            Get.prototype.onTransactionCompleted = function () {
                if (this._errorOccured === false) {
                    this._onSuccess(this._results);
                }
            };
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
                try {
                    _this._query = query;
                    _this._onSuccess = onSuccess;
                    _this._onError = onError;
                }
                catch (ex) {
                    console.error(ex);
                }
                return _this;
            }
            Set.prototype.execute = function () {
                var updateIfExistElseInsert = function () {
                    var cursor_request = this._objectStore.index('Key').openCursor(IDBKeyRange.only(this._query.Set['Key']));
                    cursor_request.onsuccess = function (e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            cursor.value['Value'] = this._query.Set['Value'];
                            cursor.update(cursor.value);
                        }
                        else {
                            insertData();
                        }
                    }.bind(this);
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                }.bind(this), insertData = function () {
                    var add_result = this._objectStore.add(this._query.Set);
                    add_result.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                }.bind(this);
                this.initTransaction();
                updateIfExistElseInsert();
            };
            Set.prototype.initTransaction = function () {
                Business.createTransaction([this._query.TableName], this.onTransactionCompleted.bind(this));
                this._objectStore = Business.db_transaction.objectStore(this._query.TableName);
            };
            Set.prototype.onTransactionCompleted = function () {
                if (this._errorOccured === false && this._onSuccess) {
                    this._onSuccess(null);
                }
            };
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
                _this._rowAffected = 0;
                _this._query = query;
                _this._onSuccess = onSuccess;
                _this._onError = onError;
                return _this;
            }
            Remove.prototype.execute = function () {
                this.initTransaction();
                var removeData = function (column, value) {
                    var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    cursor_request.onsuccess = function (e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this._rowAffected;
                            cursor.continue();
                        }
                    }.bind(this);
                }.bind(this);
                for (var prop in this._query.Where) {
                    if (!this._errorOccured) {
                        removeData(prop, this._query.Where[prop]);
                    }
                    break;
                }
            };
            Remove.prototype.initTransaction = function () {
                Business.createTransaction([this._query.From], this.onTransactionCompleted.bind(this));
                this._objectStore = Business.db_transaction.objectStore(this._query.From);
            };
            Remove.prototype.onTransactionCompleted = function () {
                if (this._errorOccured === false) {
                    this._onSuccess(this._rowAffected);
                }
            };
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
            function InitDb(dbName, onSuccess, onError) {
                var db_request = self.indexedDB.open(dbName, 1);
                Business.is_db_deleted_by_browser = false;
                db_request.onerror = function (event) {
                    if (event.target.error.name === 'InvalidStateError') {
                        JsStore.db_status = {
                            ConStatus: JsStore.Connection_Status.UnableToStart,
                            LastError: JsStore.Error_Type.IndexedDbBlocked,
                        };
                    }
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                db_request.onsuccess = function (event) {
                    KeyStore.db_status.ConStatus = KeyStore.Connection_Status.Connected;
                    Business.db_connection = db_request.result;
                    Business.db_connection.onclose = function () {
                        Business.callDbDroppedByBrowser();
                        KeyStore.Utils.updateDbStatus(KeyStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                    };
                    Business.db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                            Business.callDbDroppedByBrowser();
                            KeyStore.Utils.updateDbStatus(KeyStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                        }
                    };
                    Business.db_connection.onerror = function (e) {
                        KeyStore.db_status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.db_connection.onabort = function (e) {
                        KeyStore.db_status.ConStatus = KeyStore.Connection_Status.Closed;
                        KeyStore.db_status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                db_request.onupgradeneeded = function (event) {
                    var db = event.target.result, column = "Key";
                    db.createObjectStore(KeyStore.table_name, {
                        keyPath: column
                    }).createIndex(column, column, { unique: true });
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
        Business.db_transaction = null, Business.callDbDroppedByBrowser = function () {
            Business.is_db_deleted_by_browser = KeyStore.db_status.ConStatus === KeyStore.Connection_Status.Connected ? true : false;
        }, Business.createTransaction = function (tableNames, callBack, mode) {
            if (Business.db_transaction === null) {
                mode = mode ? mode : "readwrite";
                Business.db_transaction = Business.db_connection.transaction(tableNames, mode);
                Business.db_transaction.oncomplete = function () {
                    Business.db_transaction = null;
                    callBack();
                };
                Business.db_transaction.ontimeout = function () {
                    Business.db_transaction = null;
                    console.error('transaction timed out');
                };
            }
        };
        var Main = /** @class */ (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.executeLogic = function (request) {
                    var onSuccess = function (results) {
                        this.returnResult({
                            ReturnedValue: results
                        });
                    }.bind(this), onError = function (err) {
                        this.returnResult({
                            ErrorDetails: err,
                            ErrorOccured: true
                        });
                    }.bind(this);
                    switch (request.Name) {
                        case 'get':
                            this.get(request.Query, onSuccess, onError);
                            break;
                        case 'set':
                            this.set(request.Query, onSuccess, onError);
                            break;
                        case 'remove':
                            this.remove(request.Query, onSuccess, onError);
                            break;
                        case 'create_db':
                            this.createDb(onSuccess, onError);
                            break;
                    }
                };
                this._onSuccess = onSuccess;
            }
            Main.prototype.set = function (query, onSuccess, onError) {
                var obj_insert = new Business.Set(query, onSuccess, onError);
                obj_insert.execute();
            };
            Main.prototype.remove = function (query, onSuccess, onError) {
                var obj_delete = new Business.Remove(query, onSuccess, onError);
                obj_delete.execute();
            };
            Main.prototype.get = function (query, onSuccess, onError) {
                var get_object = new Business.Get(query, onSuccess, onError);
                get_object.execute();
            };
            Main.prototype.createDb = function (onSuccess, onError) {
                var db_name = "KeyStore";
                var init_db_object = new Business.InitDb(db_name, onSuccess, onError);
            };
            Main.prototype.checkConnectionAndExecuteLogic = function (request) {
                if (request.Name === 'create_db' || request.Name === 'open_db') {
                    this.executeLogic(request);
                }
                else {
                    switch (KeyStore.db_status.ConStatus) {
                        case KeyStore.Connection_Status.Connected:
                            this.executeLogic(request);
                            break;
                        case KeyStore.Connection_Status.NotStarted:
                            setTimeout(function () {
                                this.checkConnectionAndExecuteLogic(request);
                            }.bind(this), 100);
                            break;
                        case KeyStore.Connection_Status.Closed:
                            if (Business.is_db_deleted_by_browser) {
                                this.createDb(function () {
                                    Business.is_db_deleted_by_browser = false;
                                    this.checkConnectionAndExecuteLogic(request);
                                }.bind(this), function (err) {
                                    console.error(err);
                                });
                            }
                    }
                }
            };
            Main.prototype.returnResult = function (result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
            };
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
                Query: null
            });
        }
    };
    /**
     * return the value by key
     *
     * @param {string} key
     * @param {(result) => void} onSuccess
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    KeyStore.get = function (key, onSuccess, onError) {
        if (onError === void 0) { onError = null; }
        var query = {
            From: KeyStore.table_name,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'get',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        });
        return this;
    };
    /**
     * insert or update value
     *
     * @param {any} key
     * @param {any} value
     * @param {(result) => void} [onSuccess]
     * @param {(err: IError) => void} [onError]
     * @returns
     */
    KeyStore.set = function (key, value, onSuccess, onError) {
        var query = {
            Set: {
                Key: key,
                Value: value
            },
            TableName: KeyStore.table_name,
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'set',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        });
        return this;
    };
    /**
     * delete value
     *
     * @param {string} key
     * @param {(result) => void} [onSuccess=null]
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    KeyStore.remove = function (key, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var query = {
            From: KeyStore.table_name,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'remove',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        });
        return this;
    };
})(KeyStore || (KeyStore = {}));
var JsStore;
(function (JsStore) {
    var Occurence;
    (function (Occurence) {
        Occurence["First"] = "f";
        Occurence["Last"] = "l";
        Occurence["Any"] = "a";
    })(Occurence = JsStore.Occurence || (JsStore.Occurence = {}));
    var WebWorker_Status;
    (function (WebWorker_Status) {
        WebWorker_Status["Registered"] = "registerd";
        WebWorker_Status["Failed"] = "failed";
        WebWorker_Status["NotStarted"] = "not_started";
    })(WebWorker_Status = JsStore.WebWorker_Status || (JsStore.WebWorker_Status = {}));
    var Connection_Status;
    (function (Connection_Status) {
        Connection_Status["Connected"] = "connected";
        Connection_Status["Closed"] = "closed";
        Connection_Status["NotStarted"] = "not_started";
        Connection_Status["UnableToStart"] = "unable_to_start";
        Connection_Status["ClosedByJsStore"] = "closed_by_jsstore";
    })(Connection_Status = JsStore.Connection_Status || (JsStore.Connection_Status = {}));
    var WhereQryOption;
    (function (WhereQryOption) {
        WhereQryOption["In"] = "In";
        WhereQryOption["Like"] = "Like";
        WhereQryOption["Or"] = "Or";
    })(WhereQryOption = JsStore.WhereQryOption || (JsStore.WhereQryOption = {}));
    var Data_Type;
    (function (Data_Type) {
        Data_Type["String"] = "string";
        Data_Type["Object"] = "object";
        Data_Type["Array"] = "array";
        Data_Type["Number"] = "number";
        Data_Type["Boolean"] = "boolean";
        Data_Type["Null"] = "null";
    })(Data_Type = JsStore.Data_Type || (JsStore.Data_Type = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    JsStore.enable_log = false, JsStore.db_version = 0, JsStore.db_status = {
        ConStatus: JsStore.Connection_Status.NotStarted,
        LastError: null
    };
    JsStore.setFileName = function (fileName) {
        JsStore.file_name = fileName;
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
        Utils.updateDbStatus = function (status, err) {
            if (err === undefined) {
                JsStore.db_status.ConStatus = status;
            }
            else {
                JsStore.db_status = {
                    ConStatus: status,
                    LastError: err
                };
            }
        };
        Utils.changeLogStatus = function () {
            if (JsStore.worker_instance) {
                JsStore.worker_instance.postMessage({
                    Name: 'change_log_status',
                    Query: {
                        logging: JsStore.enable_log
                    }
                });
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
     * @param {(IDbInfo | string)} dbInfo
     * @param {(isExist: boolean) => void} callback
     * @param {(err: IError) => void} [errCallBack]
     * @returns
     */
    JsStore.isDbExist = function (dbInfo, callback, errCallBack) {
        var use_promise = callback ? false : true;
        if (JsStore.db_status.ConStatus !== JsStore.Connection_Status.UnableToStart) {
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    if (typeof dbInfo === 'string') {
                        JsStore.getDbVersion(dbInfo, function (dbVersion) {
                            resolve(Boolean(dbVersion));
                        });
                    }
                    else {
                        JsStore.getDbVersion(dbInfo.DbName, function (dbVersion) {
                            resolve(dbInfo.Table.Version <= dbVersion);
                        });
                    }
                });
            }
            else {
                if (typeof dbInfo === 'string') {
                    JsStore.getDbVersion.call(this, dbInfo, function (dbVersion) {
                        callback.call(this, Boolean(dbVersion));
                    });
                }
                else {
                    JsStore.getDbVersion.call(this, dbInfo.DbName, function (dbVersion) {
                        callback.call(this, dbInfo.Table.Version <= dbVersion);
                    });
                }
            }
        }
        else {
            var error = {
                _message: null,
                _type: JsStore.db_status.LastError,
            };
            switch (error._type) {
                case JsStore.Error_Type.IndexedDbBlocked:
                    error._message = "IndexedDB is blocked";
                    break;
                case JsStore.Error_Type.IndexedDbUndefined:
                    error._message = "IndexedDB is not supported";
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
    JsStore.getDbVersion = function (dbName, callback) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback.call(this, Number(dbVersion));
        }.bind(this));
    };
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @param {(any) => void} callback
     */
    JsStore.getDbSchema = function (dbName, callback) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                if (result) {
                    if (result._name) {
                        callback(result);
                    }
                    else {
                        var db_schema = new JsStore.Model.DataBase(result);
                        KeyStore.set("JsStore_" + dbName + "_Schema", db_schema);
                        callback(db_schema);
                    }
                }
                else {
                    callback(result);
                }
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
    JsStore.enableLog = function () {
        JsStore.enable_log = true;
        JsStore.Utils.changeLogStatus();
    };
    /**
     * disable log
     *
     */
    JsStore.disableLog = function () {
        JsStore.enable_log = false;
        JsStore.Utils.changeLogStatus();
    };
    /**
     * set the configuration
     *
     * @param {IConfig} config
     */
    JsStore.setConfig = function (config) {
        if (config.OnDbDroppedByBrowser) {
            config.OnDbDroppedByBrowser = config.OnDbDroppedByBrowser.toString();
        }
        if (JsStore.worker_instance) {
            JsStore.worker_instance.postMessage({
                Name: 'set_config',
                Query: config
            });
        }
    };
    /**
     * get data type of supplied value
     *
     * @param {any} value
     * @returns
     */
    JsStore.getType = function (value) {
        if (value === null) {
            return JsStore.Data_Type.Null;
        }
        var type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return JsStore.Data_Type.Array;
                }
            default:
                return type;
        }
    };
    /**
     * get database list
     *
     * @param {(dbList: string[]) => void} callback
     */
    JsStore.getDbList = function (callback) {
        if (callback === undefined) {
            return new Promise(function (resolve, reject) {
                KeyStore.get('database_list', function (result) {
                    if (result == null) {
                        result = [];
                    }
                    resolve(result);
                }, function (err) {
                    reject(err);
                });
            });
        }
        else {
            KeyStore.get('database_list', function (result) {
                if (result == null) {
                    result = [];
                }
                callback(result);
            });
        }
    };
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Error_Type;
    (function (Error_Type) {
        Error_Type["UndefinedColumn"] = "undefined_column";
        Error_Type["UndefinedValue"] = "undefined_value";
        Error_Type["UndefinedColumnName"] = "undefined_column_name";
        Error_Type["UndefinedDbName"] = "undefined_database_name";
        Error_Type["UndefinedColumnValue"] = "undefined_column_value";
        Error_Type["NotArray"] = "not_array";
        Error_Type["NoValueSupplied"] = "no_value_supplied";
        Error_Type["ColumnNotExist"] = "column_not_exist";
        Error_Type["EnableSearchOff"] = "enable_search_off";
        Error_Type["InvalidOp"] = "invalid_operator";
        Error_Type["NullValue"] = "null_value";
        Error_Type["BadDataType"] = "bad_data_type";
        Error_Type["NextJoinNotExist"] = "next_join_not_exist";
        Error_Type["TableNotExist"] = "table_not_exist";
        Error_Type["DbNotExist"] = "db_not_exist";
        Error_Type["IndexedDbUndefined"] = "indexeddb_undefined";
        Error_Type["IndexedDbBlocked"] = "indexeddb_blocked";
        Error_Type["ConnectionAborted"] = "connection_aborted";
        Error_Type["ConnectionClosed"] = "connection_closed";
        Error_Type["NotObject"] = "not_object";
        Error_Type["InvalidConfig"] = "invalid_config";
    })(Error_Type = JsStore.Error_Type || (JsStore.Error_Type = {}));
    var Error = /** @class */ (function () {
        function Error(type, info) {
            if (info === void 0) { info = null; }
            this.throw = function () {
                throw this.get();
            };
            this.logError = function () {
                console.error(this.get());
            };
            this.logWarning = function () {
                console.warn(this.get());
            };
            this.getMsg = function () {
                var err_msg;
                switch (this._type) {
                    case Error_Type.NotArray:
                        err_msg = "Supplied value is not an array";
                        break;
                    case Error_Type.UndefinedColumn:
                        err_msg = "Column is undefined in Where";
                        break;
                    case Error_Type.UndefinedValue:
                        err_msg = "Value is undefined in Where";
                        break;
                    case Error_Type.UndefinedColumnName:
                        err_msg = "Column name is undefined '" + this._info['TableName'] + "'";
                        break;
                    case Error_Type.UndefinedDbName:
                        err_msg = "Database name is not supplied";
                        break;
                    case Error_Type.UndefinedColumnValue:
                        err_msg = "Column value is undefined";
                        break;
                    case Error_Type.NoValueSupplied:
                        err_msg = "No value supplied";
                        break;
                    case Error_Type.InvalidOp:
                        err_msg = "Invalid Op Value '" + this._info['Op'] + "'";
                        break;
                    case Error_Type.ColumnNotExist:
                        err_msg = "Column '" + this._info['ColumnName'] + "' does not exist";
                        break;
                    case Error_Type.EnableSearchOff:
                        err_msg = "Search is turned off for the Column '" + this._info['ColumnName'] + "'";
                        break;
                    case Error_Type.NullValue:
                        err_msg = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                        break;
                    case Error_Type.BadDataType:
                        err_msg = "Supplied value for column '" + this._info['ColumnName'] +
                            "' does not have valid type";
                        break;
                    case Error_Type.NextJoinNotExist:
                        err_msg = "Next join details not supplied";
                        break;
                    case Error_Type.TableNotExist:
                        err_msg = "Table '" + this._info['TableName'] + "' does not exist";
                        break;
                    case Error_Type.DbNotExist:
                        err_msg = "Database '" + this._info['DbName'] + "' does not exist";
                        break;
                    case Error_Type.NotObject:
                        err_msg = "supplied value is not object";
                        break;
                    case Error_Type.InvalidOp:
                        err_msg = "Invalid Config '" + this._info['Config'] + " '";
                    default:
                        err_msg = this._message;
                        break;
                }
                return err_msg;
            };
            this._type = type;
            this._info = info;
            this._message = this.getMsg();
        }
        Error.prototype.get = function () {
            return {
                _message: this._message,
                _type: this._type
            };
        };
        return Error;
    }());
    JsStore.Error = Error;
})(JsStore || (JsStore = {}));
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
                    var err = new JsStore.Error(JsStore.Error_Type.UndefinedColumnName, { TableName: tableName });
                    err.throw();
                }
                this._autoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this._primaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this._unique = key.Unique != null ? key.Unique : false;
                this._notNull = key.NotNull != null ? key.NotNull : false;
                this._dataType = key.DataType != null ? key.DataType : (key.AutoIncrement ? 'number' : null);
                this._default = key.Default;
                this._multiEntry = key.MultiEntry == null ? false : key.MultiEntry;
                this._enableSearch = key.EnableSearch == null ? true : key.EnableSearch;
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
            function Table(table) {
                this._columns = [];
                this._name = table.Name;
                this._version = table.Version == null ? 1 : table.Version;
                table.Columns.forEach(function (item) {
                    this._columns.push(new Model.Column(item, table.Name));
                }, this);
            }
            return Table;
        }());
        Model.Table = Table;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var TableHelper = /** @class */ (function () {
            function TableHelper(table) {
                this._columns = [];
                this._requireDelete = false;
                this._requireCreation = false;
                this._name = table._name;
                this._version = table._version;
                this._columns = table._columns;
                this.setPrimaryKey();
            }
            TableHelper.prototype.createMetaData = function (dbName, callBack) {
                this._callback = callBack;
                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
            };
            TableHelper.prototype.setPrimaryKey = function () {
                this._columns.every(function (item) {
                    this._primaryKey = item._primaryKey ? item._name : "";
                    return !item._primaryKey;
                }, this);
            };
            TableHelper.prototype.setRequireDelete = function (dbName) {
                KeyStore.get("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        this._requireCreation = true;
                    }
                    else if (tableVersion < this._version) {
                        this._requireDelete = true;
                    }
                }.bind(this));
            };
            TableHelper.prototype.setDbVersion = function (dbName) {
                JsStore.db_version = JsStore.db_version > this._version ? JsStore.db_version : this._version;
                // setting db version
                KeyStore.set('JsStore_' + dbName + '_Db_Version', JsStore.db_version)
                    .set("JsStore_" + dbName + "_" + this._name + "_Version", JsStore.db_version, this._callback);
                this._version = JsStore.db_version;
            };
            return TableHelper;
        }());
        Model.TableHelper = TableHelper;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var DbHelper = /** @class */ (function () {
            function DbHelper(dataBase) {
                this._tables = [];
                this._name = dataBase._name;
                this._tables = dataBase._tables;
            }
            DbHelper.prototype.createMetaData = function (callBack) {
                var index = 0, table_helpers = [], createMetaDataForTable = function () {
                    if (index < this._tables.length) {
                        var table = this._tables[index], table_helper = new Model.TableHelper(table);
                        table_helper.createMetaData(this._name, function () {
                            table_helper._callback = null;
                            table_helpers.push(table_helper);
                            createMetaDataForTable();
                        });
                        ++index;
                    }
                    else {
                        callBack(table_helpers);
                    }
                }.bind(this);
                createMetaDataForTable();
            };
            return DbHelper;
        }());
        Model.DbHelper = DbHelper;
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
                    this._tables.push(new Model.Table(item));
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
                this.filterOnOccurence = function (value) {
                    var found = false;
                    value = value.toLowerCase();
                    switch (this._compSymbol) {
                        case JsStore.Occurence.Any:
                            if (value.indexOf(this._compValue) >= 0) {
                                found = true;
                            }
                            break;
                        case JsStore.Occurence.First:
                            if (value.indexOf(this._compValue) === 0) {
                                found = true;
                            }
                            break;
                        case JsStore.Occurence.Last:
                            if (value.lastIndexOf(this._compValue) === value.length - this._compValueLength) {
                                found = true;
                            }
                            break;
                        default: if (value !== this._compValue) {
                            found = true;
                        }
                    }
                    return found;
                };
            }
            BaseHelper.prototype.containsNot = function (whereQry) {
                var status = false, value;
                Object.keys(whereQry).every(function (key) {
                    value = whereQry[key];
                    if (value['!=']) {
                        status = true;
                    }
                    return !status;
                });
                return status;
            };
            BaseHelper.prototype.isTableExist = function (tableName) {
                var is_exist = false;
                Business.active_db._tables.every(function (table) {
                    if (table._name === tableName) {
                        is_exist = true;
                        return false;
                    }
                    return true;
                });
                return is_exist;
            };
            BaseHelper.prototype.getTable = function (tableName) {
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
            BaseHelper.prototype.getKeyRange = function (value, op) {
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
            BaseHelper.prototype.getPrimaryKey = function (tableName) {
                var primary_key = this.getTable(tableName)._primaryKey;
                return primary_key ? primary_key : this.getKeyPath(tableName);
            };
            BaseHelper.prototype.getKeyPath = function (tableName) {
                var transaction = Business.db_connection.transaction([tableName], "readonly"), object_store = transaction.objectStore(tableName);
                return object_store.keyPath;
            };
            BaseHelper.prototype.sortNumberInAsc = function (values) {
                values.sort(function (a, b) {
                    return a - b;
                });
                return values;
            };
            BaseHelper.prototype.sortNumberInDesc = function (values) {
                values.sort(function (a, b) {
                    return b - a;
                });
                return values;
            };
            BaseHelper.prototype.sortAlphabetInAsc = function (values) {
                values.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                return values;
            };
            BaseHelper.prototype.sortAlphabetInDesc = function (values) {
                values.sort(function (a, b) {
                    return b.toLowerCase().localeCompare(a.toLowerCase());
                });
                return values;
            };
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
                _this._errorOccured = false;
                _this._errorCount = 0;
                _this._rowAffected = 0;
                _this.goToWhereLogic = function () {
                    var column_name = JsStore.getObjectFirstKey(this._query.Where);
                    if (this._query.IgnoreCase === true) {
                        this._query.Where = this.makeQryInCaseSensitive(this._query.Where);
                    }
                    if (this._objectStore.indexNames.contains(column_name)) {
                        var value = this._query.Where[column_name];
                        if (typeof value === 'object') {
                            this._checkFlag = Boolean(Object.keys(value).length > 1 ||
                                Object.keys(this._query.Where).length > 1);
                            if (this._checkFlag === true) {
                                this._whereChecker = new Business.WhereChecker(this._query.Where);
                            }
                            var key = JsStore.getObjectFirstKey(value);
                            switch (key) {
                                case 'Like':
                                    {
                                        var filter_values = value.Like.split('%'), filter_value, occurence;
                                        if (filter_values[1]) {
                                            filter_value = filter_values[1];
                                            occurence = filter_values.length > 2 ? JsStore.Occurence.Any : JsStore.Occurence.Last;
                                        }
                                        else {
                                            filter_value = filter_values[0];
                                            occurence = JsStore.Occurence.First;
                                        }
                                        if (occurence === JsStore.Occurence.First) {
                                            this.getAllCombinationOfWord(filter_value).forEach(function (item) {
                                                this.executeWhereLogic(column_name, { '-': { Low: item, High: item + '\uffff' } }, '-');
                                            }, this);
                                            delete this._query.Where[column_name]['Like'];
                                        }
                                        else {
                                            this.executeLikeLogic(column_name, filter_value, occurence);
                                        }
                                    }
                                    break;
                                case 'In':
                                    this.executeInLogic(column_name, value['In']);
                                    break;
                                case '-':
                                case '>':
                                case '<':
                                case '>=':
                                case '<=':
                                    this.executeWhereLogic(column_name, value, key);
                                    break;
                                case 'Aggregate': break;
                                default: this.executeWhereLogic(column_name, value);
                            }
                        }
                        else {
                            this._checkFlag = Boolean(Object.keys(this._query.Where).length > 1);
                            if (this._checkFlag === true) {
                                this._whereChecker = new Business.WhereChecker(this._query.Where);
                            }
                            this.executeWhereLogic(column_name, value);
                        }
                    }
                    else {
                        this._errorOccured = true;
                        var column = this.getColumnInfo(column_name), error;
                        if (column == null) {
                            error = new JsStore.Error(JsStore.Error_Type.ColumnNotExist, { ColumnName: column_name }).get();
                        }
                        else {
                            error = new JsStore.Error(JsStore.Error_Type.EnableSearchOff, { ColumnName: column_name }).get();
                        }
                        this.onErrorOccured(error, true);
                    }
                };
                return _this;
            }
            Base.prototype.onErrorOccured = function (e, customError) {
                if (customError === void 0) { customError = false; }
                ++this._errorCount;
                if (this._errorCount === 1) {
                    if (this._onError != null) {
                        if (!customError) {
                            var error = {
                                _message: e.target.error.message,
                                _type: e.target.error.name
                            };
                            this._onError(error);
                            JsStore.logError(error);
                        }
                        else {
                            this._onError(e);
                            JsStore.logError(e);
                        }
                    }
                }
            };
            Base.prototype.onExceptionOccured = function (ex, info) {
                switch (ex.name) {
                    case 'NotFoundError':
                        var error = new JsStore.Error(JsStore.Error_Type.TableNotExist, info);
                        this.onErrorOccured(error.get(), true);
                        break;
                    default: console.error(ex);
                }
            };
            Base.prototype.getColumnInfo = function (columnName) {
                var column_info;
                this.getTable(this._tableName)._columns.every(function (column) {
                    if (column._name === columnName) {
                        column_info = column;
                        return false;
                    }
                    return true;
                });
                return column_info;
            };
            Base.prototype.addGreatAndLessToNotOp = function () {
                var where_query = this._query.Where, value;
                if (this.containsNot(where_query)) {
                    var query_keys = Object.keys(where_query);
                    if (query_keys.length === 1) {
                        query_keys.forEach(function (prop) {
                            value = where_query[prop];
                            if (value['!=']) {
                                where_query[prop]['>'] = value['!='];
                                if (where_query['Or'] === undefined) {
                                    where_query['Or'] = {};
                                    where_query['Or'][prop] = {};
                                }
                                else if (where_query['Or'][prop] === undefined) {
                                    where_query['Or'][prop] = {};
                                }
                                where_query['Or'][prop]['<'] = value['!='];
                                delete where_query[prop]['!='];
                            }
                        });
                        this._query.Where = where_query;
                    }
                    else {
                        var where_tmp = [];
                        query_keys.forEach(function (prop) {
                            value = where_query[prop];
                            var tmp_qry = {};
                            if (value['!=']) {
                                tmp_qry[prop] = {
                                    '>': value['!='],
                                    'Or': {}
                                };
                                tmp_qry[prop]['Or'][prop] = {};
                                tmp_qry[prop]['Or'][prop]['<'] = value['!='];
                            }
                            else {
                                tmp_qry[prop] = value;
                            }
                            where_tmp.push(tmp_qry);
                        });
                        this._query.Where = where_tmp;
                    }
                }
            };
            Base.prototype.makeQryInCaseSensitive = function (qry) {
                var results = [], column_value, key_value;
                for (var column in qry) {
                    column_value = qry[column];
                    if (typeof column_value === 'object') {
                        for (var key in column_value) {
                            key_value = column_value[key];
                            switch (key) {
                                case JsStore.WhereQryOption.In:
                                    results = results.concat(this.getAllCombinationOfWord(key_value, true));
                                    break;
                                case JsStore.WhereQryOption.Like:
                                    break;
                                default:
                                    results = results.concat(this.getAllCombinationOfWord(key_value));
                            }
                        }
                        qry[column]['In'] = results;
                    }
                    else {
                        results = results.concat(this.getAllCombinationOfWord(column_value));
                        qry[column] = {
                            In: results
                        };
                    }
                }
                return qry;
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
            function CreateDb(tablesMetaData, onSuccess, onError) {
                var table_created_list = [], db_request = indexedDB.open(Business.active_db._name, JsStore.db_version);
                db_request.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                db_request.onsuccess = function (event) {
                    JsStore.db_status.ConStatus = JsStore.Connection_Status.Connected;
                    Business.db_connection = db_request.result;
                    Business.db_connection.onclose = function (e) {
                        Business.callDbDroppedByBrowser();
                        JsStore.Utils.updateDbStatus(JsStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                    };
                    Business.db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                            Business.callDbDroppedByBrowser(true);
                            JsStore.Utils.updateDbStatus(JsStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                        }
                    };
                    Business.db_connection.onerror = function (e) {
                        JsStore.db_status.LastError = ("Error occured in connection :" + e.target.result);
                    };
                    Business.db_connection.onabort = function (e) {
                        JsStore.db_status = {
                            ConStatus: JsStore.Connection_Status.Closed,
                            LastError: JsStore.Error_Type.ConnectionAborted
                        };
                    };
                    // save in database list
                    this.saveDbName();
                    if (onSuccess != null) {
                        onSuccess(table_created_list);
                    }
                }.bind(this);
                db_request.onupgradeneeded = function (event) {
                    Business.db_connection = event.target.result;
                    tablesMetaData.forEach(function (item, index) {
                        if (item._requireDelete) {
                            // Delete the old datastore.    
                            if (Business.db_connection.objectStoreNames.contains(item._name)) {
                                Business.db_connection.deleteObjectStore(item._name);
                            }
                            createObjectStore(item, index);
                        }
                        else if (item._requireCreation) {
                            createObjectStore(item, index);
                        }
                    });
                };
                var createObjectStore = function (item, index) {
                    try {
                        if (item._primaryKey.length > 0) {
                            Business.active_db._tables[index]._primaryKey = item._primaryKey;
                            var store = Business.db_connection.createObjectStore(item._name, {
                                keyPath: item._primaryKey
                            });
                            item._columns.forEach(function (column) {
                                if (column._enableSearch === true) {
                                    var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                    options['multiEntry'] = column._multiEntry;
                                    store.createIndex(column._name, column._name, options);
                                    if (column._autoIncrement) {
                                        KeyStore.set("JsStore_" + Business.active_db._name + "_" + item._name +
                                            "_" + column._name + "_Value", 0);
                                    }
                                }
                            });
                        }
                        else {
                            var store = Business.db_connection.createObjectStore(item._name, {
                                autoIncrement: true
                            });
                            item._columns.forEach(function (column) {
                                var options = { unique: column._unique, multiEntry: column._multiEntry };
                                store.createIndex(column._name, column._name, options);
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
            CreateDb.prototype.saveDbName = function () {
                JsStore.getDbList(function (result) {
                    if (result.indexOf(Business.active_db._name) < 0) {
                        result.push(Business.active_db._name);
                        Business.setDbList(result);
                    }
                });
            };
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
            function DropDb(onSuccess, onError) {
                this._onSuccess = onSuccess;
                this._onError = onError;
            }
            DropDb.prototype.deleteMetaData = function () {
                KeyStore.remove('JsStore_' + Business.active_db._name + '_Db_Version');
                Business.active_db._tables.forEach(function (table) {
                    KeyStore.remove("JsStore_" + Business.active_db._name + "_" + table._name + "_Version");
                    table._columns.forEach(function (column) {
                        if (column._autoIncrement) {
                            KeyStore.remove("JsStore_" + Business.active_db._name + "_" + table._name + "_" + column._name + "_Value");
                        }
                    });
                });
                // remove from database_list 
                JsStore.getDbList(function (result) {
                    result.splice(result.indexOf(Business.active_db._name), 1);
                    Business.setDbList(result);
                });
                KeyStore.remove("JsStore_" + Business.active_db._name + "_Schema", this._onSuccess);
            };
            DropDb.prototype.deleteDb = function () {
                setTimeout(function () {
                    var db_drop_request = indexedDB.deleteDatabase(Business.active_db._name);
                    db_drop_request.onblocked = function () {
                        if (this._onError != null) {
                            this._onError("database is blocked, cant be deleted right now.");
                        }
                    }.bind(this);
                    db_drop_request.onerror = function (e) {
                        if (this._onError != null) {
                            this._onError(event.target.error);
                        }
                    }.bind(this);
                    db_drop_request.onsuccess = function () {
                        JsStore.db_status.ConStatus = JsStore.Connection_Status.Closed;
                        this.deleteMetaData();
                    }.bind(this);
                }.bind(this), 100);
            };
            return DropDb;
        }());
        Business.DropDb = DropDb;
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
                _this._query = query;
                _this._onSuccess = onSuccess;
                _this._onError = onError;
                return _this;
            }
            BulkInsert.prototype.execute = function () {
                if (!Array.isArray(this._query.Values)) {
                    this.onErrorOccured(new JsStore.Error(JsStore.Error_Type.NotArray).get(), true);
                }
                else if (this.isTableExist(this._query.Into) === true) {
                    try {
                        this.bulkinsertData();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: this._query.Into });
                    }
                }
                else {
                    var error = new JsStore.Error(JsStore.Error_Type.TableNotExist, { TableName: this._query.Into });
                    error.throw();
                }
            };
            BulkInsert.prototype.bulkinsertData = function () {
                Business.createTransaction([this._query.Into], function (e) {
                    this._onSuccess();
                }.bind(this));
                this._objectStore = Business.db_transaction.objectStore(this._query.Into);
                this._query.Values.forEach(function (value) {
                    this._objectStore.add(value);
                }, this);
            };
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
                this.setPrimaryKey = function () {
                    Business.active_db._tables.forEach(function (table, index) {
                        table._columns.every(function (item) {
                            Business.active_db._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                            return !item._primaryKey;
                        });
                    });
                };
                if (Business.active_db._name.length > 0) {
                    var db_request = indexedDB.open(Business.active_db._name, dbVersion);
                    db_request.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    db_request.onsuccess = function (event) {
                        JsStore.db_status.ConStatus = JsStore.Connection_Status.Connected;
                        Business.db_connection = db_request.result;
                        Business.db_connection.onclose = function (e) {
                            Business.callDbDroppedByBrowser();
                            JsStore.Utils.updateDbStatus(JsStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                        };
                        Business.db_connection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                if (e.newVersion === null) {
                                    e.target.close(); // Manually close our connection to the db
                                    Business.callDbDroppedByBrowser(true);
                                    JsStore.Utils.updateDbStatus(JsStore.Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                                }
                            }
                        };
                        Business.db_connection.onerror = function (e) {
                            JsStore.db_status.LastError = ("Error occured in connection :" + e.target.result);
                        };
                        Business.db_connection.onabort = function (e) {
                            JsStore.db_status.ConStatus = JsStore.Connection_Status.Closed;
                            JsStore.db_status.LastError = JsStore.Error_Type.ConnectionAborted;
                        };
                        if (onSuccess != null) {
                            onSuccess();
                        }
                        this.setPrimaryKey();
                    }.bind(this);
                }
                else {
                    var error = new JsStore.Error(JsStore.Error_Type.UndefinedDbName);
                    error.throw();
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
                _this._query = tableName;
                _this._onSuccess = onSuccess;
                _this._onError = onError;
                return _this;
            }
            Clear.prototype.execute = function () {
                Business.createTransaction([this._query], function (e) {
                    if (this._errorOccured === false) {
                        this._onSuccess();
                    }
                }.bind(this));
                var clear_request = Business.db_transaction.objectStore(this._query).clear();
                clear_request.onsuccess = function (e) {
                    var current_table = this.getTable(this._query);
                    current_table._columns.forEach(function (column) {
                        if (column._autoIncrement) {
                            KeyStore.set("JsStore_" + Business.active_db._name + "_" + this._query + "_" + column._name + "_Value", 0);
                        }
                    }, this);
                }.bind(this);
                clear_request.onerror = function (e) {
                    this._errorOccured = true;
                    this.onErrorOccured(e);
                }.bind(this);
            };
            return Clear;
        }(Business.Base));
        Business.Clear = Clear;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        Business.db_transaction = null, Business.callDbDroppedByBrowser = function (deleteMetaData) {
            if (JsStore.db_status.ConStatus === JsStore.Connection_Status.Connected) {
                Business.is_db_deleted_by_browser = true;
                if (deleteMetaData === true) {
                    var drop_db_object = new Business.DropDb(Business.on_db_dropped_by_browser, null);
                    drop_db_object.deleteMetaData();
                }
            }
        }, Business.createTransaction = function (tableNames, callBack, mode) {
            if (Business.db_transaction === null) {
                mode = mode ? mode : "readwrite";
                Business.db_transaction = Business.db_connection.transaction(tableNames, mode);
                Business.db_transaction.oncomplete = function () {
                    Business.db_transaction = null;
                    callBack();
                };
                Business.db_transaction.ontimeout = function () {
                    Business.db_transaction = null;
                    console.error('transaction timed out');
                };
            }
        }, Business.setDbList = function (list) {
            KeyStore.set('database_list', list);
        };
        var Main = /** @class */ (function () {
            function Main(onSuccess) {
                this._onSuccess = onSuccess;
            }
            Main.prototype.checkConnectionAndExecuteLogic = function (request) {
                JsStore.log('checking connection and executing request:' + request.Name);
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this.executeLogic(request);
                        break;
                    case 'change_log_status':
                        this.changeLogStatus(request.Query['logging']);
                        break;
                    case 'set_config':
                        this.setConfig(request.Query);
                        break;
                    default:
                        switch (JsStore.db_status.ConStatus) {
                            case JsStore.Connection_Status.Connected:
                                {
                                    this.executeLogic(request);
                                }
                                break;
                            case JsStore.Connection_Status.Closed:
                                {
                                    if (Business.is_db_deleted_by_browser === true) {
                                        this.createDb(null, function () {
                                            Business.is_db_deleted_by_browser = false;
                                            this.checkConnectionAndExecuteLogic(request);
                                        }.bind(this), request.OnError);
                                    }
                                    else {
                                        this.openDb(Business.active_db._name, function () {
                                            this.checkConnectionAndExecuteLogic(request);
                                        }.bind(this), request.OnError);
                                    }
                                }
                                break;
                        }
                }
            };
            Main.prototype.changeLogStatus = function (enableLog) {
                JsStore.enable_log = enableLog;
            };
            Main.prototype.setConfig = function (config) {
                for (var prop in config) {
                    switch (prop) {
                        case 'EnableLog':
                            this.changeLogStatus(config[prop]);
                            break;
                        case 'FileName':
                            JsStore.file_name = config[prop];
                            break;
                        case 'OnDbDroppedByBrowser':
                            eval("on_db_dropped_by_browser=" + config.OnDbDroppedByBrowser);
                            break;
                        default:
                            var err = new JsStore.Error(JsStore.Error_Type.InvalidConfig, { Config: prop });
                            err.logError();
                    }
                }
            };
            Main.prototype.returnResult = function (result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
                else {
                    self.postMessage(result);
                }
            };
            Main.prototype.executeLogic = function (request) {
                var onSuccess = function (results) {
                    this.returnResult({
                        ReturnedValue: results
                    });
                }.bind(this), onError = function (err) {
                    this.returnResult({
                        ErrorDetails: err,
                        ErrorOccured: true
                    });
                }.bind(this);
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
                    case 'remove':
                        this.remove(request.Query, onSuccess, onError);
                        break;
                    case 'open_db':
                        if (Business.is_db_deleted_by_browser === true) {
                            this.createDb(null, function () {
                                Business.is_db_deleted_by_browser = false;
                                onSuccess();
                            }.bind(this), onError);
                        }
                        else {
                            this.openDb(request.Query, onSuccess, onError);
                        }
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
                    case 'transaction':
                        this.transaction(request.Query, onSuccess, onError);
                        break;
                    case 'export_json':
                        this.exportJson(request.Query, onSuccess, onError);
                        break;
                    default: console.error('The Api:-' + request.Name + ' does not support.');
                }
            };
            Main.prototype.transaction = function (qry, onSuccess, onError) {
                var transaction_obj = new Business.Transaction(qry, onSuccess, onError);
                transaction_obj.execute();
            };
            Main.prototype.openDb = function (dbName, onSuccess, onError) {
                JsStore.getDbVersion(dbName, function (dbVersion) {
                    if (dbVersion !== 0) {
                        JsStore.getDbSchema(dbName, function (result) {
                            Business.active_db = result;
                            var open_db_object = new Business.OpenDb(dbVersion, onSuccess, onError);
                        });
                    }
                    else {
                        var err = new JsStore.Error(JsStore.Error_Type.DbNotExist, { DbName: dbName });
                        err.logError();
                        onError(err.get());
                    }
                });
            };
            Main.prototype.closeDb = function () {
                if (JsStore.db_status.ConStatus === JsStore.Connection_Status.Connected) {
                    JsStore.db_status.ConStatus = JsStore.Connection_Status.ClosedByJsStore;
                    Business.db_connection.close();
                }
            };
            Main.prototype.dropDb = function (onSuccess, onError) {
                this.closeDb();
                var drop_db_object = new Business.DropDb(onSuccess, onError);
                drop_db_object.deleteDb();
            };
            Main.prototype.update = function (query, onSuccess, onError) {
                var update_db_object = new Business.Update.Instance(query, onSuccess, onError);
                update_db_object.execute();
            };
            Main.prototype.insert = function (query, onSuccess, onError) {
                var insert_object = new Business.Insert.Instance(query, onSuccess, onError);
                insert_object.execute();
            };
            Main.prototype.bulkInsert = function (query, onSuccess, onError) {
                var bulk_insert_object = new Business.BulkInsert(query, onSuccess, onError);
                bulk_insert_object.execute();
            };
            Main.prototype.remove = function (query, onSuccess, onError) {
                var delete_object = new Business.Remove.Instance(query, onSuccess, onError);
                delete_object.execute();
            };
            Main.prototype.select = function (query, onSuccess, onError) {
                if (typeof query.From === 'object') {
                    var select_join_object = new Business.Select.Join(query, onSuccess, onError);
                }
                else {
                    var select_instance = new Business.Select.Instance(query, onSuccess, onError);
                    select_instance.execute();
                }
            };
            Main.prototype.count = function (query, onSuccess, onError) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    var select_join_object = new Business.Select.Join(query, onSuccess, onError);
                }
                else {
                    var count_object = new Business.Count.Instance(query, onSuccess, onError);
                    count_object.execute();
                }
            };
            Main.prototype.createDb = function (dataBase, onSuccess, onError) {
                var processCreateDb = function () {
                    // save dbSchema in keystore
                    KeyStore.set("JsStore_" + Business.active_db._name + "_Schema", Business.active_db);
                    // create meta data
                    var db_helper = new JsStore.Model.DbHelper(Business.active_db);
                    db_helper.createMetaData(function (tablesMetaData) {
                        var create_db_object = new Business.CreateDb(tablesMetaData, onSuccess, onError);
                    });
                };
                if (dataBase == null) {
                    processCreateDb();
                }
                else {
                    this.closeDb();
                    JsStore.getDbVersion(dataBase.Name, function (version) {
                        JsStore.db_version = version ? version : 1;
                        Business.active_db = new JsStore.Model.DataBase(dataBase);
                        processCreateDb();
                    });
                }
            };
            Main.prototype.clear = function (tableName, onSuccess, onError) {
                var clear_object = new Business.Clear(tableName, onSuccess, onError);
                clear_object.execute();
            };
            Main.prototype.exportJson = function (query, onSuccess, onError) {
                this.select(query, function (results) {
                    var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                        type: "text/json"
                    }));
                    onSuccess(url);
                }, function (err) {
                    onError(err);
                });
            };
            return Main;
        }());
        Business.Main = Main;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        /**
         * For matching the different column value existance for where option
         *
         * @export
         * @class WhereChecker
         */
        var WhereChecker = /** @class */ (function () {
            function WhereChecker(where) {
                this._where = where;
            }
            WhereChecker.prototype.check = function (rowValue) {
                this._status = true;
                var column_value;
                for (var columnName in this._where) {
                    if (this._status) {
                        column_value = this._where[columnName];
                        if (typeof column_value === 'object') {
                            for (var key in column_value) {
                                if (this._status) {
                                    switch (key) {
                                        case 'In':
                                            this.checkIn(columnName, rowValue[columnName]);
                                            break;
                                        case 'Like':
                                            this.checkLike(columnName, rowValue[columnName]);
                                            break;
                                        case '-':
                                        case '>':
                                        case '<':
                                        case '>=':
                                        case '<=':
                                        case '!=':
                                            this.checkComparisionOp(columnName, rowValue[columnName], key);
                                            break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        else {
                            if (column_value !== rowValue[columnName]) {
                                this._status = false;
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                return this._status;
            };
            WhereChecker.prototype.checkIn = function (column, value) {
                for (var i = 0, values = this._where[column].In, length = values.length; i < length; i++) {
                    if (values[i] === value) {
                        this._status = true;
                        break;
                    }
                    else {
                        this._status = false;
                    }
                }
            };
            WhereChecker.prototype.checkLike = function (column, value) {
                var values = this._where[column].Like.split('%'), comp_symbol, comp_value, symbol_index;
                if (values[1]) {
                    comp_value = values[1];
                    comp_symbol = values.length > 2 ? JsStore.Occurence.Any : JsStore.Occurence.Last;
                }
                else {
                    comp_value = values[0];
                    comp_symbol = JsStore.Occurence.First;
                }
                value = value.toLowerCase();
                switch (comp_symbol) {
                    case JsStore.Occurence.Any:
                        symbol_index = value.indexOf(comp_value.toLowerCase());
                        if (symbol_index < 0) {
                            this._status = false;
                        }
                        break;
                    case JsStore.Occurence.First:
                        symbol_index = value.indexOf(comp_value.toLowerCase());
                        if (symbol_index > 0 || symbol_index < 0) {
                            this._status = false;
                        }
                        break;
                    default:
                        symbol_index = value.lastIndexOf(comp_value.toLowerCase());
                        if (symbol_index < value.length - comp_value.length) {
                            this._status = false;
                        }
                }
            };
            WhereChecker.prototype.checkComparisionOp = function (column, value, symbol) {
                var compare_value = this._where[column][symbol];
                switch (symbol) {
                    // greater than
                    case '>':
                        if (value <= compare_value) {
                            this._status = false;
                        }
                        break;
                    // less than
                    case '<':
                        if (value >= compare_value) {
                            this._status = false;
                        }
                        break;
                    // less than equal
                    case '<=':
                        if (value > compare_value) {
                            this._status = false;
                        }
                        break;
                    // greather than equal
                    case '>=':
                        if (value < compare_value) {
                            this._status = false;
                        }
                        break;
                    // between
                    case '-':
                        if (value < compare_value.Low || value > compare_value.High) {
                            this._status = false;
                        }
                        break;
                    // Not equal to
                    case '!=':
                        if (value === compare_value) {
                            this._status = false;
                        }
                        break;
                }
            };
            return WhereChecker;
        }());
        Business.WhereChecker = WhereChecker;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Transaction = /** @class */ (function (_super) {
            __extends(Transaction, _super);
            function Transaction(qry, onSuccess, onError) {
                var _this = _super.call(this) || this;
                qry.AbortOnError = qry.AbortOnError ? qry.AbortOnError : true;
                _this._query = qry;
                _this._onSuccess = onSuccess;
                _this._onError = onError;
                return _this;
            }
            Transaction.prototype.execute = function () {
                var request_queue = [], onRequestFinished = function (result) {
                    var finisehd_request = request_queue.shift();
                    if (finisehd_request) {
                        if (this._errorOccured && this._query.AbortOnError === true) {
                            Business.db_transaction.abort();
                        }
                        else {
                            if (finisehd_request.OnSuccess) {
                                finisehd_request.OnSuccess(result);
                            }
                            if (request_queue.length >= 1) {
                                executeRequest(request_queue[0]);
                            }
                        }
                    }
                }.bind(this), executeRequest = function (request) {
                    var request_obj;
                    switch (request.Name) {
                        case 'select':
                            request_obj = new Business.Select.Instance(request.Query, onRequestFinished, this._onError.bind(this));
                            break;
                        case 'insert':
                            request_obj = new Business.Insert.Instance(request.Query, onRequestFinished, this._onError.bind(this));
                            break;
                        case 'update': break;
                        case 'remove': break;
                        case 'count': break;
                    }
                    request_obj._isTransaction = true;
                    request_obj.execute();
                }.bind(this), pushRequest = function (request) {
                    request_queue.push(request);
                    if (request_queue.length === 1) {
                        this.initTransaction(this._query.TableNames);
                        executeRequest(request_queue[0]);
                    }
                }.bind(this), select = function (qry, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'select',
                        OnSuccess: onSuccess,
                        Query: qry
                    });
                };
                var insert = function (qry, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'insert',
                        OnSuccess: onSuccess,
                        Query: qry
                    });
                };
                var update = function (qry, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'update',
                        OnSuccess: onSuccess,
                        Query: qry
                    });
                };
                var remove = function (qry, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'remove',
                        OnSuccess: onSuccess,
                        Query: qry
                    });
                };
                var count = function (qry, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'count',
                        OnSuccess: onSuccess,
                        Query: qry
                    });
                };
                eval("var tx_logic =" + this._query.Logic);
                tx_logic.call(this, this._query.Data);
                this._query.Data = this._query.Logic = null;
            };
            Transaction.prototype.initTransaction = function (tableNames) {
                Business.createTransaction(tableNames, this.onTransactionCompleted.bind(this));
            };
            Transaction.prototype.onTransactionCompleted = function () {
                this._onSuccess(this._results);
            };
            return Transaction;
        }(Business.Base));
        Business.Transaction = Transaction;
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
                    _this._results = [];
                    _this._sorted = false;
                    _this._checkFlag = false;
                    return _this;
                }
                BaseSelect.prototype.removeDuplicates = function () {
                    var datas = this._results;
                    // free results memory
                    this._results = undefined;
                    var key = this.getPrimaryKey(this._query.From);
                    var lookupObject = {};
                    for (var i in datas) {
                        lookupObject[datas[i][key]] = datas[i];
                    }
                    // free datas memory
                    datas = [];
                    for (i in lookupObject) {
                        datas.push(lookupObject[i]);
                    }
                    this._results = datas;
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NotWhere.prototype.executeWhereUndefinedLogic = function () {
                    if (this._query.Order && this._query.Order.By) {
                        if (this._objectStore.indexNames.contains(this._query.Order.By)) {
                            var order_type = this._query.Order.Type &&
                                this._query.Order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                            this._sorted = true;
                            this._cursorOpenRequest = this._objectStore.index(this._query.Order.By).
                                openCursor(null, order_type);
                        }
                        else {
                            var error = new JsStore.Error(JsStore.Error_Type.ColumnNotExist, { ColumnName: this._query.Order.By });
                            error.throw();
                        }
                    }
                    else {
                        this._cursorOpenRequest = this._objectStore.openCursor();
                    }
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForNoWhere();
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForNoWhere();
                    }
                    else if (this._limitRecord) {
                        this.executeLimitForNotWhere();
                    }
                    else {
                        this.executeSimpleForNotWhere();
                    }
                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
                NotWhere.prototype.executeSkipAndLimitForNoWhere = function () {
                    var record_skipped = false, cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (record_skipped && this._results.length !== this._limitRecord) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                record_skipped = true;
                                cursor.advance(this._skipRecord);
                            }
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };
                NotWhere.prototype.executeSkipForNoWhere = function () {
                    var record_skipped = false, cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (record_skipped) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                record_skipped = true;
                                cursor.advance(this._skipRecord);
                            }
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };
                NotWhere.prototype.executeSimpleForNotWhere = function () {
                    var cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            this._results.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };
                NotWhere.prototype.executeLimitForNotWhere = function () {
                    var cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor && this._results.length !== this._limitRecord) {
                            this._results.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                In.prototype.executeInLogic = function (column, values) {
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForIn(column, values);
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForIn(column, values);
                    }
                    else if (this._limitRecord) {
                        this.executeLimitForIn(column, values);
                    }
                    else {
                        this.executeSimpleForIn(column, values);
                    }
                };
                In.prototype.executeSkipAndLimitForIn = function (column, values) {
                    var cursor, skip = this._skipRecord, column_store = this._objectStore.index(column), cursor_request, skipOrPush = function (value) {
                        if (skip === 0) {
                            this._results.push(value);
                        }
                        else {
                            --skip;
                        }
                    }.bind(this), onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (this._results.length !== this._limitRecord && cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            skipOrPush(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (this._results.length !== this._limitRecord && cursor) {
                                        skipOrPush(cursor.value);
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
                In.prototype.executeSkipForIn = function (column, values) {
                    var cursor, skip = this._skipRecord, cursor_request, column_store = this._objectStore.index(column), skipOrPush = function (value) {
                        if (skip === 0) {
                            this._results.push(value);
                        }
                        else {
                            --skip;
                        }
                    }.bind(this), onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            skipOrPush((cursor.value));
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        skipOrPush((cursor.value));
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
                In.prototype.executeLimitForIn = function (column, values) {
                    var cursor, cursor_request, column_store = this._objectStore.index(column), onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor && this._results.length !== this._limitRecord) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            this._results.push(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor && this._results.length !== this._limitRecord) {
                                        this._results.push(cursor.value);
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
                In.prototype.executeSimpleForIn = function (column, values) {
                    var cursor, cursor_request, column_store = this._objectStore.index(column), onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            this._results.push(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        this._results.push(cursor.value);
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Like.prototype.executeLikeLogic = function (column, value, symbol) {
                    this._compValue = value.toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    this._cursorOpenRequest = this._objectStore.index(column).openCursor();
                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimit();
                    }
                    else if (this._skipRecord) {
                        this.executeSkip();
                    }
                    else if (this._limitRecord) {
                        this.executeLimit();
                    }
                    else {
                        this.executeSimple();
                    }
                };
                Like.prototype.executeSkipAndLimit = function () {
                    var cursor, skip = this._skipRecord, skipOrPush = function (value) {
                        if (skip === 0) {
                            this._results.push(value);
                        }
                        else {
                            --skip;
                        }
                    }.bind(this);
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    skipOrPush(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    skipOrPush(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Like.prototype.executeSkip = function () {
                    var cursor, skip = this._skipRecord, skipOrPush = function (value) {
                        if (skip === 0) {
                            this._results.push(value);
                        }
                        else {
                            --skip;
                        }
                    }.bind(this);
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    skipOrPush((cursor.value));
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    skipOrPush((cursor.value));
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Like.prototype.executeLimit = function () {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Like.prototype.executeSimple = function () {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Where.prototype.executeSkipAndLimitForWhere = function () {
                    var record_skipped = false, cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped && this._results.length !== this._limitRecord) {
                                    if (this._whereChecker.check(cursor.value)) {
                                        this._results.push(cursor.value);
                                    }
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped && this._results.length !== this._limitRecord) {
                                    this._results.push(cursor.value);
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Where.prototype.executeSkipForWhere = function () {
                    var record_skipped = false, cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped) {
                                    if (this._whereChecker.check(cursor.value)) {
                                        this._results.push(cursor.value);
                                    }
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped) {
                                    this._results.push(cursor.value);
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Where.prototype.executeLimitForWhere = function () {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor && this._results.length !== this._limitRecord &&
                                this._whereChecker.check(cursor.value)) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor && this._results.length !== this._limitRecord) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Where.prototype.executeSimpleForWhere = function () {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this._whereChecker.check(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                Where.prototype.executeWhereLogic = function (column, value, op, dir) {
                    value = op ? value[op] : value;
                    this._cursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op), dir);
                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForWhere();
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForWhere();
                    }
                    else if (this._limitRecord) {
                        this.executeLimitForWhere();
                    }
                    else {
                        this.executeSimpleForWhere();
                    }
                };
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
                    _this._queryStack = [];
                    _this._currentQueryStackIndex = 0;
                    _this._onSuccess = onSuccess;
                    _this._onError = onError;
                    _this._query = query;
                    var table_list = []; // used to open the multiple object store
                    var convertQueryIntoStack = function (qry) {
                        if (qry.hasOwnProperty('Table1')) {
                            qry.Table2['JoinType'] = qry.Join === undefined ?
                                'inner' : qry.Join.toLowerCase();
                            this._queryStack.push(qry.Table2);
                            if (this._queryStack.length % 2 === 0) {
                                this._queryStack[this._queryStack.length - 1].NextJoin = qry.NextJoin;
                            }
                            table_list.push(qry.Table2.Table);
                            return convertQueryIntoStack(qry.Table1);
                        }
                        else {
                            this._queryStack.push(qry);
                            table_list.push(qry.Table);
                            return;
                        }
                    }.bind(_this);
                    convertQueryIntoStack(query.From);
                    _this._queryStack.reverse();
                    // get the data for first table
                    if (!_this._errorOccured) {
                        var select_object = new Select.Instance({
                            From: _this._queryStack[0].Table,
                            Where: _this._queryStack[0].Where
                        }, function (results) {
                            var table_name = this._queryStack[0].Table;
                            results.forEach(function (item, index) {
                                this._results[index] = {};
                                this._results[index][table_name] = item;
                            }, this);
                            this.startExecutionJoinLogic();
                        }.bind(_this), _this.onErrorOccured.bind(_this));
                        select_object.execute();
                    }
                    return _this;
                }
                Join.prototype.onTransactionCompleted = function (e) {
                    if (this._onSuccess != null && (this._queryStack.length === this._currentQueryStackIndex + 1)) {
                        if (this._query['Count']) {
                            this._onSuccess(this._results.length);
                        }
                        else {
                            if (this._query['Skip'] && this._query['Limit']) {
                                this._results.splice(0, this._query['Skip']);
                                this._results.splice(this._query['Limit'] - 1, this._results.length);
                            }
                            else if (this._query['Skip']) {
                                this._results.splice(0, this._query['Skip']);
                            }
                            else if (this._query['Limit']) {
                                this._results.splice(this._query['Limit'] - 1, this._results.length);
                            }
                            this._onSuccess(this._results);
                        }
                    }
                };
                Join.prototype.executeWhereJoinLogic = function (joinQuery, query) {
                    var results = [], join_index = 0, column = query.Column, tmp_results = this._results, item, result_length = tmp_results.length;
                    // get the data from query table
                    var select_object = new Select.Instance({
                        From: query.Table,
                        Order: query.Order,
                        Where: query.Where
                    }, function (selectResults) {
                        // perform join
                        selectResults.forEach(function (value, index) {
                            // search item through each global result
                            for (var i = 0; i < result_length; i++) {
                                item = tmp_results[i][joinQuery.Table][joinQuery.Column];
                                doJoin(item, value, i);
                            }
                        });
                        this._results = results;
                        // check if further execution needed
                        if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                            this.startExecutionJoinLogic();
                        }
                        else {
                            this.onTransactionCompleted(null);
                        }
                    }.bind(this), this.onErrorOccured.bind(this));
                    select_object.execute();
                    var doJoin = function (value1, value2, itemIndex) {
                        results[join_index] = {};
                        if (value1 === value2[query.Column]) {
                            results[join_index][query.Table] = value2;
                            // copy other relative data into current result
                            for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                results[join_index][this._queryStack[j].Table] =
                                    tmp_results[itemIndex][this._queryStack[j].Table];
                            }
                            ++join_index;
                        }
                        else if (query.JoinType === 'left') {
                            // left join
                            results[join_index] = {};
                            results[join_index][query.Table] = null;
                            // copy other relative data into current result
                            for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                results[join_index][this._queryStack[j].Table] =
                                    tmp_results[itemIndex][this._queryStack[j].Table];
                            }
                            // results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                            ++join_index;
                        }
                    }.bind(this);
                };
                Join.prototype.executeRightJoin = function (joinQuery, query) {
                    var join_results = [], join_index = 0, column = query.Column, tmp_results = this._results, result_length = tmp_results.length, item_index = 0, where = {}, onExecutionFinished = function () {
                        this._results = join_results;
                        // check if further execution needed
                        if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                            this.startExecutionJoinLogic();
                        }
                        else {
                            this.onTransactionCompleted(null);
                        }
                    }.bind(this), doRightJoin = function (results) {
                        var value_found = false;
                        results.forEach(function (item, index) {
                            for (item_index = 0; item_index < result_length; item_index++) {
                                if (item[query.Column] ===
                                    tmp_results[item_index][joinQuery.Table][joinQuery.Column]) {
                                    value_found = true;
                                    break;
                                }
                            }
                            join_results[index] = {};
                            join_results[index][query.Table] = item;
                            if (value_found) {
                                value_found = false;
                                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                    join_results[index][this._queryStack[j].Table] =
                                        tmp_results[item_index][this._queryStack[j].Table];
                                }
                            }
                            else {
                                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                    join_results[index][this._queryStack[j].Table] = null;
                                }
                            }
                        }, this);
                    }.bind(this), executeLogic = function () {
                        var select_object = new Select.Instance({
                            From: query.Table,
                            Order: query.Order,
                            Where: query.Where
                        }, function (results) {
                            doRightJoin(results);
                            onExecutionFinished();
                        }.bind(this), this.onErrorOccured.bind(this));
                        select_object.execute();
                    }.bind(this);
                    executeLogic();
                };
                Join.prototype.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
                    var join_results = [], join_index = 0, column = query.Column, tmp_results = this._results, 
                    // Item,
                    result_length = tmp_results.length, item_index = 0, where = {}, onExecutionFinished = function () {
                        this._results = join_results;
                        // check if further execution needed
                        if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                            this.startExecutionJoinLogic();
                        }
                        else {
                            this.onTransactionCompleted(null);
                        }
                    }.bind(this), doJoin = function (results) {
                        if (results.length > 0) {
                            results.forEach(function (value) {
                                join_results[join_index] = {};
                                join_results[join_index][query.Table] = value;
                                // copy other relative data into current result
                                for (var k = 0; k < this._currentQueryStackIndex; k++) {
                                    join_results[join_index][this._queryStack[k].Table] =
                                        tmp_results[item_index][this._queryStack[k].Table];
                                }
                                ++join_index;
                            }, this);
                        }
                        else if (query.JoinType === 'left') {
                            // left join
                            join_results[join_index] = {};
                            join_results[join_index][query.Table] = null;
                            // copy other relative data into current result
                            for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                join_results[join_index][this._queryStack[j].Table] =
                                    tmp_results[item_index][this._queryStack[j].Table];
                            }
                            ++join_index;
                        }
                    }.bind(this), executeLogic = function () {
                        if (item_index < result_length) {
                            if (!this._errorOccured) {
                                where[query.Column] = tmp_results[item_index][joinQuery.Table][joinQuery.Column];
                                var select_object = new Select.Instance({
                                    From: query.Table,
                                    Order: query.Order,
                                    Where: where
                                }, function (results) {
                                    doJoin(results);
                                    ++item_index;
                                    executeLogic();
                                }.bind(this), this.onErrorOccured.bind(this));
                                select_object.execute();
                            }
                        }
                        else {
                            onExecutionFinished();
                        }
                    }.bind(this);
                    executeLogic();
                };
                Join.prototype.startExecutionJoinLogic = function () {
                    var join_query;
                    if (this._currentQueryStackIndex >= 1 && this._currentQueryStackIndex % 2 === 1) {
                        join_query = {
                            Column: this._queryStack[this._currentQueryStackIndex].NextJoin.Column,
                            Table: this._queryStack[this._currentQueryStackIndex].NextJoin.Table
                        };
                        this._currentQueryStackIndex++;
                    }
                    else {
                        join_query = this._queryStack[this._currentQueryStackIndex++];
                    }
                    var query = this._queryStack[this._currentQueryStackIndex];
                    if (query.JoinType === 'right') {
                        this.executeRightJoin(join_query, query);
                    }
                    else if (query.Where) {
                        this.executeWhereJoinLogic(join_query, query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(join_query, query);
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
                    return _super.call(this) || this;
                }
                GroupByHelper.prototype.processGroupBy = function () {
                    var grp_qry = this._query.GroupBy, datas = this._results, look_up_obj = {};
                    // free results memory
                    this._results = this._query.GroupBy = undefined;
                    if (typeof grp_qry === 'string') {
                        for (var i in datas) {
                            look_up_obj[datas[i][grp_qry]] = datas[i];
                        }
                    }
                    else {
                        var obj_key;
                        for (var i in datas) {
                            obj_key = "";
                            for (var column in grp_qry) {
                                obj_key += datas[i][grp_qry[column]];
                            }
                            look_up_obj[obj_key] = datas[i];
                        }
                    }
                    // free datas memory
                    datas = [];
                    for (i in look_up_obj) {
                        datas.push(look_up_obj[i]);
                    }
                    this._results = datas;
                };
                GroupByHelper.prototype.executeAggregateGroupBy = function () {
                    var grp_qry = this._query.GroupBy, datas = this._results, look_up_obj = {}, 
                    // assign aggregate and free aggregate memory
                    aggregate_qry = this._query.Aggregate;
                    this._query.Aggregate = undefined;
                    // free results memory
                    this._results = undefined;
                    var index, obj_Key, value, aggr_column;
                    var calculateAggregate = function () {
                        for (var prop in aggregate_qry) {
                            switch (prop) {
                                case 'Count':
                                    var getCount = function () {
                                        value = look_up_obj[obj_Key];
                                        // get old value
                                        value = value ? value["Count(" + aggr_column + ")"] : 0;
                                        // add with old value if data exist
                                        value += datas[index][aggr_column] ? 1 : 0;
                                        return value;
                                    };
                                    if (typeof aggregate_qry[prop] === 'string') {
                                        aggr_column = aggregate_qry[prop];
                                        datas[index]["Count(" + aggr_column + ")"] = getCount();
                                    }
                                    else if (Array.isArray(aggregate_qry[prop])) {
                                        for (var item in aggregate_qry[prop]) {
                                            aggr_column = aggregate_qry[prop][item];
                                            datas[index]["Count(" + aggr_column + ")"] = getCount();
                                        }
                                    }
                                    break;
                                case 'Max':
                                    var getMax = function () {
                                        value = look_up_obj[obj_Key];
                                        // get old value
                                        value = value ? value["Max(" + aggr_column + ")"] : 0;
                                        datas[index][aggr_column] = datas[index][aggr_column] ?
                                            datas[index][aggr_column] : 0;
                                        // compare between old value and new value
                                        return value > datas[index][aggr_column] ? value : datas[index][aggr_column];
                                    };
                                    if (typeof aggregate_qry[prop] === 'string') {
                                        aggr_column = aggregate_qry[prop];
                                        datas[index]["Max(" + aggr_column + ")"] = getMax();
                                    }
                                    else if (Array.isArray(aggregate_qry[prop])) {
                                        for (var item in aggregate_qry[prop]) {
                                            aggr_column = aggregate_qry[prop][item];
                                            datas[index]["Max(" + aggr_column + ")"] = getMax();
                                        }
                                    }
                                    break;
                                case 'Min':
                                    var getMin = function () {
                                        value = look_up_obj[obj_Key];
                                        // get old value
                                        value = value ? value["Min(" + aggr_column + ")"] : Infinity;
                                        datas[index][aggr_column] = datas[index][aggr_column] ?
                                            datas[index][aggr_column] : Infinity;
                                        // compare between old value and new value
                                        return value < datas[index][aggr_column] ? value : datas[index][aggr_column];
                                    };
                                    if (typeof aggregate_qry[prop] === 'string') {
                                        aggr_column = aggregate_qry[prop];
                                        datas[index]["Min(" + aggr_column + ")"] = getMin();
                                    }
                                    else if (Array.isArray(aggregate_qry[prop])) {
                                        for (var item in aggregate_qry[prop]) {
                                            aggr_column = aggregate_qry[prop][item];
                                            datas[index]["Min(" + aggr_column + ")"] = getMin();
                                        }
                                    }
                                    break;
                                case 'Sum':
                                    var getSum = function () {
                                        value = look_up_obj[obj_Key];
                                        // get old value
                                        value = value ? value["Sum(" + aggr_column + ")"] : 0;
                                        // add with old value if data exist
                                        value += datas[index][aggr_column] ? datas[index][aggr_column] : 0;
                                        return value;
                                    };
                                    if (typeof aggregate_qry[prop] === 'string') {
                                        aggr_column = aggregate_qry[prop];
                                        datas[index]["Sum(" + aggr_column + ")"] = getSum();
                                    }
                                    else if (Array.isArray(aggregate_qry[prop])) {
                                        for (var item in aggregate_qry[prop]) {
                                            aggr_column = aggregate_qry[prop][item];
                                            datas[index]["Sum(" + aggr_column + ")"] = getSum();
                                        }
                                    }
                                    break;
                                case 'Avg':
                                    var getAvg = function () {
                                        value = look_up_obj[obj_Key];
                                        // get old sum value
                                        var sum_of_column = value ? value["Sum(" + aggr_column + ")"] : 0;
                                        // add with old value if data exist
                                        sum_of_column += datas[index][aggr_column] ? datas[index][aggr_column] : 0;
                                        datas[index]["Sum(" + aggr_column + ")"] = sum_of_column;
                                        // get old count value
                                        value = value ? value["Count(" + aggr_column + ")"] : 0;
                                        // add with old value if data exist
                                        value += datas[index][aggr_column] ? 1 : 0;
                                        datas[index]["Count(" + aggr_column + ")"] = value;
                                    };
                                    if (typeof aggregate_qry[prop] === 'string') {
                                        aggr_column = aggregate_qry[prop];
                                        getAvg();
                                    }
                                    else if (Array.isArray(aggregate_qry[prop])) {
                                        for (var item in aggregate_qry[prop]) {
                                            aggr_column = aggregate_qry[prop][item];
                                            getAvg();
                                        }
                                    }
                                    break;
                            }
                        }
                    };
                    if (typeof grp_qry === 'string') {
                        for (index in datas) {
                            obj_Key = datas[index][grp_qry];
                            calculateAggregate();
                            look_up_obj[obj_Key] = datas[index];
                        }
                    }
                    else {
                        for (index in datas) {
                            obj_Key = "";
                            for (var column in grp_qry) {
                                obj_Key += datas[index][grp_qry[column]];
                            }
                            calculateAggregate();
                            look_up_obj[obj_Key] = datas[index];
                        }
                    }
                    // free datas memory
                    datas = [];
                    for (var i in look_up_obj) {
                        datas.push(look_up_obj[i]);
                    }
                    // Checking for avg and if exist then fill the datas;
                    if (aggregate_qry.Avg) {
                        if (typeof aggregate_qry.Avg === 'string') {
                            for (index in datas) {
                                var sum_for_avg = datas[index]["Sum(" + aggregate_qry.Avg + ")"], count_for_avg = datas[index]["Count(" + aggregate_qry.Avg + ")"];
                                datas[index]["Avg(" + aggregate_qry.Avg + ")"] = sum_for_avg / count_for_avg;
                                if (aggregate_qry.Count !== aggregate_qry.Avg) {
                                    delete datas[index]["Count(" + aggregate_qry.Avg + ")"];
                                }
                                if (aggregate_qry.Sum !== aggregate_qry.Avg) {
                                    delete datas[index]["Sum(" + aggregate_qry.Avg + ")"];
                                }
                            }
                        }
                        else {
                            var is_count_type_string = typeof aggregate_qry.Count, is_sum_type_string = typeof aggregate_qry.Count;
                            for (index in datas) {
                                for (var column in aggregate_qry.Avg) {
                                    var avg_column = aggregate_qry.Avg[column], sum = datas[index]["Sum(" + avg_column + ")"], count = datas[index]["Count(" + avg_column + ")"];
                                    datas[index]["Avg(" + avg_column + ")"] = sum / count;
                                    if (is_count_type_string) {
                                        if (aggregate_qry.Count !== avg_column) {
                                            delete datas[index]["Count(" + avg_column + ")"];
                                        }
                                        else if (aggregate_qry.Count.indexOf(avg_column) === -1) {
                                            delete datas[index]["Count(" + avg_column + ")"];
                                        }
                                    }
                                    if (is_sum_type_string) {
                                        if (aggregate_qry.Sum !== avg_column) {
                                            delete datas[index]["Sum(" + avg_column + ")"];
                                        }
                                        else if (aggregate_qry.Sum.indexOf(avg_column) === -1) {
                                            delete datas[index]["Sum(" + avg_column + ")"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this._results = datas;
                };
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
                    return _super.call(this) || this;
                }
                Helper.prototype.processOrderBy = function () {
                    var Order = this._query.Order;
                    if (Order && this._results.length > 0 && !this._sorted && Order.By) {
                        Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
                        var order_column = Order.By, sortNumberInAsc = function () {
                            this._results.sort(function (a, b) {
                                return a[order_column] - b[order_column];
                            });
                        }.bind(this), sortNumberInDesc = function () {
                            this._results.sort(function (a, b) {
                                return b[order_column] - a[order_column];
                            });
                        }.bind(this), sortAlphabetInAsc = function () {
                            this._results.sort(function (a, b) {
                                return a[order_column].toLowerCase().localeCompare(b[order_column].toLowerCase());
                            });
                        }.bind(this), sortAlphabetInDesc = function () {
                            this._results.sort(function (a, b) {
                                return b[order_column].toLowerCase().localeCompare(a[order_column].toLowerCase());
                            });
                        }.bind(this);
                        if (typeof this._results[0][order_column] === 'string') {
                            if (Order.Type === 'asc') {
                                sortAlphabetInAsc();
                            }
                            else {
                                sortAlphabetInDesc();
                            }
                        }
                        else if (typeof this._results[0][order_column] === 'number') {
                            if (Order.Type === 'asc') {
                                sortNumberInAsc();
                            }
                            else {
                                sortNumberInDesc();
                            }
                        }
                    }
                };
                Helper.prototype.processAggregateQry = function () {
                    var datas = this._results, results = {}, column_to_aggregate;
                    // free results memory
                    this._results = undefined;
                    for (var prop in this._query.Aggregate) {
                        switch (prop) {
                            case 'Count':
                                var getCount = function () {
                                    var result = 0;
                                    for (var i in datas) {
                                        result += datas[i][column_to_aggregate] ? 1 : 0;
                                    }
                                    return result;
                                };
                                if (typeof this._query.Aggregate[prop] === 'string') {
                                    column_to_aggregate = this._query.Aggregate[prop];
                                    results["Count(" + column_to_aggregate + ")"] = getCount();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        column_to_aggregate = this._query.Aggregate[prop][key];
                                        results["Count(" + column_to_aggregate + ")"] = getCount();
                                    }
                                }
                                break;
                            case 'Max':
                                var getMax = function () {
                                    var result = 0;
                                    for (var i in datas) {
                                        result = result > datas[i][column_to_aggregate] ?
                                            result : datas[i][column_to_aggregate];
                                    }
                                    return result;
                                };
                                if (typeof this._query.Aggregate[prop] === 'string') {
                                    column_to_aggregate = this._query.Aggregate[prop];
                                    results["Max(" + column_to_aggregate + ")"] = getMax();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        column_to_aggregate = this._query.Aggregate[prop][key];
                                        results["Max(" + column_to_aggregate + ")"] = getMax();
                                    }
                                }
                                break;
                            case 'Min':
                                var getMin = function () {
                                    var result = Infinity, value = Infinity;
                                    for (var i in datas) {
                                        value = datas[i][column_to_aggregate] ?
                                            datas[i][column_to_aggregate] : Infinity;
                                        result = result < value ? result : value;
                                    }
                                    return result;
                                };
                                if (typeof this._query.Aggregate[prop] === 'string') {
                                    column_to_aggregate = this._query.Aggregate[prop];
                                    results["Min(" + column_to_aggregate + ")"] = getMin();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        column_to_aggregate = this._query.Aggregate[prop][key];
                                        results["Min(" + column_to_aggregate + ")"] = getMin();
                                    }
                                }
                                break;
                            case 'Sum':
                                var getSum = function () {
                                    var result = 0;
                                    for (var i in datas) {
                                        result += datas[i][column_to_aggregate];
                                    }
                                    return result;
                                };
                                if (typeof this._query.Aggregate[prop] === 'string') {
                                    column_to_aggregate = this._query.Aggregate[prop];
                                    results["Sum(" + column_to_aggregate + ")"] = getSum();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        column_to_aggregate = this._query.Aggregate[prop][key];
                                        results["Sum(" + column_to_aggregate + ")"] = getSum();
                                    }
                                }
                                break;
                            case 'Avg':
                                var getAvg = function () {
                                    var result = 0;
                                    for (var i in datas) {
                                        result += datas[i][column_to_aggregate];
                                    }
                                    return result / datas.length;
                                };
                                if (typeof this._query.Aggregate[prop] === 'string') {
                                    column_to_aggregate = this._query.Aggregate[prop];
                                    results["Avg(" + column_to_aggregate + ")"] = getAvg();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        column_to_aggregate = this._query.Aggregate[prop][key];
                                        results["Avg(" + column_to_aggregate + ")"] = getAvg();
                                    }
                                }
                                break;
                        }
                    }
                    // add results to the first index of result
                    for (var prop in results) {
                        datas[0][prop] = results[prop];
                    }
                    this._results = datas;
                };
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
                    _this._onError = onError;
                    _this._onSuccess = onSuccess;
                    _this._query = query;
                    _this._skipRecord = _this._query.Skip;
                    _this._limitRecord = _this._query.Limit;
                    _this._tableName = _this._query.From;
                    return _this;
                }
                Instance.prototype.execute = function () {
                    if (this.isTableExist(this._tableName) === true) {
                        try {
                            if (this._query.Where !== undefined) {
                                this.addGreatAndLessToNotOp();
                                this.initTransaction();
                                if (Array.isArray(this._query.Where)) {
                                    this.processWhereArrayQry();
                                }
                                else {
                                    this.processWhere();
                                }
                            }
                            else {
                                this.initTransaction();
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        catch (ex) {
                            this._errorOccured = true;
                            this.onExceptionOccured.call(this, ex, { TableName: this._query.From });
                        }
                    }
                    else {
                        this._errorOccured = true;
                        this.onErrorOccured(new JsStore.Error(JsStore.Error_Type.TableNotExist, { TableName: this._query.From }).get(), true);
                    }
                };
                Instance.prototype.processWhereArrayQry = function () {
                    this._isArrayQry = true;
                    var is_first_where = true, where_query = this._query.Where, output = [], operation, pKey = this.getPrimaryKey(this._query.From), isItemExist = function (keyValue) {
                        var is_exist = false;
                        output.every(function (item) {
                            if (item[pKey] === keyValue) {
                                is_exist = true;
                                return false;
                            }
                            return true;
                        });
                        return is_exist;
                    }, onSuccess = function () {
                        if (operation === 'and') {
                            var doAnd = function () {
                                var and_results = [];
                                this._results.forEach(function (item) {
                                    if (isItemExist(item[pKey])) {
                                        and_results.push(item);
                                    }
                                });
                                output = and_results;
                                and_results = null;
                            }.bind(this);
                            if (output.length > 0) {
                                doAnd();
                            }
                            else if (is_first_where === true) {
                                output = this._results;
                            }
                            else {
                                doAnd();
                            }
                        }
                        else {
                            if (output.length > 0) {
                                this._results = output.concat(this._results);
                                this.removeDuplicates();
                                output = this._results;
                            }
                            else {
                                output = this._results;
                            }
                        }
                        if (where_query.length > 0) {
                            this._results = [];
                            processFirstQry();
                        }
                        else {
                            this._results = output;
                        }
                        is_first_where = false;
                    }.bind(this), processFirstQry = function () {
                        this._query.Where = where_query.shift();
                        if (this._query.Where['Or']) {
                            if (Object.keys(this._query.Where).length === 1) {
                                operation = 'or';
                                this._query.Where = this._query.Where['Or'];
                                this._onWhereArrayQrySuccess = onSuccess;
                            }
                            else {
                                operation = 'and';
                                this._onWhereArrayQrySuccess = onSuccess;
                            }
                        }
                        else {
                            operation = 'and';
                            this._onWhereArrayQrySuccess = onSuccess;
                        }
                        this.processWhere();
                    }.bind(this);
                    processFirstQry();
                };
                Instance.prototype.onQueryFinished = function () {
                    if (this._isOr === true) {
                        this.orQuerySuccess();
                    }
                    else if (this._isArrayQry === true) {
                        this._onWhereArrayQrySuccess();
                    }
                    else if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                };
                Instance.prototype.initTransaction = function () {
                    Business.createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                    this._objectStore = Business.db_transaction.objectStore(this._query.From);
                };
                Instance.prototype.processWhere = function () {
                    if (this._query.Where.Or) {
                        this.processOrLogic();
                    }
                    this.goToWhereLogic();
                };
                Instance.prototype.onTransactionCompleted = function () {
                    if (this._errorOccured === false) {
                        this.processOrderBy();
                        if (this._query.Distinct) {
                            var group_by = [];
                            var result = this._results[0];
                            for (var key in result) {
                                group_by.push(key);
                            }
                            var primary_key = this.getPrimaryKey(this._query.From), index = group_by.indexOf(primary_key);
                            group_by.splice(index, 1);
                            this._query.GroupBy = group_by.length > 0 ? group_by : null;
                        }
                        if (this._query.GroupBy) {
                            if (this._query.Aggregate) {
                                this.executeAggregateGroupBy();
                            }
                            else {
                                this.processGroupBy();
                            }
                        }
                        else if (this._query.Aggregate) {
                            this.processAggregateQry();
                        }
                        this._onSuccess(this._results);
                    }
                };
                Instance.prototype.orQueryFinish = function () {
                    this._isOr = false;
                    this._results = this._orInfo.Results;
                    // free or info memory
                    this._orInfo = undefined;
                    this.removeDuplicates();
                    this.onQueryFinished();
                };
                Instance.prototype.orQuerySuccess = function () {
                    this._orInfo.Results = this._orInfo.Results.concat(this._results);
                    if (!this._query.Limit || (this._query.Limit > this._orInfo.Results.length)) {
                        this._results = [];
                        var key = JsStore.getObjectFirstKey(this._orInfo.OrQuery);
                        if (key != null) {
                            var where = {};
                            where[key] = this._orInfo.OrQuery[key];
                            delete this._orInfo.OrQuery[key];
                            this._query.Where = where;
                            this.goToWhereLogic();
                        }
                        else {
                            this.orQueryFinish();
                        }
                    }
                    else {
                        this.orQueryFinish();
                    }
                };
                Instance.prototype.processOrLogic = function () {
                    this._isOr = true;
                    this._orInfo = {
                        OrQuery: this._query.Where.Or,
                        Results: []
                    };
                    // free or memory
                    delete this._query.Where.Or;
                };
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
                    _this._resultCount = 0;
                    _this._checkFlag = false;
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NotWhere.prototype.executeWhereUndefinedLogic = function () {
                    if (this._objectStore.count) {
                        var count_request = this._objectStore.count();
                        count_request.onsuccess = function () {
                            this._resultCount = count_request.result;
                            this.onQueryFinished();
                        }.bind(this);
                        count_request.onerror = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    }
                    else {
                        var cursor, cursor_request = this._objectStore.openCursor();
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this._resultCount;
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                        cursor_request.onerror = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                In.prototype.executeInLogic = function (column, values) {
                    var cursor, column_store = this._objectStore.index(column), cursor_request, onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            ++this._resultCount;
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        if (this._objectStore.count) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!this._errorOccured) {
                                    cursor_request = column_store.count(IDBKeyRange.only(values[i]));
                                    cursor_request.onsuccess = function (e) {
                                        this._resultCount += e.target.result;
                                        if (i + 1 === length) {
                                            this.onQueryFinished();
                                        }
                                    }.bind(this);
                                    cursor_request.onerror = onCursorError;
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!this._errorOccured) {
                                    cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                    cursor_request.onsuccess = function (e) {
                                        cursor = e.target.result;
                                        if (cursor) {
                                            ++this._resultCount;
                                            cursor.continue();
                                        }
                                        else if (i + 1 === length) {
                                            this.onQueryFinished();
                                        }
                                    }.bind(this);
                                    cursor_request.onerror = onCursorError;
                                }
                            }
                        }
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Like.prototype.executeLikeLogic = function (column, value, symbol) {
                    var cursor;
                    this._compValue = value.toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    var cursor_request = this._objectStore.index(column).openCursor();
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    ++this._resultCount;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    ++this._resultCount;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Where.prototype.executeWhereLogic = function (column, value, op) {
                    value = op ? value[op] : value;
                    var cursor_request, cursor;
                    if (this._checkFlag) {
                        cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this._whereChecker.check(cursor.value)) {
                                    ++this._resultCount;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        if (this._objectStore.count) {
                            cursor_request = this._objectStore.index(column).count(this.getKeyRange(value, op));
                            cursor_request.onsuccess = function () {
                                this._resultCount = cursor_request.result;
                                this.onQueryFinished();
                            }.bind(this);
                        }
                        else {
                            cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                            cursor_request.onsuccess = function (e) {
                                cursor = e.target.result;
                                if (cursor) {
                                    ++this._resultCount;
                                    cursor.continue();
                                }
                                else {
                                    this.onQueryFinished();
                                }
                            }.bind(this);
                        }
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
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
                    _this._onError = onError;
                    _this._onSuccess = onSuccess;
                    _this._query = query;
                    return _this;
                }
                Instance.prototype.execute = function () {
                    if (this.isTableExist(this._query.From)) {
                        try {
                            if (this._query.Where !== undefined) {
                                this.addGreatAndLessToNotOp();
                                if (this._query.Where.Or || Array.isArray(this._query.Where)) {
                                    var select_object = new Business.Select.Instance(this._query, function (results) {
                                        this._resultCount = results.length;
                                        this.onTransactionCompleted();
                                    }.bind(this), this._onError);
                                    select_object.execute();
                                }
                                else {
                                    this.initTransaction();
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                this.initTransaction();
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: this._query.From });
                        }
                    }
                    else {
                        this._errorOccured = true;
                        this.onErrorOccured(new JsStore.Error(JsStore.Error_Type.TableNotExist, { TableName: this._query.From }).get(), true);
                    }
                };
                Instance.prototype.initTransaction = function () {
                    Business.createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                    this._objectStore = Business.db_transaction.objectStore(this._query.From);
                };
                Instance.prototype.onQueryFinished = function () {
                    if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                };
                Instance.prototype.onTransactionCompleted = function () {
                    if (this._errorOccured === false) {
                        this._onSuccess(this._resultCount);
                    }
                };
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
                    if (typeof suppliedValue[key] !== 'object') {
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
                _this._checkFlag = false;
                return _this;
            }
            BaseUpdate.prototype.initTransaction = function () {
                Business.createTransaction([this._query.In], this.onTransactionCompleted.bind(this));
                this._objectStore = Business.db_transaction.objectStore(this._query.In);
            };
            BaseUpdate.prototype.onQueryFinished = function () {
                if (this._isTransaction === true) {
                    this.onTransactionCompleted();
                }
            };
            BaseUpdate.prototype.onTransactionCompleted = function () {
                if (this._errorOccured === false) {
                    this._onSuccess(this._rowAffected);
                }
            };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NotWhere.prototype.executeWhereUndefinedLogic = function () {
                    var cursor, cursor_request = this._objectStore.openCursor();
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.update(Update.updateValue(this._query.Set, cursor.value));
                            ++this._rowAffected;
                            cursor.continue();
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                In.prototype.executeInLogic = function (column, values) {
                    var cursor, column_store = this._objectStore.index(column), cursor_request, onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                            ++this._rowAffected;
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                        ++this._rowAffected;
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Like.prototype.executeLikeLogic = function (column, value, symbol) {
                    var cursor;
                    this._compValue = value.toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    var cursor_open_request = this._objectStore.index(column).openCursor();
                    cursor_open_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        cursor_open_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        cursor_open_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Where.prototype.executeWhereLogic = function (column, value, op) {
                    var cursor, cursor_request;
                    value = op ? value[op] : value;
                    cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                    if (this._checkFlag) {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this._whereChecker.check(cursor.value)) {
                                    cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                cursor.update(Update.updateValue(this._query.Set, cursor.value));
                                ++this._rowAffected;
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
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
                    _this._onSuccess = onSuccess;
                    _this._onError = onError;
                    _this._query = query;
                    return _this;
                }
                Instance.prototype.execute = function () {
                    try {
                        this._error = new Update.SchemaChecker(this.getTable(this._query.In)).
                            check(this._query.Set, this._query.In);
                        if (!this._error) {
                            if (this._query.Where !== undefined) {
                                this.addGreatAndLessToNotOp();
                                if (this._query.Where.Or || Array.isArray(this._query.Where)) {
                                    this.executeComplexLogic();
                                }
                                else {
                                    this.initTransaction();
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                this.initTransaction();
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        else {
                            this._errorOccured = true;
                            this.onErrorOccured(this._error, true);
                        }
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: this._query.In });
                    }
                };
                Instance.prototype.executeComplexLogic = function () {
                    var select_object = new Business.Select.Instance({
                        From: this._query.In,
                        Where: this._query.Where
                    }, function (results) {
                        var key = this.getPrimaryKey(this._query.In), in_query = [], where_qry = {};
                        results.forEach(function (value) {
                            in_query.push(value[key]);
                        });
                        results = null;
                        where_qry[key] = { In: in_query };
                        this._query['Where'] = where_qry;
                        this.initTransaction();
                        this.goToWhereLogic();
                    }.bind(this), this._onError.bind(this));
                    select_object.execute();
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
        var Update;
        (function (Update) {
            var SchemaChecker = /** @class */ (function () {
                function SchemaChecker(table) {
                    this._table = table;
                }
                SchemaChecker.prototype.check = function (setValue, tblName) {
                    var error = null;
                    if (typeof setValue === 'object') {
                        if (this._table) {
                            // loop through table column and find data is valid
                            this._table._columns.every(function (column) {
                                if (error === null) {
                                    if (column._name in setValue) {
                                        error = this.checkByColumn(column, setValue[column._name]);
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }, this);
                        }
                        else {
                            error = new JsStore.Error(JsStore.Error_Type.TableNotExist, { TableName: tblName }).get();
                        }
                    }
                    else {
                        error = new JsStore.Error(JsStore.Error_Type.NotObject).get();
                    }
                    return error;
                };
                SchemaChecker.prototype.checkByColumn = function (column, value) {
                    var error = null;
                    // check not null schema
                    if (column._notNull && JsStore.isNull(value)) {
                        error = new JsStore.Error(JsStore.Error_Type.NullValue, { ColumnName: column._name }).get();
                    }
                    // check datatype
                    var type = JsStore.getType(value);
                    if (column._dataType) {
                        if (type !== column._dataType && type !== 'object') {
                            error = new JsStore.Error(JsStore.Error_Type.BadDataType, { ColumnName: column._name }).get();
                        }
                    }
                    // check allowed operators
                    if (type === 'object') {
                        var allowed_prop = ['+', '-', '*', '/'];
                        for (var prop in value) {
                            if (allowed_prop.indexOf(prop) < 0 && column._dataType && type !== column._dataType) {
                                error = new JsStore.Error(JsStore.Error_Type.BadDataType, { ColumnName: column._name }).get();
                            }
                            break;
                        }
                    }
                    return error;
                };
                return SchemaChecker;
            }());
            Update.SchemaChecker = SchemaChecker;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var BaseRemove = /** @class */ (function (_super) {
                __extends(BaseRemove, _super);
                function BaseRemove() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._checkFlag = false;
                    return _this;
                }
                return BaseRemove;
            }(Business.Base));
            Remove.BaseRemove = BaseRemove;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var NotWhere = /** @class */ (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NotWhere.prototype.executeWhereUndefinedLogic = function () {
                    var cursor, cursor_request = this._objectStore.openCursor();
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this._rowAffected;
                            cursor.continue();
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
                return NotWhere;
            }(Remove.BaseRemove));
            Remove.NotWhere = NotWhere;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var In = /** @class */ (function (_super) {
                __extends(In, _super);
                function In() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                In.prototype.executeInLogic = function (column, values) {
                    var cursor, cursor_request, onCursorError = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = this._objectStore.index(column).
                                    openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            cursor.delete();
                                            ++this._rowAffected;
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = this._objectStore.index(column).
                                    openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        cursor.delete();
                                        ++this._rowAffected;
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
                return In;
            }(Remove.NotWhere));
            Remove.In = In;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var Like = /** @class */ (function (_super) {
                __extends(Like, _super);
                function Like() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Like.prototype.executeLikeLogic = function (column, value, symbol) {
                    var cursor;
                    this._compValue = value.toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    var cursor_request = this._objectStore.index(column).openCursor();
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    cursor.delete();
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    cursor.delete();
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
                return Like;
            }(Remove.In));
            Remove.Like = Like;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var Where = /** @class */ (function (_super) {
                __extends(Where, _super);
                function Where() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Where.prototype.executeWhereLogic = function (column, value, op) {
                    var cursor, cursor_request;
                    value = op ? value[op] : value;
                    cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                    if (this._checkFlag) {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this._whereChecker.check(cursor.value)) {
                                    cursor.delete();
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                cursor.delete();
                                ++this._rowAffected;
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
                return Where;
            }(Remove.Like));
            Remove.Where = Where;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Remove;
        (function (Remove) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this._query = query;
                    _this._onSuccess = onSuccess;
                    _this._onError = onError;
                    return _this;
                }
                Instance.prototype.execute = function () {
                    try {
                        if (this._query.Where !== undefined) {
                            this.addGreatAndLessToNotOp();
                            this.initTransaction();
                            if (Array.isArray(this._query.Where)) {
                                this.processWhereArrayQry();
                            }
                            else {
                                this.processWhere();
                            }
                        }
                        else {
                            this.initTransaction();
                            this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured(ex, { TableName: this._query.From });
                    }
                };
                Instance.prototype.processWhereArrayQry = function () {
                    var select_object = new Business.Select.Instance(this._query, function (results) {
                        var key_list = [], p_key = this.getPrimaryKey(this._query.From);
                        results.forEach(function (item) {
                            key_list.push(item[p_key]);
                        });
                        results = null;
                        this._query.Where = {};
                        this._query.Where[p_key] = { In: key_list };
                        this.processWhere(false);
                    }.bind(this), this._onError);
                    select_object.execute();
                };
                Instance.prototype.processWhere = function () {
                    if (this._query.Where.Or) {
                        this.processOrLogic();
                    }
                    this.goToWhereLogic();
                };
                Instance.prototype.initTransaction = function () {
                    Business.createTransaction([this._query.From], this.onTransactionCompleted.bind(this));
                    this._objectStore = Business.db_transaction.objectStore(this._query.From);
                };
                Instance.prototype.onTransactionCompleted = function () {
                    if (this._errorOccured === false) {
                        this._onSuccess(this._rowAffected);
                    }
                };
                Instance.prototype.onQueryFinished = function () {
                    if (this._isOr === true) {
                        this.orQuerySuccess();
                    }
                    else if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                };
                Instance.prototype.orQuerySuccess = function () {
                    var key = JsStore.getObjectFirstKey(this._orInfo.OrQuery);
                    if (key != null) {
                        var where = {};
                        where[key] = this._orInfo.OrQuery[key];
                        delete this._orInfo.OrQuery[key];
                        this._query.Where = where;
                        this.goToWhereLogic();
                    }
                    else {
                        this._isOr = true;
                    }
                };
                Instance.prototype.processOrLogic = function () {
                    this._isOr = true;
                    this._orInfo = {
                        OrQuery: this._query.Where.Or
                    };
                    // free or memory
                    delete this._query.Where.Or;
                };
                return Instance;
            }(Remove.Where));
            Remove.Instance = Instance;
        })(Remove = Business.Remove || (Business.Remove = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert;
        (function (Insert) {
            var Instance = /** @class */ (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this._valuesAffected = [];
                    _this._onError = onError;
                    _this._query = query;
                    _this._onSuccess = onSuccess;
                    _this._tableName = _this._query.Into;
                    return _this;
                }
                Instance.prototype.execute = function () {
                    var table = this.getTable(this._tableName);
                    if (!Array.isArray(this._query.Values)) {
                        this.onErrorOccured(new JsStore.Error(JsStore.Error_Type.NotArray).get(), true);
                    }
                    else if (table) {
                        try {
                            if (this._query.SkipDataCheck) {
                                this.insertData(this._query.Values);
                            }
                            else {
                                var value_checker_obj = new Insert.ValuesChecker(table, this._query.Values);
                                value_checker_obj.checkAndModifyValues(function (isError) {
                                    if (isError) {
                                        this.onErrorOccured(value_checker_obj._error, true);
                                    }
                                    else {
                                        this.insertData(value_checker_obj._values);
                                    }
                                    value_checker_obj = undefined;
                                }.bind(this));
                            }
                            // remove values from query
                            this._query.Values = undefined;
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: this._tableName });
                        }
                    }
                    else {
                        new JsStore.Error(JsStore.Error_Type.TableNotExist, { TableName: this._tableName }).throw();
                    }
                };
                Instance.prototype.onTransactionCompleted = function () {
                    if (this._errorOccured === false) {
                        this._onSuccess(this._query.Return ? this._valuesAffected : this._rowAffected);
                    }
                };
                Instance.prototype.onQueryFinished = function () {
                    if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                };
                Instance.prototype.insertData = function (values) {
                    var value_index = 0, insertDataIntoTable;
                    if (this._query.Return) {
                        insertDataIntoTable = function (value) {
                            if (value) {
                                var add_result = object_store.add(value);
                                add_result.onerror = this.onErrorOccured.bind(this);
                                add_result.onsuccess = function (e) {
                                    this._valuesAffected.push(value);
                                    insertDataIntoTable.call(this, values[value_index++]);
                                }.bind(this);
                            }
                            else {
                                this.onQueryFinished();
                            }
                        };
                    }
                    else {
                        insertDataIntoTable = function (value) {
                            if (value) {
                                var add_result = object_store.add(value);
                                add_result.onerror = this.onErrorOccured.bind(this);
                                add_result.onsuccess = function (e) {
                                    ++this._rowAffected;
                                    insertDataIntoTable.call(this, values[value_index++]);
                                }.bind(this);
                            }
                            else {
                                this.onQueryFinished();
                            }
                        };
                    }
                    Business.createTransaction([this._query.Into], this.onTransactionCompleted.bind(this));
                    var object_store = Business.db_transaction.objectStore(this._query.Into);
                    insertDataIntoTable.call(this, values[value_index++]);
                };
                return Instance;
            }(Business.Base));
            Insert.Instance = Instance;
        })(Insert = Business.Insert || (Business.Insert = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert;
        (function (Insert) {
            var ValueChecker = /** @class */ (function () {
                function ValueChecker(table, autoIncrementValue) {
                    this._errorOccured = false;
                    this._autoIncrementValue = {};
                    this._table = table;
                    this._autoIncrementValue = autoIncrementValue;
                }
                ValueChecker.prototype.checkAndModifyValue = function (value) {
                    this._value = value;
                    this._table._columns.every(function (column) {
                        this.checkAndModifyColumnValue(column, value);
                        return !this._errorOccured;
                    }, this);
                    return this._errorOccured;
                };
                ValueChecker.prototype.checkNotNullAndDataType = function (column) {
                    // check not null schema
                    if (column._notNull && JsStore.isNull(this._value[column._name])) {
                        this.onValidationError(JsStore.Error_Type.NullValue, { ColumnName: column._name });
                    }
                    else if (column._dataType && !JsStore.isNull(this._value[column._name]) &&
                        JsStore.getType(this._value[column._name]) !== column._dataType) {
                        this.onValidationError(JsStore.Error_Type.BadDataType, { ColumnName: column._name });
                    }
                };
                ValueChecker.prototype.checkAndModifyColumnValue = function (column) {
                    // check auto increment scheme
                    if (column._autoIncrement) {
                        this._value[column._name] = ++this._autoIncrementValue[column._name];
                    }
                    else if (column._default && JsStore.isNull(this._value[column._name])) {
                        this._value[column._name] = column._default;
                    }
                    this.checkNotNullAndDataType(column);
                };
                ValueChecker.prototype.onValidationError = function (error, details) {
                    this._errorOccured = true;
                    this._error = new JsStore.Error(error, details).get();
                };
                return ValueChecker;
            }());
            Insert.ValueChecker = ValueChecker;
        })(Insert = Business.Insert || (Business.Insert = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert;
        (function (Insert) {
            var ValuesChecker = /** @class */ (function () {
                function ValuesChecker(table, values) {
                    this._table = table;
                    this._values = values;
                }
                ValuesChecker.prototype.checkAndModifyValues = function (onFinish) {
                    this._onFinish = onFinish;
                    var auto_inc_columns = this._table._columns.filter(function (col) {
                        return col._autoIncrement;
                    });
                    var auto_inc_values = {};
                    auto_inc_columns.forEach(function (column) {
                        var auto_increment_key = "JsStore_" + Business.active_db._name + "_" + this._table._name + "_" + column._name + "_Value";
                        KeyStore.get(auto_increment_key, function (val) {
                            auto_inc_values[column._name] = val;
                        });
                    }, this);
                    KeyStore.get('dumy_key', function (val) {
                        this._valueCheckerObj = new Insert.ValueChecker(this._table, auto_inc_values);
                        this.startChecking();
                    }.bind(this), function (err) {
                        this._error = err;
                        this._onFinish(true);
                    }.bind(this));
                };
                ValuesChecker.prototype.startChecking = function () {
                    var is_error = false;
                    this._values.every(function (item) {
                        is_error = this._valueCheckerObj.checkAndModifyValue(item);
                        return !is_error;
                    }, this);
                    if (is_error) {
                        this._error = this._valueCheckerObj._error;
                        this._onFinish(true);
                    }
                    else {
                        for (var prop in this._valueCheckerObj._autoIncrementValue) {
                            var auto_increment_key = "JsStore_" + Business.active_db._name + "_" + this._table._name + "_" + prop + "_Value";
                            KeyStore.set(auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
                        }
                        KeyStore.get('dumy_key', function (val) {
                            this._onFinish(false);
                        }.bind(this), function (err) {
                            this._error = err;
                            this._onFinish(true);
                        }.bind(this));
                    }
                };
                return ValuesChecker;
            }());
            Insert.ValuesChecker = ValuesChecker;
        })(Insert = Business.Insert || (Business.Insert = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    JsStore.worker_status = JsStore.WebWorker_Status.NotStarted;
    var CodeExecutionHelper = /** @class */ (function () {
        function CodeExecutionHelper() {
            this._requestQueue = [];
            this._isCodeExecuting = false;
        }
        CodeExecutionHelper.prototype.pushApi = function (request, usePromise) {
            if (usePromise === true) {
                return new Promise(function (resolve, reject) {
                    request.OnSuccess = function (result) {
                        resolve(result);
                    };
                    request.OnError = function (error) {
                        reject(error);
                    };
                    this.prcoessExecutionOfCode(request);
                }.bind(this));
            }
            else {
                this.prcoessExecutionOfCode(request);
                return this;
            }
        };
        CodeExecutionHelper.prototype.createWorker = function () {
            try {
                if (Worker) {
                    var script_url = this.getScriptUrl(JsStore.file_name);
                    if (script_url && script_url.length > 0) {
                        JsStore.worker_instance = new Worker(script_url);
                        JsStore.worker_instance.onmessage = function (msg) {
                            this.onMessageFromWorker(msg);
                        }.bind(this);
                        this.executeCodeUsingWorker({
                            Name: 'change_log_status',
                            Query: {
                                logging: JsStore.enable_log
                            }
                        });
                        setTimeout(function () {
                            if (JsStore.worker_status !== JsStore.WebWorker_Status.Failed) {
                                JsStore.worker_status = JsStore.WebWorker_Status.Registered;
                            }
                            if (JsStore.db_status.ConStatus === JsStore.Connection_Status.Connected) {
                                this.executeCode();
                            }
                        }.bind(this), 100);
                    }
                    else {
                        this.onWorkerFailed();
                    }
                }
                else {
                    this.onWorkerFailed();
                }
            }
            catch (ex) {
                this.onWorkerFailed();
            }
        };
        CodeExecutionHelper.prototype.prcoessExecutionOfCode = function (request) {
            if (JsStore.db_status.ConStatus === JsStore.Connection_Status.NotStarted) {
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this._requestQueue.splice(0, 0, request);
                        if (JsStore.worker_status !== JsStore.WebWorker_Status.NotStarted) {
                            this.executeCode();
                        }
                        JsStore.db_status.ConStatus = JsStore.Connection_Status.Connected;
                        break;
                    default: this._requestQueue.push(request);
                }
            }
            else {
                this._requestQueue.push(request);
                if (this._requestQueue.length === 1 && JsStore.worker_status !== JsStore.WebWorker_Status.NotStarted) {
                    this.executeCode();
                }
            }
            JsStore.log("request pushed: " + request.Name);
        };
        CodeExecutionHelper.prototype.executeCode = function () {
            if (!this._isCodeExecuting && this._requestQueue.length > 0) {
                this._isCodeExecuting = true;
                var first_request = this._requestQueue[0], request = {
                    Name: first_request.Name,
                    Query: first_request.Query
                };
                JsStore.log("request executing : " + first_request.Name);
                if (JsStore.worker_status === JsStore.WebWorker_Status.Registered) {
                    this.executeCodeUsingWorker(request);
                }
                else {
                    this.executeCodeDirect(request);
                }
            }
        };
        CodeExecutionHelper.prototype.executeCodeDirect = function (request) {
            new JsStore.Business.Main(function (results) {
                this.processFinishedRequest(results);
            }.bind(this)).checkConnectionAndExecuteLogic(request);
        };
        CodeExecutionHelper.prototype.executeCodeUsingWorker = function (request) {
            JsStore.worker_instance.postMessage(request);
        };
        CodeExecutionHelper.prototype.processFinishedRequest = function (message) {
            var finished_request = this._requestQueue.shift();
            this._isCodeExecuting = false;
            if (finished_request) {
                JsStore.log("request finished : " + finished_request.Name);
                if (message.ErrorOccured) {
                    if (finished_request.OnError) {
                        finished_request.OnError(message.ErrorDetails);
                    }
                }
                else {
                    if (finished_request.OnSuccess) {
                        finished_request.OnSuccess(message.ReturnedValue);
                    }
                }
                this.executeCode();
            }
        };
        CodeExecutionHelper.prototype.onWorkerFailed = function () {
            console.warn('JsStore is not runing in web worker');
            JsStore.worker_status = JsStore.WebWorker_Status.Failed;
            if (JsStore.db_status.ConStatus === JsStore.Connection_Status.NotStarted) {
                this.executeCode();
            }
        };
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
        CodeExecutionHelper.prototype.onMessageFromWorker = function (msg) {
            if (typeof msg.data === 'string') {
                var datas = msg.data.split(':')[1];
                switch (datas) {
                    case 'WorkerFailed':
                        this.onWorkerFailed();
                        break;
                }
            }
            else {
                this.processFinishedRequest(msg.data);
            }
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
            var _this = _super.call(this) || this;
            if (JsStore.worker_status === JsStore.WebWorker_Status.Registered) {
                JsStore.worker_instance.terminate();
            }
            else if (JsStore.worker_status === JsStore.WebWorker_Status.NotStarted) {
                KeyStore.init();
            }
            _this.createWorker();
            if (dbName) {
                _this.openDb(dbName, null, null);
            }
            return _this;
        }
        /**
         * open database
         *
         * @param {string} dbName
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @returns
         * @memberof Instance
         */
        Instance.prototype.openDb = function (dbName, onSuccess, onError) {
            return this.pushApi({
                Name: 'open_db',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: dbName
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
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            return this.pushApi({
                Name: 'create_db',
                OnError: onError,
                OnSuccess: onSuccess,
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
        Instance.prototype.dropDb = function (onSuccess, onError) {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'drop_db',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: null
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
        Instance.prototype.select = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'select',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        /**
         * perform transaction - execute multiple apis
         *
         * @param {string[]} tableNames
         * @param {any} txLogic
         * @param {(results: any[]) => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.transaction = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            query.Logic = query.Logic.toString();
            return this.pushApi({
                Name: 'transaction',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
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
        Instance.prototype.count = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'count',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        /**
         * insert data into table
         *
         * @param {IInsert} query
         * @param {(recordInserted: number) => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.insert = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'insert',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        /**
         * update data into table
         *
         * @param {IUpdate} query
         * @param {(recordUpdated: number) => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.update = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'update',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        Instance.prototype.delete = function (query, onSuccess, onError) {
            JsStore.logError('delete is deprecated because delete is reserved keyword in js. Please use remove api.');
        };
        /**
         * remove data from table
         *
         * @param {IRemove} query
         * @param {(recordDeleted: number) => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.remove = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'remove',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        /**
         * delete all data from table
         *
         * @param {string} tableName
         * @param {() => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.clear = function (tableName, onSuccess, onError) {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'clear',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: tableName
            }, use_promise);
        };
        /**
         * insert bulk amount of data
         *
         * @param {IInsert} query
         * @param {() => void} onSuccess
         * @param {(err: IError) => void} onError
         * @returns
         * @memberof Instance
         */
        Instance.prototype.bulkInsert = function (query, onSuccess, onError) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            var use_promise = onSuccess ? false : true;
            query.OnSuccess = query.OnError = null;
            return this.pushApi({
                Name: 'bulk_insert',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            }, use_promise);
        };
        /**
         * export the result in json file
         *
         * @param {ISelect} qry
         * @memberof Instance
         */
        Instance.prototype.exportJson = function (query) {
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
                        OnError: onError,
                        OnSuccess: onSuccess,
                        Query: query
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
                    OnError: onError,
                    OnSuccess: onSuccess,
                    Query: query,
                }, use_promise);
            }
        };
        return Instance;
    }(JsStore.CodeExecutionHelper));
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
if (self && !self.alert) {
    self.onmessage = function (e) {
        JsStore.log("Request executing from WebWorker, request name: " + e.data.Name);
        var request = e.data, business_main = new JsStore.Business.Main();
        business_main.checkConnectionAndExecuteLogic(request);
    };
    JsStore.worker_status = JsStore.WebWorker_Status.Registered;
    KeyStore.init();
}
//# sourceMappingURL=jsstore.js.map