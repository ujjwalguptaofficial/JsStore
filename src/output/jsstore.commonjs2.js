/*!
 * @license :jsstore - V2.0.4 - 16/05/2018
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2018 @Ujjwal Gupta; Licensed MIT
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });

/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ERROR_TYPE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WORKER_STATUS", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["WORKER_STATUS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DATA_TYPE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COL_OPTION", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["COL_OPTION"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "API", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["API"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return _config__WEBPACK_IMPORTED_MODULE_2__["Config"]; });

/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enableLog", function() { return _helper__WEBPACK_IMPORTED_MODULE_3__["enableLog"]; });

/* harmony import */ var _model_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return _model_index__WEBPACK_IMPORTED_MODULE_4__["Column"]; });








/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _instance_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(worker) {
        return _super.call(this, worker) || this;
    }
    /**
     *  open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.openDb = function (dbName) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].OpenDb,
            query: dbName
        });
    };
    /**
     * creates DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Instance
     */
    Instance.prototype.createDb = function (dataBase) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].CreateDb,
            query: dataBase
        });
    };
    /**
     * drop dataBase
     *
     * @returns
     * @memberof Instance
     */
    Instance.prototype.dropDb = function () {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].DropDb,
            query: null
        });
    };
    /**
     * select data from table
     *
     * @template T
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.select = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Select,
            query: query
        });
    };
    /**
     * get no of record from table
     *
     * @param {ICount} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.count = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Count,
            query: query
        });
    };
    /**
     * insert data into table
     *
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.insert = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Insert,
            query: query
        });
    };
    /**
     * update data into table
     *
     * @param {IUpdate} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.update = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Update,
            query: query
        });
    };
    /**
     * remove data from table
     *
     * @param {IRemove} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.remove = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Remove,
            query: query
        });
    };
    /**
     * delete all data from table
     *
     * @param {string} tableName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.clear = function (tableName) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Clear,
            query: tableName
        });
    };
    /**
     * insert bulk amount of data
     *
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.bulkInsert = function (query) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].BulkInsert,
            query: query
        });
    };
    /**
     *  export the result in json file
     *
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.exportJson = function (query) {
        var _this = this;
        var onSuccess = function (url) {
            var link = document.createElement("a");
            link.href = url;
            link.download = query.from + ".json";
            link.click();
        };
        return new Promise(function (resolve, reject) {
            _this.pushApi({
                name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].ExportJson,
                query: query
            }).then(function (url) {
                onSuccess(url);
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Instance
     */
    Instance.prototype.setLogStatus = function (status) {
        _config__WEBPACK_IMPORTED_MODULE_2__["Config"]._isLogEnabled = status ? status : _config__WEBPACK_IMPORTED_MODULE_2__["Config"]._isLogEnabled;
        this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].ChangeLogStatus,
            query: _config__WEBPACK_IMPORTED_MODULE_2__["Config"]._isLogEnabled
        });
    };
    /**
     * get version of database
     *
     * @param {(string | IDbInfo)} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbVersion = function (dbName) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].GetDbVersion,
            query: dbName
        });
    };
    /**
     * is database exist
     *
     * @param {(IDbInfo | string)} dbInfo
     * @returns
     * @memberof Instance
     */
    Instance.prototype.isDbExist = function (dbInfo) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].IsDbExist,
            query: dbInfo
        });
    };
    /**
     * returns list of database created
     *
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbList = function () {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].GetDbList,
            query: null
        });
    };
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbSchema = function (dbName) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].GetDbSchema,
            query: dbName
        });
    };
    /**
     * get the value from keystore table
     *
     * @param {string} key
     * @returns
     * @memberof Instance
     */
    Instance.prototype.get = function (key) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Get,
            query: key
        });
    };
    /**
     * set the value in keystore table
     *
     * @param {string} key
     * @param {*} value
     * @returns
     * @memberof Instance
     */
    Instance.prototype.set = function (key, value) {
        return this.pushApi({
            name: _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Set,
            query: {
                key: key, value: value
            }
        });
    };
    return Instance;
}(_instance_helper__WEBPACK_IMPORTED_MODULE_1__["InstanceHelper"]));



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR_TYPE", function() { return ERROR_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WORKER_STATUS", function() { return WORKER_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATA_TYPE", function() { return DATA_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COL_OPTION", function() { return COL_OPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });
var ERROR_TYPE;
(function (ERROR_TYPE) {
    ERROR_TYPE["WorkerNotSupplied"] = "worker_not_supplied";
    ERROR_TYPE["IndexedDbUndefined"] = "indexeddb_undefined";
})(ERROR_TYPE || (ERROR_TYPE = {}));
var WORKER_STATUS;
(function (WORKER_STATUS) {
    WORKER_STATUS["Registered"] = "registerd";
    WORKER_STATUS["Failed"] = "failed";
    WORKER_STATUS["NotStarted"] = "not_started";
})(WORKER_STATUS || (WORKER_STATUS = {}));
var DATA_TYPE;
(function (DATA_TYPE) {
    DATA_TYPE["String"] = "string";
    DATA_TYPE["Object"] = "object";
    DATA_TYPE["Array"] = "array";
    DATA_TYPE["Number"] = "number";
    DATA_TYPE["Boolean"] = "boolean";
    DATA_TYPE["Null"] = "null";
    DATA_TYPE["DateTime"] = "date_time";
})(DATA_TYPE || (DATA_TYPE = {}));
var COL_OPTION;
(function (COL_OPTION) {
    COL_OPTION["PrimaryKey"] = "primary_key";
    COL_OPTION["AutoIncrement"] = "auto_increment";
    COL_OPTION["Unique"] = "unique";
    COL_OPTION["NotNull"] = "not_null";
    COL_OPTION["MultiEntry"] = "multi_entry";
})(COL_OPTION || (COL_OPTION = {}));
var API;
(function (API) {
    API["CreateDb"] = "create_db";
    API["IsDbExist"] = "is_db_exist";
    API["GetDbVersion"] = "get_db_version";
    API["GetDbList"] = "get_db_list";
    API["Get"] = "get";
    API["Set"] = "set";
    API["Select"] = "select";
    API["Insert"] = "insert";
    API["Update"] = "update";
    API["Remove"] = "remove";
    API["GetDbSchema"] = "get_db_schema";
    API["OpenDb"] = "open_db";
    API["Clear"] = "clear";
    API["DropDb"] = "drop_db";
    API["Count"] = "count";
    API["BulkInsert"] = "bulk_insert";
    API["ExportJson"] = "export_json";
    API["ChangeLogStatus"] = "change_log_status";
})(API || (API = {}));


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InstanceHelper", function() { return InstanceHelper; });
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


var InstanceHelper = /** @class */ (function () {
    function InstanceHelper(worker) {
        this.isDbOpened_ = false;
        this.requestQueue_ = [];
        this.isCodeExecuting_ = false;
        this.whiteListApi_ = [
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].CreateDb,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].IsDbExist,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].GetDbVersion,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].GetDbList,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].OpenDb,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].GetDbSchema,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].Get,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].Set,
            _enums__WEBPACK_IMPORTED_MODULE_1__["API"].ChangeLogStatus
        ];
        if (worker) {
            this.worker_ = worker;
            this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
        }
        else {
            var err = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].WorkerNotSupplied);
            err.throw();
        }
    }
    InstanceHelper.prototype.onMessageFromWorker_ = function (msg) {
        this.processFinishedQuery_(msg.data);
    };
    InstanceHelper.prototype.processFinishedQuery_ = function (message) {
        var finishedRequest = this.requestQueue_.shift();
        if (finishedRequest) {
            _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"].log("request finished : " + finishedRequest.name);
            if (message.errorOccured) {
                if (finishedRequest.onError) {
                    finishedRequest.onError(message.errorDetails);
                }
            }
            else {
                if (finishedRequest.onSuccess) {
                    var openDbQueries = ["open_db", "create_db"];
                    if (openDbQueries.indexOf(finishedRequest.name) >= 0) {
                        this.isDbOpened_ = true;
                    }
                    finishedRequest.onSuccess(message.returnedValue);
                }
            }
            this.isCodeExecuting_ = false;
            this.executeQry_();
        }
    };
    InstanceHelper.prototype.pushApi = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.onSuccess = function (result) {
                resolve(result);
            };
            request.onError = function (error) {
                reject(error);
            };
            _this.prcoessExecutionOfQry_(request);
        });
    };
    InstanceHelper.prototype.prcoessExecutionOfQry_ = function (request) {
        this.requestQueue_.push(request);
        this.executeQry_();
        _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"].log("request pushed: " + request.name);
    };
    InstanceHelper.prototype.executeQry_ = function () {
        var _this = this;
        if (!this.isCodeExecuting_ && this.requestQueue_.length > 0) {
            if (this.isDbOpened_) {
                this.sendRequestToWorker_(this.requestQueue_[0]);
                return;
            }
            var allowedQueryIndex_1 = -1;
            this.requestQueue_.every(function (item, index) {
                if (_this.whiteListApi_.indexOf(item.name) >= 0) {
                    allowedQueryIndex_1 = index;
                    return false;
                }
                return true;
            });
            // shift allowed query to zeroth index
            if (allowedQueryIndex_1 >= 0) {
                this.requestQueue_.splice(0, 0, this.requestQueue_.splice(allowedQueryIndex_1, 1)[0]);
                this.sendRequestToWorker_(this.requestQueue_[0]);
            }
        }
    };
    InstanceHelper.prototype.sendRequestToWorker_ = function (firstRequest) {
        this.isCodeExecuting_ = true;
        var request = {
            name: firstRequest.name,
            query: firstRequest.query
        };
        _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"].log("request executing : " + firstRequest.name);
        this.worker_.postMessage(request);
    };
    return InstanceHelper;
}());



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogHelper", function() { return LogHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


var LogHelper = /** @class */ (function () {
    function LogHelper(type, info) {
        if (info === void 0) { info = null; }
        this.type = type;
        this._info = info;
        this.message = this.getMsg();
    }
    LogHelper.prototype.throw = function () {
        throw this.get();
    };
    LogHelper.log = function (msg) {
        if (_config__WEBPACK_IMPORTED_MODULE_1__["Config"]._isLogEnabled) {
            console.log(msg);
        }
    };
    LogHelper.prototype.logError = function () {
        console.error(this.get());
    };
    LogHelper.prototype.logWarning = function () {
        console.warn(this.get());
    };
    LogHelper.prototype.get = function () {
        return {
            message: this.message,
            type: this.type
        };
    };
    LogHelper.prototype.getMsg = function () {
        var errMsg;
        switch (this.type) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].WorkerNotSupplied:
                errMsg = "Worker object is not passed in instance constructor";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].IndexedDbUndefined:
                errMsg = "Browser does not support indexeddb";
                break;
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    };
    return LogHelper;
}());



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return Config; });
var Config = /** @class */ (function () {
    function Config() {
    }
    Config._isLogEnabled = false;
    return Config;
}());



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableLog", function() { return enableLog; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

/**
 * Enable log
 *
 */
var enableLog = function () {
    _config__WEBPACK_IMPORTED_MODULE_0__["Config"]._isLogEnabled = true;
};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _column__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return _column__WEBPACK_IMPORTED_MODULE_0__["Column"]; });




/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return Column; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

var Column = /** @class */ (function () {
    function Column(name) {
        this.name = name;
    }
    Column.prototype.options = function (columnOptions) {
        var _this = this;
        columnOptions.forEach(function (option) {
            switch (option) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["COL_OPTION"].AutoIncrement:
                    _this.autoIncrement = true;
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["COL_OPTION"].MultiEntry:
                    _this.multiEntry = true;
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["COL_OPTION"].NotNull:
                    _this.notNull = true;
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["COL_OPTION"].PrimaryKey:
                    _this.primaryKey = true;
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["COL_OPTION"].Unique:
                    _this.unique = true;
                    break;
            }
        });
        return this;
    };
    Column.prototype.setDataType = function (type) {
        this.dataType = type;
        return this;
    };
    Column.prototype.setDefault = function (value) {
        this.default = value;
        return this;
    };
    Column.prototype.disableSearch = function () {
        this.enableSearch = false;
        return this;
    };
    return Column;
}());



/***/ })
/******/ ]);
//# sourceMappingURL=jsstore.commonjs2.js.map