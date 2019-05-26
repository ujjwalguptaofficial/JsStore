/*!
 * @license :jsstore - V3.0.0 - 26/05/2019
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2019 @Ujjwal Gupta; Licensed MIT
 */
var JsStoreWorker =
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/worker/business/base.ts":
/*!*************************************!*\
  !*** ./src/worker/business/base.ts ***!
  \*************************************/
/*! exports provided: Base */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
/* harmony import */ var _base_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_helper */ "./src/worker/business/base_helper.ts");
/* harmony import */ var _where_checker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./where_checker */ "./src/worker/business/where_checker.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util */ "./src/worker/util.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rowAffected = 0;
        return _this;
    }
    // abstract executeRegexLogic(column: string, exp: RegExp): void;
    // abstract executeInLogic(column: string, value: any[]): void;
    // abstract executeWhereLogic(column: string, value, op, dir?): void;
    Base.prototype.onErrorOccured = function (e, customError) {
        if (customError === void 0) { customError = false; }
        if (customError) {
            e.logError();
            this.error = e.get();
        }
        else {
            var error = void 0;
            if (e.name) {
                error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"]((e.name));
                error.message = e.message;
            }
            else {
                error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](e.target.error.name);
                error.message = e.target.error.message;
            }
            error.logError();
            this.error = error.get();
        }
    };
    Base.prototype.onExceptionOccured = function (ex, info) {
        switch (ex.name) {
            case 'NotFoundError':
                var error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["ERROR_TYPE"].TableNotExist, info);
                this.onErrorOccured(error, true);
                break;
            default: console.error(ex);
        }
    };
    Base.prototype.getColumnInfo = function (columnName, tableName) {
        return this.getTable(tableName).columns.find(function (column) { return column.name === columnName; });
    };
    Base.prototype.getRegexFromLikeExpression_ = function (likeExpression) {
        var filterValues = likeExpression.split('%');
        var filterValue;
        var occurence;
        if (filterValues[1]) {
            filterValue = filterValues[1];
            occurence = filterValues.length > 2 ? _enums__WEBPACK_IMPORTED_MODULE_3__["OCCURENCE"].Any : _enums__WEBPACK_IMPORTED_MODULE_3__["OCCURENCE"].Last;
        }
        else {
            filterValue = filterValues[0];
            occurence = _enums__WEBPACK_IMPORTED_MODULE_3__["OCCURENCE"].First;
        }
        switch (occurence) {
            case _enums__WEBPACK_IMPORTED_MODULE_3__["OCCURENCE"].First:
                return new RegExp("^" + filterValue, 'i');
            case _enums__WEBPACK_IMPORTED_MODULE_3__["OCCURENCE"].Last:
                return new RegExp(filterValue + "$", 'i');
            default:
                return new RegExp("" + filterValue, 'i');
        }
    };
    Base.prototype.goToWhereLogic = function () {
        var columnName = this.getObjectFirstKey(this.query.where);
        if (this.query.ignoreCase === true) {
            this.query.where = this.makeQryInCaseSensitive(this.query.where);
        }
        if (this.objectStore.indexNames.contains(columnName)) {
            var value = this.query.where[columnName];
            if (typeof value === 'object') {
                var checkFlag = Boolean(Object.keys(value).length > 1 ||
                    Object.keys(this.query.where).length > 1);
                this.whereCheckerInstance = new _where_checker__WEBPACK_IMPORTED_MODULE_1__["WhereChecker"](this.query.where, checkFlag);
                var key = this.getObjectFirstKey(value);
                switch (key) {
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Like:
                        {
                            var regexVal = this.getRegexFromLikeExpression_(value[_enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Like]);
                            this.executeRegexLogic(columnName, regexVal);
                        }
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Regex:
                        this.executeRegexLogic(columnName, value[_enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Regex]);
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].In:
                        this.executeInLogic(columnName, value[_enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].In]);
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Between:
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].GreaterThan:
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].LessThan:
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].GreaterThanEqualTo:
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].LessThanEqualTo:
                        this.executeWhereLogic(columnName, value, key, "next");
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Aggregate: break;
                    default: this.executeWhereLogic(columnName, value, null, "next");
                }
            }
            else {
                var checkFlag = Boolean(Object.keys(this.query.where).length > 1);
                this.whereCheckerInstance = new _where_checker__WEBPACK_IMPORTED_MODULE_1__["WhereChecker"](this.query.where, checkFlag);
                this.executeWhereLogic(columnName, value, null, "next");
            }
        }
        else {
            var column = this.getColumnInfo(columnName, this.tableName);
            var error = column == null ?
                new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["ERROR_TYPE"].ColumnNotExist, { ColumnName: columnName }) :
                new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["ERROR_TYPE"].EnableSearchOff, { ColumnName: columnName });
            this.onErrorOccured(error, true);
        }
    };
    Base.prototype.makeQryInCaseSensitive = function (qry) {
        var results = [];
        var columnValue, keyValue;
        for (var column in qry) {
            columnValue = qry[column];
            switch (this.getType(columnValue)) {
                case _enums__WEBPACK_IMPORTED_MODULE_3__["DATA_TYPE"].String:
                    results = results.concat(this.getAllCombinationOfWord(columnValue));
                    qry[column] = {};
                    qry[column][_enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].In] = results;
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_3__["DATA_TYPE"].Object:
                    for (var key in columnValue) {
                        keyValue = columnValue[key];
                        if (this.isString(keyValue)) {
                            switch (key) {
                                case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].In:
                                    results = results.concat(this.getAllCombinationOfWord(keyValue, true));
                                    break;
                                case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Like:
                                case _enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].Regex:
                                    break;
                                default:
                                    results = results.concat(this.getAllCombinationOfWord(keyValue));
                            }
                        }
                    }
                    qry[column][_enums__WEBPACK_IMPORTED_MODULE_3__["QUERY_OPTION"].In] = results;
                    break;
            }
        }
        return qry;
    };
    Base.prototype.removeSpace = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_4__["Util"].removeSpace(value);
    };
    return Base;
}(_base_helper__WEBPACK_IMPORTED_MODULE_0__["BaseHelper"]));



/***/ }),

/***/ "./src/worker/business/base_db.ts":
/*!****************************************!*\
  !*** ./src/worker/business/base_db.ts ***!
  \****************************************/
/*! exports provided: BaseDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseDb", function() { return BaseDb; });
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/business/idb_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/worker/util.ts");



var BaseDb = /** @class */ (function () {
    function BaseDb() {
    }
    Object.defineProperty(BaseDb.prototype, "dbName", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDb.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDb.prototype, "dbStatus", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus;
        },
        set: function (value) {
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDb.prototype, "dbConnection", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbConnection;
        },
        set: function (value) {
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbConnection = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseDb.prototype.updateDbStatus = function (status, err) {
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].updateDbStatus(status, err);
    };
    BaseDb.prototype.onDbDroppedByBrowser = function (deleteMetaData) {
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].callDbDroppedByBrowser(deleteMetaData);
    };
    Object.defineProperty(BaseDb.prototype, "dbVersion", {
        get: function () {
            return parseInt(_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDbVersion);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDb.prototype, "activeDb", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDb;
        },
        enumerable: true,
        configurable: true
    });
    BaseDb.prototype.getDbList = function () {
        return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbList();
    };
    BaseDb.prototype.setDbList = function (value) {
        return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].setDbList(value);
    };
    BaseDb.prototype.isNullOrEmpty = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].isNullOrEmpty(value);
    };
    BaseDb.prototype.onDbClose = function (event) {
        this.onDbDroppedByBrowser();
        this.updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].ConnectionClosed);
    };
    BaseDb.prototype.onDbVersionChange = function (e) {
        if (e.newVersion === null) { // An attempt is made to delete the db
            e.target.close(); // Manually close our connection to the db
            this.onDbDroppedByBrowser(true);
            this.updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].ConnectionClosed);
        }
    };
    BaseDb.prototype.onDbConError = function (e) {
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus.lastError = ("Error occured in connection :" + e.target.result);
    };
    return BaseDb;
}());



/***/ }),

/***/ "./src/worker/business/base_helper.ts":
/*!********************************************!*\
  !*** ./src/worker/business/base_helper.ts ***!
  \********************************************/
/*! exports provided: BaseHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseHelper", function() { return BaseHelper; });
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/business/idb_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/worker/util.ts");



var BaseHelper = /** @class */ (function () {
    function BaseHelper() {
    }
    Object.defineProperty(BaseHelper.prototype, "activeDb", {
        //   method helpers
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHelper.prototype, "dbConnection", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbConnection;
        },
        enumerable: true,
        configurable: true
    });
    BaseHelper.prototype.getObjectFirstKey = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getObjectFirstKey(value);
    };
    BaseHelper.prototype.getType = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getType(value);
    };
    BaseHelper.prototype.isString = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].isString(value);
    };
    BaseHelper.prototype.isArray = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].isArray(value);
    };
    Object.defineProperty(BaseHelper.prototype, "transaction", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].transaction;
        },
        enumerable: true,
        configurable: true
    });
    BaseHelper.prototype.createTransaction = function (tableNames, callBack, mode) {
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].createTransaction(tableNames, callBack, mode);
    };
    BaseHelper.prototype.regexTest = function (value) {
        return this.regexExpression.test(value);
    };
    BaseHelper.prototype.isTableExist = function (tableName) {
        var index = this.activeDb.tables.findIndex(function (table) { return table.name === tableName; });
        return index >= 0;
    };
    BaseHelper.prototype.getTable = function (tableName) {
        return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getTable(tableName);
    };
    BaseHelper.prototype.getKeyRange = function (value, op) {
        var keyRange;
        switch (op) {
            case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Between:
                keyRange = IDBKeyRange.bound(value.low, value.high, false, false);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].GreaterThan:
                keyRange = IDBKeyRange.lowerBound(value, true);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].GreaterThanEqualTo:
                keyRange = IDBKeyRange.lowerBound(value);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].LessThan:
                keyRange = IDBKeyRange.upperBound(value, true);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].LessThanEqualTo:
                keyRange = IDBKeyRange.upperBound(value);
                break;
            default:
                keyRange = IDBKeyRange.only(value);
                break;
        }
        return keyRange;
    };
    BaseHelper.prototype.getPrimaryKey = function (tableName) {
        var primaryKey = this.getTable(tableName).primaryKey;
        return primaryKey ? primaryKey : this.getKeyPath(tableName);
    };
    BaseHelper.prototype.getKeyPath = function (tableName) {
        var transaction = this.dbConnection.transaction([tableName], "readonly"), objectStore = transaction.objectStore(tableName);
        return objectStore.keyPath;
    };
    BaseHelper.prototype.getAllCombinationOfWord = function (word, isArray) {
        if (isArray) {
            var results = [];
            for (var i = 0, length_1 = word.length; i < length_1; i++) {
                results = results.concat(this.getCombination_(word[i]));
            }
            return results;
        }
        else {
            return this.getCombination_(word);
        }
    };
    BaseHelper.prototype.getCombination_ = function (word) {
        var results = [];
        var doAndPushCombination = function (subWord, chars, index) {
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



/***/ }),

/***/ "./src/worker/business/bulk_insert.ts":
/*!********************************************!*\
  !*** ./src/worker/business/bulk_insert.ts ***!
  \********************************************/
/*! exports provided: BulkInsert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BulkInsert", function() { return BulkInsert; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/worker/business/base.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BulkInsert = /** @class */ (function (_super) {
    __extends(BulkInsert, _super);
    function BulkInsert(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.query = query;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    BulkInsert.prototype.execute = function () {
        try {
            this.bulkinsertData(this.query.values);
            this.query.values = null;
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.query.into });
        }
    };
    BulkInsert.prototype.bulkinsertData = function (values) {
        var _this = this;
        this.createTransaction([this.query.into], function () {
            _this.onSuccess();
        });
        this.objectStore = this.transaction.objectStore(this.query.into);
        var processName = this.query.upsert === true ? "put" : "add";
        for (var i = 0, valueLength = values.length; i < valueLength; i++) {
            this.objectStore[processName](values[i]);
        }
    };
    return BulkInsert;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/clear.ts":
/*!**************************************!*\
  !*** ./src/worker/business/clear.ts ***!
  \**************************************/
/*! exports provided: Clear */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clear", function() { return Clear; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/worker/business/base.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keystore/index */ "./src/worker/keystore/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Clear = /** @class */ (function (_super) {
    __extends(Clear, _super);
    function Clear(tableName, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.query = tableName;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    Clear.prototype.execute = function () {
        var _this = this;
        this.createTransaction([this.query], function () {
            if (_this.error == null) {
                _this.onSuccess();
            }
            else {
                _this.onError(_this.error);
            }
        });
        var clearRequest = this.transaction.objectStore(this.query).clear();
        clearRequest.onsuccess = function (e) {
            var currentTable = _this.getTable(_this.query);
            currentTable.columns.forEach(function (column) {
                if (column.autoIncrement) {
                    _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].set("JsStore_" + _this.activeDb.name + "_" + _this.query + "_" + column.name + "_Value", 0);
                }
            });
        };
        clearRequest.onerror = this.onErrorOccured;
    };
    return Clear;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/count/base_count.ts":
/*!*************************************************!*\
  !*** ./src/worker/business/count/base_count.ts ***!
  \*************************************************/
/*! exports provided: BaseCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseCount", function() { return BaseCount; });
/* harmony import */ var _where_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../where_base */ "./src/worker/business/where_base.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BaseCount = /** @class */ (function (_super) {
    __extends(BaseCount, _super);
    function BaseCount() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resultCount = 0;
        _this.onTransactionCompleted_ = function () {
            if (_this.error == null) {
                _this.onSuccess(_this.resultCount);
            }
            else {
                _this.onError(_this.error);
            }
        };
        return _this;
    }
    BaseCount.prototype.onQueryFinished = function () {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    };
    return BaseCount;
}(_where_base__WEBPACK_IMPORTED_MODULE_0__["WhereBase"]));



/***/ }),

/***/ "./src/worker/business/count/in.ts":
/*!*****************************************!*\
  !*** ./src/worker/business/count/in.ts ***!
  \*****************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./src/worker/business/count/not_where.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var _this = this;
        var cursor, cursorRequest;
        var columnStore = this.objectStore.index(column);
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (_this.whereCheckerInstance.check(cursor.value)) {
                            ++_this.resultCount;
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        if (this.objectStore.count) {
            runInLogic = function (value) {
                return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                    cursorRequest = columnStore.count(_this.getKeyRange(value));
                    cursorRequest.onsuccess = function (e) {
                        _this.resultCount += e.target.result;
                        res();
                    };
                    cursorRequest.onerror = rej;
                });
            };
        }
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    return In;
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./src/worker/business/count/index.ts":
/*!********************************************!*\
  !*** ./src/worker/business/count/index.ts ***!
  \********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/count/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./src/worker/business/count/instance.ts":
/*!***********************************************!*\
  !*** ./src/worker/business/count/instance.ts ***!
  \***********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./src/worker/business/count/where.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./src/worker/business/select/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onError = onError;
        _this.onSuccess = onSuccess;
        _this.query = query;
        return _this;
    }
    Instance.prototype.execute = function () {
        var _this = this;
        try {
            var getDataFromSelect = function () {
                var selectInstance = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"](_this.query, function (results) {
                    _this.resultCount = results.length;
                    _this.onTransactionCompleted_();
                }, _this.onError);
                selectInstance.execute();
            };
            if (this.query.join == null) {
                if (this.query.where != null) {
                    if (this.query.where.or || this.isArray(this.query.where)) {
                        getDataFromSelect();
                    }
                    else {
                        this.initTransaction_();
                        this.goToWhereLogic();
                    }
                }
                else {
                    this.initTransaction_();
                    this.executeWhereUndefinedLogic();
                }
            }
            else {
                getDataFromSelect();
            }
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.query.from });
        }
    };
    Instance.prototype.initTransaction_ = function () {
        this.createTransaction([this.query.from], this.onTransactionCompleted_, _enums__WEBPACK_IMPORTED_MODULE_2__["IDB_MODE"].ReadOnly);
        this.objectStore = this.transaction.objectStore(this.query.from);
    };
    return Instance;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./src/worker/business/count/not_where.ts":
/*!************************************************!*\
  !*** ./src/worker/business/count/not_where.ts ***!
  \************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_count__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_count */ "./src/worker/business/count/base_count.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        if (this.objectStore.count) {
            var countRequest_1 = this.objectStore.count();
            countRequest_1.onsuccess = function () {
                _this.resultCount = countRequest_1.result;
                _this.onQueryFinished();
            };
            countRequest_1.onerror = this.onErrorOccured;
        }
        else {
            var cursor_1;
            var cursorRequest = this.objectStore.openCursor();
            cursorRequest.onsuccess = function (e) {
                cursor_1 = e.target.result;
                if (cursor_1) {
                    ++this._resultCount;
                    cursor_1.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
            cursorRequest.onerror = this.onErrorOccured;
        }
    };
    return NotWhere;
}(_base_count__WEBPACK_IMPORTED_MODULE_0__["BaseCount"]));



/***/ }),

/***/ "./src/worker/business/count/regex.ts":
/*!********************************************!*\
  !*** ./src/worker/business/count/regex.ts ***!
  \********************************************/
/*! exports provided: Regex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Regex", function() { return Regex; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./src/worker/business/count/in.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Regex = /** @class */ (function (_super) {
    __extends(Regex, _super);
    function Regex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Regex.prototype.executeRegexLogic = function (column, exp) {
        var _this = this;
        var cursor;
        this.regexExpression = exp;
        var cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onErrorOccured;
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (_this.regexTest(cursor.key) &&
                    _this.whereCheckerInstance.check(cursor.value)) {
                    ++_this.resultCount;
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return Regex;
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./src/worker/business/count/where.ts":
/*!********************************************!*\
  !*** ./src/worker/business/count/where.ts ***!
  \********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex */ "./src/worker/business/count/regex.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeWhereLogic = function (column, value, op) {
        var _this = this;
        value = op ? value[op] : value;
        var cursorRequest;
        var cursor;
        var initCursorAndFilter;
        if (this.objectStore.count) {
            initCursorAndFilter = function () {
                cursorRequest = _this.objectStore.index(column).count(_this.getKeyRange(value, op));
                cursorRequest.onsuccess = function () {
                    _this.resultCount = cursorRequest.result;
                    _this.onQueryFinished();
                };
            };
        }
        else {
            initCursorAndFilter = function () {
                cursorRequest = _this.objectStore.index(column).openCursor(_this.getKeyRange(value, op));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (_this.whereCheckerInstance.check(cursor.value)) {
                            ++_this.resultCount;
                        }
                        cursor.continue();
                    }
                    else {
                        _this.onQueryFinished();
                    }
                };
            };
        }
        initCursorAndFilter();
        cursorRequest.onerror = this.onErrorOccured;
    };
    return Where;
}(_regex__WEBPACK_IMPORTED_MODULE_0__["Regex"]));



/***/ }),

/***/ "./src/worker/business/drop_db.ts":
/*!****************************************!*\
  !*** ./src/worker/business/drop_db.ts ***!
  \****************************************/
/*! exports provided: DropDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropDb", function() { return DropDb; });
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _base_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./base_db */ "./src/worker/business/base_db.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var DropDb = /** @class */ (function (_super) {
    __extends(DropDb, _super);
    function DropDb(onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onSuccess_ = onSuccess;
        _this.onError_ = onError;
        return _this;
    }
    DropDb.prototype.deleteMetaData = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_4__["promise"])(function (res, rej) {
            _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].remove("JsStore_" + _this.dbName + "_Db_Version");
            _this.activeDb.tables.forEach(function (table) {
                _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].remove("JsStore_" + _this.dbName + "_" + table.name + "_Version");
                table.columns.forEach(function (column) {
                    if (column.autoIncrement) {
                        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].remove("JsStore_" + _this.dbName + "_" + table.name + "_" + column.name + "_Value");
                    }
                });
            });
            // remove from database_list 
            _this.getDbList().then(function (dbList) {
                dbList.splice(dbList.indexOf(_this.dbName), 1);
                _this.setDbList(dbList).then(function () {
                    // remove db schema from keystore
                    _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].remove("JsStore_" + _this.dbName + "_Schema").
                        then(res).catch(rej);
                });
            });
        });
    };
    DropDb.prototype.deleteDb = function () {
        var _this = this;
        setTimeout(function () {
            var dropDbRequest = indexedDB.deleteDatabase(_this.dbName);
            dropDbRequest.onblocked = function () {
                if (_this.onError_ != null) {
                    _this.onError_(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].DbBlocked).get());
                }
            };
            dropDbRequest.onerror = function (e) {
                if (_this.onError_ != null) {
                    _this.onError_(event.target.error);
                }
            };
            dropDbRequest.onsuccess = function () {
                _this.deleteMetaData().then(function () {
                    _this.onSuccess_();
                    _this.dbStatus.conStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed;
                }).catch(_this.onError_);
            };
        }, 100);
    };
    return DropDb;
}(_base_db__WEBPACK_IMPORTED_MODULE_3__["BaseDb"]));



/***/ }),

/***/ "./src/worker/business/idb_helper.ts":
/*!*******************************************!*\
  !*** ./src/worker/business/idb_helper.ts ***!
  \*******************************************/
/*! exports provided: IdbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return IdbHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _drop_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drop_db */ "./src/worker/business/drop_db.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");




var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.callDbDroppedByBrowser = function (deleteMetaData) {
        if (IdbHelper.dbStatus.conStatus === _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Connected) {
            IdbHelper.isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                var dropDbObject = new _drop_db__WEBPACK_IMPORTED_MODULE_2__["DropDb"](function () {
                }, function () {
                });
                dropDbObject.deleteMetaData();
            }
        }
    };
    IdbHelper.createTransaction = function (tableNames, callBack, mode) {
        if (IdbHelper.transaction === null) {
            mode = mode ? mode : _enums__WEBPACK_IMPORTED_MODULE_0__["IDB_MODE"].ReadWrite;
            IdbHelper.transaction = IdbHelper.dbConnection.transaction(tableNames, mode);
            var onComplete = function () {
                IdbHelper.transaction = null;
                callBack();
            };
            IdbHelper.transaction.oncomplete = onComplete;
            IdbHelper.transaction.onabort = onComplete;
        }
    };
    IdbHelper.setDbList = function (list) {
        return _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].set('DataBase_List', list);
    };
    IdbHelper.updateDbStatus = function (status, err) {
        if (err === undefined) {
            IdbHelper.dbStatus.conStatus = status;
        }
        else {
            IdbHelper.dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    };
    IdbHelper.getDbList = function () {
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promise"])(function (res, rej) {
            _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].get('DataBase_List').then(function (result) {
                res(result == null ? [] : result);
            }).catch(rej);
        });
    };
    IdbHelper.getDbVersion = function (dbName) {
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promise"])(function (res, rej) {
            _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].get("JsStore_" + dbName + "_Db_Version").then(function (dbVersion) {
                res(Number(dbVersion));
            }).catch(rej);
        });
    };
    IdbHelper.getDbSchema = function (dbName) {
        return _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].get("JsStore_" + dbName + "_Schema");
    };
    IdbHelper.getTable = function (tableName) {
        var currentTable = IdbHelper.activeDb.tables.find(function (table) { return table.name === tableName; });
        return currentTable;
    };
    IdbHelper.transaction = null;
    IdbHelper.activeDbVersion = 0;
    IdbHelper.dbStatus = {
        conStatus: _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].NotStarted
    };
    return IdbHelper;
}());



/***/ }),

/***/ "./src/worker/business/index.ts":
/*!**************************************!*\
  !*** ./src/worker/business/index.ts ***!
  \**************************************/
/*! exports provided: IdbHelper, DropDb, InitDb, Clear, BulkInsert, QueryHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/business/idb_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]; });

/* harmony import */ var _drop_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drop_db */ "./src/worker/business/drop_db.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DropDb", function() { return _drop_db__WEBPACK_IMPORTED_MODULE_1__["DropDb"]; });

/* harmony import */ var _init_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./init_db */ "./src/worker/business/init_db.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InitDb", function() { return _init_db__WEBPACK_IMPORTED_MODULE_2__["InitDb"]; });

/* harmony import */ var _clear__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./clear */ "./src/worker/business/clear.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Clear", function() { return _clear__WEBPACK_IMPORTED_MODULE_3__["Clear"]; });

/* harmony import */ var _bulk_insert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./bulk_insert */ "./src/worker/business/bulk_insert.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BulkInsert", function() { return _bulk_insert__WEBPACK_IMPORTED_MODULE_4__["BulkInsert"]; });

/* harmony import */ var _query_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./query_helper */ "./src/worker/business/query_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QueryHelper", function() { return _query_helper__WEBPACK_IMPORTED_MODULE_5__["QueryHelper"]; });









/***/ }),

/***/ "./src/worker/business/init_db.ts":
/*!****************************************!*\
  !*** ./src/worker/business/init_db.ts ***!
  \****************************************/
/*! exports provided: InitDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitDb", function() { return InitDb; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _base_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base_db */ "./src/worker/business/base_db.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var InitDb = /** @class */ (function (_super) {
    __extends(InitDb, _super);
    function InitDb(onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    InitDb.prototype.execute = function (tablesMetaData) {
        var _this = this;
        var listofTableCreated = [];
        var dbRequest = indexedDB.open(this.dbName, this.dbVersion);
        var isDbCreated = false;
        dbRequest.onerror = function (event) {
            if (_this.onError != null) {
                _this.onError(event.target.error);
            }
        };
        dbRequest.onsuccess = function (event) {
            _this.dbStatus.conStatus = _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Connected;
            _this.dbConnection = dbRequest.result;
            _this.dbConnection.onclose = _this.onDbClose.bind(_this);
            _this.dbConnection.onversionchange = _this.onDbVersionChange.bind(_this);
            _this.dbConnection.onerror = _this.onDbConError.bind(_this);
            if (isDbCreated) {
                // save in database list
                _this.savedbNameIntoDbList_().then(function () {
                    if (_this.onSuccess != null) {
                        _this.onSuccess(isDbCreated);
                    }
                });
            }
            else {
                _this.setPrimaryKey_();
                _this.onSuccess(isDbCreated);
            }
        };
        dbRequest.onupgradeneeded = function (event) {
            isDbCreated = true;
            var dbConnection = event.target.result;
            var createObjectStore = function (item, index) {
                try {
                    var store_1;
                    if (item.primaryKey.length > 0) {
                        _this.activeDb.tables[index].primaryKey = item.primaryKey;
                        store_1 = dbConnection.createObjectStore(item.name, {
                            keyPath: item.primaryKey
                        });
                    }
                    else {
                        store_1 = dbConnection.createObjectStore(item.name, {
                            autoIncrement: true
                        });
                    }
                    item.columns.forEach(function (column) {
                        if (column.enableSearch === true) {
                            var options = column.primaryKey ? { unique: true } : { unique: column.unique };
                            options['multiEntry'] = column.multiEntry;
                            var keyPath = column.keyPath == null ? column.name : column.keyPath;
                            store_1.createIndex(column.name, keyPath, options);
                            if (column.autoIncrement) {
                                _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].set("JsStore_" + _this.dbName + "_" + item.name + "_" + column.name + "_Value", 0);
                            }
                        }
                    });
                    listofTableCreated.push(item.name);
                    // setting the table version
                    _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].set("JsStore_" + _this.dbName + "_" + item.name + "_Version", item.version);
                }
                catch (e) {
                    console.error(e);
                }
            };
            tablesMetaData.forEach(function (item, index) {
                if (item.requireDelete) {
                    // Delete the old datastore.    
                    if (dbConnection.objectStoreNames.contains(item.name)) {
                        dbConnection.deleteObjectStore(item.name);
                    }
                    createObjectStore(item, index);
                }
                else if (item.requireCreation) {
                    createObjectStore(item, index);
                }
            });
        };
    };
    InitDb.prototype.savedbNameIntoDbList_ = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promise"])(function (res, rej) {
            _this.getDbList().then(function (dbList) {
                if (dbList.indexOf(_this.dbName) < 0) {
                    dbList.push(_this.dbName);
                    _this.setDbList(dbList).then(res).catch(rej);
                }
                else {
                    res();
                }
            }).catch(rej);
        });
    };
    InitDb.prototype.setPrimaryKey_ = function () {
        var _this = this;
        this.activeDb.tables.forEach(function (table, index) {
            table.columns.every(function (item) {
                _this.activeDb.tables[index].primaryKey = item.primaryKey ? item.name : "";
                return !item.primaryKey;
            });
        });
    };
    return InitDb;
}(_base_db__WEBPACK_IMPORTED_MODULE_2__["BaseDb"]));



/***/ }),

/***/ "./src/worker/business/insert/index.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/insert/index.ts ***!
  \*********************************************/
/*! exports provided: Instance, ValuesChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/insert/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });

/* harmony import */ var _values_checker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./values_checker */ "./src/worker/business/insert/values_checker.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ValuesChecker", function() { return _values_checker__WEBPACK_IMPORTED_MODULE_1__["ValuesChecker"]; });





/***/ }),

/***/ "./src/worker/business/insert/instance.ts":
/*!************************************************!*\
  !*** ./src/worker/business/insert/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./src/worker/business/base.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.valuesAffected_ = [];
        _this.onTransactionCompleted_ = function () {
            if (_this.error == null) {
                _this.onSuccess(_this.query.return === true ? _this.valuesAffected_ : _this.rowAffected);
            }
            else {
                _this.onError(_this.error);
            }
        };
        _this.onError = onError;
        _this.query = query;
        _this.onSuccess = onSuccess;
        _this.tableName = _this.query.into;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            this.insertData_(this.query.values);
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.tableName });
        }
    };
    Instance.prototype.onQueryFinished_ = function () {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    };
    Instance.prototype.insertData_ = function (values) {
        // let valueIndex = 0;
        var _this = this;
        var objectStore;
        var processName = this.query.upsert === true ? "put" : "add";
        var onInsertData;
        if (this.query.return === true) {
            onInsertData = function (value) {
                _this.valuesAffected_.push(value);
            };
        }
        else {
            onInsertData = function (value) {
                ++_this.rowAffected;
            };
        }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        objectStore = this.transaction.objectStore(this.query.into);
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                var addResult = objectStore[processName](value);
                addResult.onerror = rej;
                addResult.onsuccess = function () {
                    onInsertData(value);
                    res();
                };
            });
        })).then(function () {
            _this.onQueryFinished_();
        }).catch(function (err) {
            _this.transaction.abort();
            _this.onErrorOccured(err);
        });
    };
    return Instance;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/insert/value_checker.ts":
/*!*****************************************************!*\
  !*** ./src/worker/business/insert/value_checker.ts ***!
  \*****************************************************/
/*! exports provided: ValueChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValueChecker", function() { return ValueChecker; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util */ "./src/worker/util.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");



var ValueChecker = /** @class */ (function () {
    function ValueChecker(table, autoIncrementValue) {
        this.errorOccured = false;
        this.autoIncrementValue = {};
        this.table = table;
        this.autoIncrementValue = autoIncrementValue;
    }
    ValueChecker.prototype.checkAndModifyValue = function (value) {
        var _this = this;
        this.value = value;
        this.table.columns.every(function (column) {
            _this.checkAndModifyColumnValue_(column);
            return !_this.errorOccured;
        });
        return this.errorOccured;
    };
    ValueChecker.prototype.isNull_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_0__["Util"].isNull(value);
    };
    ValueChecker.prototype.getType_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_0__["Util"].getType(value);
    };
    ValueChecker.prototype.checkNotNullAndDataType_ = function (column) {
        // check not null schema
        if (column.notNull && this.isNull_(this.value[column.name])) {
            this.onValidationError_(_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].NullValue, { ColumnName: column.name });
        }
        // check datatype
        else if (column.dataType && !this.isNull_(this.value[column.name]) &&
            this.getType_(this.value[column.name]) !== column.dataType) {
            this.onValidationError_(_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].WrongDataType, { ColumnName: column.name });
        }
    };
    ValueChecker.prototype.checkAndModifyColumnValue_ = function (column) {
        var columnValue = this.value[column.name];
        // check auto increment scheme
        if (column.autoIncrement) {
            // if value is null, then create the autoincrement value
            if (this.isNull_(columnValue)) {
                this.value[column.name] = ++this.autoIncrementValue[column.name];
            }
            else {
                if (this.getType_(columnValue) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Number) {
                    // if column value is greater than autoincrement value saved, then make the
                    // column value as autoIncrement value
                    if (columnValue > this.autoIncrementValue[column.name]) {
                        this.autoIncrementValue[column.name] = columnValue;
                    }
                }
            }
        }
        // check Default Schema
        else if (column.default && this.isNull_(columnValue)) {
            this.value[column.name] = column.default;
        }
        this.checkNotNullAndDataType_(column);
    };
    ValueChecker.prototype.onValidationError_ = function (error, details) {
        this.errorOccured = true;
        this.log = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](error, details);
    };
    return ValueChecker;
}());



/***/ }),

/***/ "./src/worker/business/insert/values_checker.ts":
/*!******************************************************!*\
  !*** ./src/worker/business/insert/values_checker.ts ***!
  \******************************************************/
/*! exports provided: ValuesChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValuesChecker", function() { return ValuesChecker; });
/* harmony import */ var _value_checker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./value_checker */ "./src/worker/business/insert/value_checker.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./src/worker/util.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../query_executor */ "./src/worker/query_executor.ts");
/* harmony import */ var _query_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../query_helper */ "./src/worker/business/query_helper.ts");





var ValuesChecker = /** @class */ (function () {
    function ValuesChecker(table, values) {
        this.table = table;
        this.values = values;
    }
    ValuesChecker.prototype.checkAndModifyValues = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (resolve, reject) {
            var onAutoIncValueEvaluated = function (autoIncrementValues) {
                _this.valueCheckerObj = new _value_checker__WEBPACK_IMPORTED_MODULE_0__["ValueChecker"](_this.table, autoIncrementValues);
                _this.startChecking().then(resolve).catch(reject);
            };
            if (_query_executor__WEBPACK_IMPORTED_MODULE_3__["QueryExecutor"].isTransactionQuery === false) {
                _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getAutoIncrementValues(_this.table).then(function (autoIncValues) {
                    onAutoIncValueEvaluated(autoIncValues);
                }).catch(reject);
            }
            else {
                onAutoIncValueEvaluated(_query_helper__WEBPACK_IMPORTED_MODULE_4__["QueryHelper"].autoIncrementValues[_this.table.name]);
            }
        });
    };
    ValuesChecker.prototype.startChecking = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (resolve, reject) {
            var isError = false;
            _this.values.every(function (item) {
                isError = _this.valueCheckerObj.checkAndModifyValue(item);
                return !isError;
            });
            if (isError) {
                var error = _this.valueCheckerObj.log.get();
                reject(error);
            }
            var promiseObj = _util__WEBPACK_IMPORTED_MODULE_2__["Util"].setAutoIncrementValue(_this.table, _this.valueCheckerObj.autoIncrementValue);
            if (_query_executor__WEBPACK_IMPORTED_MODULE_3__["QueryExecutor"].isTransactionQuery === false) {
                promiseObj.then(resolve).catch(reject);
            }
            else {
                resolve();
            }
        });
    };
    return ValuesChecker;
}());



/***/ }),

/***/ "./src/worker/business/query_helper.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/query_helper.ts ***!
  \*********************************************/
/*! exports provided: QueryHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryHelper", function() { return QueryHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/business/idb_helper.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./src/worker/util.ts");
/* harmony import */ var _update_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./update/index */ "./src/worker/business/update/index.ts");
/* harmony import */ var _insert_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./insert/index */ "./src/worker/business/insert/index.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");







var QueryHelper = /** @class */ (function () {
    function QueryHelper(api, query) {
        this.isTransaction = false;
        this.api = api;
        this.query = query;
    }
    QueryHelper.prototype.checkAndModify = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_6__["promise"])(function (resolve, reject) {
            var resolveReject = function () {
                if (_this.error == null) {
                    resolve();
                }
                else {
                    reject(_this.error);
                }
            };
            switch (_this.api) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Select:
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Remove:
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Count:
                    _this.checkFetchQuery_();
                    resolveReject();
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Insert:
                    _this.checkInsertQuery_().then(resolveReject).
                        catch(function (err) {
                        _this.error = err;
                        resolveReject();
                    });
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].Update:
                    _this.checkUpdateQuery_();
                    resolveReject();
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["API"].BulkInsert:
                    _this.checkBulkInsert_();
                    break;
            }
        });
    };
    QueryHelper.prototype.isInsertQryValid_ = function (callBack) {
        var table = this.getTable_(this.query.into);
        var log;
        if (table) {
            switch (this.getType_(this.query.values)) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Array:
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Null:
                    log = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NoValueSupplied);
                    break;
                default:
                    log = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NotArray);
            }
        }
        else {
            log = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].TableNotExist, { tableName: this.query.into });
        }
        callBack(table);
        return log == null ? null : log.get();
    };
    QueryHelper.prototype.checkBulkInsert_ = function () {
        this.error = this.isInsertQryValid_(function () {
        });
    };
    QueryHelper.prototype.checkInsertQuery_ = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_6__["promise"])(function (resolve, reject) {
            var table;
            var err = _this.isInsertQryValid_(function (tbl) {
                table = tbl;
            });
            if (err == null) {
                if (_this.query.skipDataCheck === true) {
                    resolve();
                }
                else {
                    var valueCheckerInstance_1 = new _insert_index__WEBPACK_IMPORTED_MODULE_5__["ValuesChecker"](table, _this.query.values);
                    valueCheckerInstance_1.checkAndModifyValues().then(function () {
                        _this.query.values = valueCheckerInstance_1.values;
                        resolve();
                    }).catch(reject);
                }
            }
            else {
                reject(err);
            }
        });
    };
    QueryHelper.prototype.checkUpdateQuery_ = function () {
        this.error = new _update_index__WEBPACK_IMPORTED_MODULE_4__["SchemaChecker"](this.getTable_(this.query.in)).
            check(this.query.set, this.query.in);
        if (this.error == null) {
            if (this.query.where != null) {
                this.checkForNullInWhere_();
                if (this.error == null) {
                    this.addGreatAndLessToNotOp_();
                }
            }
        }
    };
    QueryHelper.prototype.checkForNullInWhere_ = function () {
        for (var key in this.query.where) {
            if (this.query.where[key] == null) {
                this.error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NullValueInWhere, { column: key }).get();
                return;
            }
        }
    };
    QueryHelper.prototype.checkFetchQuery_ = function () {
        if (this.isTableExist_(this.query.from) === true) {
            if (this.query.where != null) {
                this.checkForNullInWhere_();
                if (this.error == null) {
                    this.addGreatAndLessToNotOp_();
                }
            }
        }
        else {
            this.error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].TableNotExist, { tableName: this.query.from }).get();
        }
    };
    QueryHelper.prototype.isTableExist_ = function (tableName) {
        var index = this.activeDb_.tables.findIndex(function (table) { return table.name === tableName; });
        return index >= 0;
    };
    Object.defineProperty(QueryHelper.prototype, "activeDb_", {
        get: function () {
            return _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDb;
        },
        enumerable: true,
        configurable: true
    });
    QueryHelper.prototype.getTable_ = function (tableName) {
        return _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].getTable(tableName);
    };
    QueryHelper.prototype.addGreatAndLessToNotOp_ = function () {
        var whereQuery = this.query.where;
        var containsNot = function (qry, keys) {
            return keys.findIndex(function (key) { return qry[key][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo] != null; }) >= 0;
        };
        var addToSingleQry = function (qry, keys) {
            var value;
            keys.forEach(function (prop) {
                value = qry[prop];
                if (value[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo] != null) {
                    qry[prop][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].GreaterThan] = value[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo];
                    if (qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or] === undefined) {
                        qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or] = {};
                        qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or][prop] = {};
                    }
                    else if (qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or][prop] === undefined) {
                        qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or][prop] = {};
                    }
                    qry[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or][prop][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].LessThan] = value[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo];
                    delete qry[prop][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo];
                }
            });
            return qry;
        };
        switch (this.getType_(whereQuery)) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Object:
                var queryKeys = Object.keys(whereQuery);
                if (containsNot(whereQuery, queryKeys)) {
                    if (queryKeys.length === 1) {
                        this.query.where = addToSingleQry(whereQuery, queryKeys);
                    }
                    else {
                        var whereTmpQry_1 = [];
                        queryKeys.forEach(function (prop) {
                            var _a;
                            whereTmpQry_1.push(addToSingleQry((_a = {}, _a[prop] = whereQuery[prop], _a), [prop]));
                        });
                        this.query.where = whereTmpQry_1;
                    }
                }
                break;
            default:
                var whereTmp_1 = [];
                whereQuery.forEach(function (qry) {
                    var qryKeys = Object.keys(qry);
                    if (containsNot(qry, qryKeys)) {
                        qry = addToSingleQry(qry, qryKeys);
                    }
                    whereTmp_1.push(qry);
                });
                this.query.where = whereTmp_1;
        }
    };
    QueryHelper.prototype.getType_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_3__["Util"].getType(value);
    };
    QueryHelper.autoIncrementValues = {};
    return QueryHelper;
}());



/***/ }),

/***/ "./src/worker/business/remove/base_remove.ts":
/*!***************************************************!*\
  !*** ./src/worker/business/remove/base_remove.ts ***!
  \***************************************************/
/*! exports provided: BaseRemove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseRemove", function() { return BaseRemove; });
/* harmony import */ var _where_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../where_base */ "./src/worker/business/where_base.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BaseRemove = /** @class */ (function (_super) {
    __extends(BaseRemove, _super);
    function BaseRemove() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseRemove.prototype.onQueryFinished = function () {
        // ff
    };
    return BaseRemove;
}(_where_base__WEBPACK_IMPORTED_MODULE_0__["WhereBase"]));



/***/ }),

/***/ "./src/worker/business/remove/in.ts":
/*!******************************************!*\
  !*** ./src/worker/business/remove/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./src/worker/business/remove/not_where.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var _this = this;
        var cursor, cursorRequest;
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = _this.objectStore.index(column).openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (_this.whereCheckerInstance.check(cursor.value)) {
                            cursor.delete();
                            ++_this.rowAffected;
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    return In;
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./src/worker/business/remove/index.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/remove/index.ts ***!
  \*********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/remove/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./src/worker/business/remove/instance.ts":
/*!************************************************!*\
  !*** ./src/worker/business/remove/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./src/worker/business/remove/where.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./src/worker/business/select/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onTransactionCompleted_ = function () {
            if (_this.error == null) {
                _this.onSuccess(_this.rowAffected);
            }
            else {
                _this.onError(_this.error);
            }
        };
        _this.query = query;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            this.initTransaction_();
            if (this.query.where != null) {
                if (this.isArray(this.query.where)) {
                    this.processWhereArrayQry();
                }
                else {
                    this.processWhere_();
                }
            }
            else {
                this.executeWhereUndefinedLogic();
            }
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.query.from });
        }
    };
    Instance.prototype.processWhereArrayQry = function () {
        var _this = this;
        var selectObject = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"](this.query, function (results) {
            var _a, _b;
            var keyList = [];
            var pkey = _this.getPrimaryKey(_this.query.from);
            results.forEach(function (item) {
                keyList.push(item[pkey]);
            });
            results = null;
            var whereQry = (_a = {}, _a[pkey] = (_b = {}, _b[_enums__WEBPACK_IMPORTED_MODULE_2__["QUERY_OPTION"].In] = keyList, _b), _a);
            _this.query.ignoreCase = null;
            _this.query[_enums__WEBPACK_IMPORTED_MODULE_2__["QUERY_OPTION"].Where] = whereQry;
            _this.processWhere_();
        }, this.onError);
        selectObject.isSubQuery = true;
        selectObject.execute();
    };
    Instance.prototype.processWhere_ = function () {
        if (this.query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    };
    Instance.prototype.initTransaction_ = function () {
        this.createTransaction([this.query.from], this.onTransactionCompleted_);
        this.objectStore = this.transaction.objectStore(this.query.from);
    };
    Instance.prototype.onQueryFinished = function () {
        if (this.isOr === true) {
            this.orQuerySuccess_();
        }
        else if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    };
    Instance.prototype.orQuerySuccess_ = function () {
        var key = this.getObjectFirstKey(this._orInfo.OrQuery);
        if (key != null) {
            var where = {};
            where[key] = this._orInfo.OrQuery[key];
            delete this._orInfo.OrQuery[key];
            this.query.where = where;
            this.goToWhereLogic();
        }
        else {
            this.isOr = true;
        }
    };
    Instance.prototype.processOrLogic = function () {
        this.isOr = true;
        this._orInfo = {
            OrQuery: this.query.where.or
        };
        // free or memory
        delete this.query.where.or;
    };
    return Instance;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./src/worker/business/remove/not_where.ts":
/*!*************************************************!*\
  !*** ./src/worker/business/remove/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_remove__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_remove */ "./src/worker/business/remove/base_remove.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        var cursor;
        var cursorRequest = this.objectStore.openCursor();
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                ++_this.rowAffected;
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursorRequest.onerror = this.onErrorOccured;
    };
    return NotWhere;
}(_base_remove__WEBPACK_IMPORTED_MODULE_0__["BaseRemove"]));



/***/ }),

/***/ "./src/worker/business/remove/regex.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/remove/regex.ts ***!
  \*********************************************/
/*! exports provided: Regex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Regex", function() { return Regex; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./src/worker/business/remove/in.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Regex = /** @class */ (function (_super) {
    __extends(Regex, _super);
    function Regex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Regex.prototype.executeRegexLogic = function (column, exp) {
        var _this = this;
        var cursor;
        this.regexExpression = exp;
        var cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onErrorOccured;
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (_this.regexTest(cursor.key) &&
                    _this.whereCheckerInstance.check(cursor.value)) {
                    cursor.delete();
                    ++_this.rowAffected;
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return Regex;
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./src/worker/business/remove/where.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/remove/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex */ "./src/worker/business/remove/regex.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeWhereLogic = function (column, value, op) {
        var _this = this;
        var cursor, cursorRequest;
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (_this.whereCheckerInstance.check(cursor.value)) {
                    cursor.delete();
                    ++_this.rowAffected;
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursorRequest.onerror = this.onErrorOccured;
    };
    return Where;
}(_regex__WEBPACK_IMPORTED_MODULE_0__["Regex"]));



/***/ }),

/***/ "./src/worker/business/select/base_select.ts":
/*!***************************************************!*\
  !*** ./src/worker/business/select/base_select.ts ***!
  \***************************************************/
/*! exports provided: BaseSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseSelect", function() { return BaseSelect; });
/* harmony import */ var _where_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../where_base */ "./src/worker/business/where_base.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BaseSelect = /** @class */ (function (_super) {
    __extends(BaseSelect, _super);
    function BaseSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sorted = false;
        _this.isSubQuery = false;
        _this.isOrderWithLimit = false;
        return _this;
    }
    BaseSelect.prototype.removeDuplicates = function () {
        var datas = this.results;
        // free results memory
        this.results = undefined;
        var key = this.getPrimaryKey(this.query.from);
        var lookupObject = {};
        for (var i in datas) {
            lookupObject[datas[i][key]] = datas[i];
        }
        // free datas memory
        datas = [];
        for (var i in lookupObject) {
            datas.push(lookupObject[i]);
        }
        this.results = datas;
    };
    return BaseSelect;
}(_where_base__WEBPACK_IMPORTED_MODULE_0__["WhereBase"]));



/***/ }),

/***/ "./src/worker/business/select/group_by_helper.ts":
/*!*******************************************************!*\
  !*** ./src/worker/business/select/group_by_helper.ts ***!
  \*******************************************************/
/*! exports provided: GroupByHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupByHelper", function() { return GroupByHelper; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./src/worker/business/select/where.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var GroupByHelper = /** @class */ (function (_super) {
    __extends(GroupByHelper, _super);
    function GroupByHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupByHelper.prototype.processGroupBy = function () {
        var grpQry = this.query.groupBy;
        var datas = this.results;
        var lookUpObj = {};
        // free results memory
        this.results = this.query.groupBy = undefined;
        if (this.getType(grpQry) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String) {
            for (var i in datas) {
                lookUpObj[datas[i][grpQry]] = datas[i];
            }
        }
        else {
            var objKey = void 0;
            for (var i in datas) {
                objKey = "";
                for (var column in grpQry) {
                    objKey += datas[i][grpQry[column]];
                }
                lookUpObj[objKey] = datas[i];
            }
        }
        // free datas memory
        datas = [];
        for (var i in lookUpObj) {
            datas.push(lookUpObj[i]);
        }
        this.results = datas;
    };
    GroupByHelper.prototype.executeAggregateGroupBy = function () {
        var _this = this;
        var grpQry = this.query.groupBy;
        var datas = this.results;
        // free results memory
        this.results = undefined;
        var lookUpObj = {};
        // assign aggregate
        var aggregateQry = this.query.aggregate;
        var index;
        var objKey;
        var value;
        var columnToAggregate;
        var calculateAggregate = function () {
            var getCount = function () {
                value = lookUpObj[objKey];
                // get old value
                value = value ? value["count(" + columnToAggregate + ")"] : 0;
                // add with old value if data exist
                value += datas[index][columnToAggregate] ? 1 : 0;
                return value;
            };
            var getMax = function () {
                value = lookUpObj[objKey];
                // get old value
                value = value ? value["max(" + columnToAggregate + ")"] : 0;
                datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                    datas[index][columnToAggregate] : 0;
                // compare between old value and new value
                return value > datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
            };
            var getMin = function () {
                value = lookUpObj[objKey];
                // get old value
                value = value ? value["min(" + columnToAggregate + ")"] : Infinity;
                datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                    datas[index][columnToAggregate] : Infinity;
                // compare between old value and new value
                return value < datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
            };
            var getSum = function () {
                value = lookUpObj[objKey];
                // get old value
                value = value ? value["sum(" + columnToAggregate + ")"] : 0;
                // add with old value if data exist
                value += datas[index][columnToAggregate] ? datas[index][columnToAggregate] : 0;
                return value;
            };
            var getAvg = function () {
                value = lookUpObj[objKey];
                // get old sum value
                var sumOfColumn = value ? value["sum(" + columnToAggregate + ")"] : 0;
                // add with old value if data exist
                sumOfColumn += datas[index][columnToAggregate] ? datas[index][columnToAggregate] : 0;
                datas[index]["sum(" + columnToAggregate + ")"] = sumOfColumn;
                // get old count value
                value = value ? value["count(" + columnToAggregate + ")"] : 0;
                // add with old value if data exist
                value += datas[index][columnToAggregate] ? 1 : 0;
                datas[index]["count(" + columnToAggregate + ")"] = value;
            };
            for (var prop in aggregateQry) {
                var aggregateColumn = aggregateQry[prop];
                var aggregateValType = _this.getType(aggregateColumn);
                var aggregateCalculator = void 0;
                switch (prop) {
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Count:
                        aggregateCalculator = getCount;
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Max:
                        aggregateCalculator = getMax;
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Min:
                        aggregateCalculator = getMin;
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Sum:
                        aggregateCalculator = getSum;
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Avg:
                        aggregateCalculator = getAvg;
                        break;
                }
                switch (aggregateValType) {
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String:
                        columnToAggregate = aggregateColumn;
                        datas[index][prop + "(" + columnToAggregate + ")"] = aggregateCalculator();
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Array:
                        for (var item in aggregateColumn) {
                            columnToAggregate = aggregateColumn[item];
                            datas[index][prop + "(" + columnToAggregate + ")"] = aggregateCalculator();
                        }
                }
            }
        };
        if (this.getType(grpQry) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String) {
            for (index in datas) {
                objKey = datas[index][grpQry];
                calculateAggregate();
                lookUpObj[objKey] = datas[index];
            }
        }
        else {
            for (index in datas) {
                objKey = "";
                for (var column in grpQry) {
                    objKey += datas[index][grpQry[column]];
                }
                calculateAggregate();
                lookUpObj[objKey] = datas[index];
            }
        }
        // free datas memory
        datas = [];
        for (var i in lookUpObj) {
            datas.push(lookUpObj[i]);
        }
        // Checking for avg and if exist then fill the datas;
        if (aggregateQry.avg) {
            if (this.getType(aggregateQry.avg) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String) {
                for (index in datas) {
                    var sumForAvg = datas[index]["sum(" + aggregateQry.avg + ")"], countForAvg = datas[index]["count(" + aggregateQry.avg + ")"];
                    datas[index]["avg(" + aggregateQry.avg + ")"] = sumForAvg / countForAvg;
                    if (aggregateQry.count !== aggregateQry.avg) {
                        delete datas[index]["count(" + aggregateQry.avg + ")"];
                    }
                    if (aggregateQry.sum !== aggregateQry.avg) {
                        delete datas[index]["sum(" + aggregateQry.avg + ")"];
                    }
                }
            }
            else {
                var isCountTypeString = this.getType(aggregateQry.count) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String;
                var isSumTypeString = this.getType(aggregateQry.sum) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String;
                for (index in datas) {
                    for (var column in aggregateQry.avg) {
                        var avgColumn = aggregateQry.avg[column], sum = datas[index]["sum(" + avgColumn + ")"], count = datas[index]["count(" + avgColumn + ")"];
                        datas[index]["avg(" + avgColumn + ")"] = sum / count;
                        if (isCountTypeString) {
                            if (aggregateQry.count !== avgColumn) {
                                delete datas[index]["count(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.count.indexOf(avgColumn) === -1) {
                                delete datas[index]["count(" + avgColumn + ")"];
                            }
                        }
                        if (isSumTypeString) {
                            if (aggregateQry.sum !== avgColumn) {
                                delete datas[index]["sum(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.sum.indexOf(avgColumn) === -1) {
                                delete datas[index]["sum(" + avgColumn + ")"];
                            }
                        }
                    }
                }
            }
        }
        this.results = datas;
    };
    return GroupByHelper;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./src/worker/business/select/in.ts":
/*!******************************************!*\
  !*** ./src/worker/business/select/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./src/worker/business/select/not_where.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var shouldAddValue;
var skipOrPush;
var skip;
var cursor;
var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var _this = this;
        skip = this.skipRecord;
        skipOrPush = function (val) {
            if (skip === 0) {
                _this.results.push(val);
            }
            else {
                --skip;
            }
        };
        shouldAddValue = function () {
            return _this.whereCheckerInstance.check(cursor.value);
        };
        if (this.skipRecord && this.limitRecord) {
            this.executeSkipAndLimitForIn_(column, values);
        }
        else if (this.skipRecord) {
            this.executeSkipForIn_(column, values);
        }
        else if (this.limitRecord) {
            this.executeLimitForIn_(column, values);
        }
        else {
            this.executeSimpleForIn_(column, values);
        }
    };
    In.prototype.executeSkipAndLimitForIn_ = function (column, values) {
        var _this = this;
        var cursorRequest;
        var columnStore = this.objectStore.index(column);
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (_this.results.length !== _this.limitRecord && cursor) {
                        if (shouldAddValue()) {
                            skipOrPush(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    In.prototype.executeSkipForIn_ = function (column, values) {
        var _this = this;
        var cursorRequest;
        var columnStore = this.objectStore.index(column);
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (shouldAddValue()) {
                            skipOrPush((cursor.value));
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    In.prototype.executeLimitForIn_ = function (column, values) {
        var _this = this;
        var cursorRequest;
        var columnStore = this.objectStore.index(column);
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor && _this.results.length !== _this.limitRecord) {
                        if (shouldAddValue()) {
                            _this.results.push(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    In.prototype.executeSimpleForIn_ = function (column, values) {
        var _this = this;
        var cursorRequest;
        var columnStore = this.objectStore.index(column);
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (shouldAddValue()) {
                            _this.results.push(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    return In;
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./src/worker/business/select/index.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/select/index.ts ***!
  \*********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/select/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./src/worker/business/select/instance.ts":
/*!************************************************!*\
  !*** ./src/worker/business/select/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _join__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./join */ "./src/worker/business/select/join.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onTransactionCompleted_ = function () {
            if (_this.error == null) {
                _this.processOrderBy();
                if (!_this.error) {
                    if (_this.isOrderWithLimit === true) {
                        _this.results = _this.results.slice(0, _this.query.limit);
                    }
                    if (_this.query.distinct) {
                        var groupBy = [];
                        var result = _this.results[0];
                        for (var key in result) {
                            groupBy.push(key);
                        }
                        var primaryKey = _this.getPrimaryKey(_this.query.from), index = groupBy.indexOf(primaryKey);
                        groupBy.splice(index, 1);
                        _this.query.groupBy = groupBy.length > 0 ? groupBy : null;
                    }
                    if (_this.query.groupBy) {
                        if (_this.query.aggregate) {
                            _this.executeAggregateGroupBy();
                        }
                        else {
                            _this.processGroupBy();
                        }
                    }
                    else if (_this.query.aggregate) {
                        _this.processAggregateQry();
                    }
                    _this.onSuccess(_this.results);
                }
                else {
                    _this.onError(_this.error);
                }
            }
            else {
                _this.onError(_this.error);
            }
        };
        _this.onError = onError;
        _this.onSuccess = onSuccess;
        _this.query = query;
        _this.skipRecord = query.skip;
        _this.limitRecord = query.limit;
        _this.tableName = query.from;
        if (query.order && query.order.by && query.limit != null) {
            _this.isOrderWithLimit = true;
        }
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            if (this.query.join == null) {
                if (this.query.where != null) {
                    this.initTransaction_();
                    if (this.isArray(this.query.where)) {
                        this.processWhereArrayQry();
                    }
                    else {
                        this.processWhere_();
                    }
                }
                else {
                    this.initTransaction_();
                    this.executeWhereUndefinedLogic();
                }
            }
            else {
                this.executeJoinQuery();
            }
        }
        catch (ex) {
            this.onExceptionOccured(ex, { TableName: this.query.from });
        }
    };
    Instance.prototype.processWhereArrayQry = function () {
        var _this = this;
        this.isArrayQry = true;
        var whereQuery = this.query.where, pKey = this.getPrimaryKey(this.query.from);
        var isFirstWhere = true, output = [], operation;
        var isItemExist = function (keyValue) {
            return output.findIndex(function (item) { return item[pKey] === keyValue; }) >= 0;
        };
        var onSuccess = function () {
            if (operation === _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].And) {
                var doAnd = function () {
                    var andResults = [];
                    _this.results.forEach(function (item) {
                        if (isItemExist(item[pKey])) {
                            andResults.push(item);
                        }
                    });
                    output = andResults;
                    andResults = null;
                };
                if (output.length > 0) {
                    doAnd();
                }
                else if (isFirstWhere === true) {
                    output = _this.results;
                }
                else {
                    doAnd();
                }
            }
            else {
                if (output.length > 0) {
                    _this.results = output.concat(_this.results);
                    _this.removeDuplicates();
                    output = _this.results;
                }
                else {
                    output = _this.results;
                }
            }
            isFirstWhere = false;
            if (whereQuery.length > 0) {
                _this.results = [];
                processFirstQry();
            }
            else {
                _this.results = output;
                if (_this.isSubQuery === true) {
                    _this.onTransactionCompleted_();
                }
            }
        };
        var processFirstQry = function () {
            _this.query.where = whereQuery.shift();
            if (_this.query.where[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or]) {
                if (Object.keys(_this.query.where).length === 1) {
                    operation = _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or;
                    _this.query.where = _this.query.where[_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Or];
                    _this.onWhereArrayQrySuccess = onSuccess;
                }
                else {
                    operation = _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].And;
                    _this.onWhereArrayQrySuccess = onSuccess;
                }
            }
            else {
                operation = _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].And;
                _this.onWhereArrayQrySuccess = onSuccess;
            }
            _this.processWhere_();
        };
        processFirstQry();
    };
    Instance.prototype.onQueryFinished = function () {
        if (this.isOr === true) {
            this.orQuerySuccess_();
        }
        else if (this.isArrayQry === true) {
            this.onWhereArrayQrySuccess();
        }
        else if (this.isTransaction === true || this.isSubQuery === true) {
            this.onTransactionCompleted_();
        }
    };
    Instance.prototype.initTransaction_ = function () {
        this.createTransaction([this.tableName], this.onTransactionCompleted_, _enums__WEBPACK_IMPORTED_MODULE_0__["IDB_MODE"].ReadOnly);
        this.objectStore = this.transaction.objectStore(this.tableName);
    };
    Instance.prototype.processWhere_ = function () {
        if (this.query.where.or) {
            this.processOrLogic_();
        }
        this.goToWhereLogic();
    };
    Instance.prototype.orQueryFinish_ = function () {
        this.isOr = false;
        this.results = this.orInfo.results;
        // free or info memory
        this.orInfo = undefined;
        this.removeDuplicates();
        this.onQueryFinished();
    };
    Instance.prototype.orQuerySuccess_ = function () {
        this.orInfo.results = this.orInfo.results.concat(this.results);
        if (!this.query.limit || (this.query.limit > this.orInfo.results.length)) {
            this.results = [];
            var key = this.getObjectFirstKey(this.orInfo.orQuery);
            if (key != null) {
                var where = {};
                where[key] = this.orInfo.orQuery[key];
                delete this.orInfo.orQuery[key];
                this.query.where = where;
                this.goToWhereLogic();
            }
            else {
                this.orQueryFinish_();
            }
        }
        else {
            this.orQueryFinish_();
        }
    };
    Instance.prototype.processOrLogic_ = function () {
        this.isOr = true;
        this.orInfo = {
            orQuery: this.query.where.or,
            results: []
        };
        // free or memory
        delete this.query.where.or;
    };
    return Instance;
}(_join__WEBPACK_IMPORTED_MODULE_1__["Join"]));



/***/ }),

/***/ "./src/worker/business/select/join.ts":
/*!********************************************!*\
  !*** ./src/worker/business/select/join.ts ***!
  \********************************************/
/*! exports provided: Join */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Join", function() { return Join; });
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/select/instance.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _orderby_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./orderby_helper */ "./src/worker/business/select/orderby_helper.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};




var Join = /** @class */ (function (_super) {
    __extends(Join, _super);
    function Join() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.joinQueryStack_ = [];
        _this.currentQueryStackIndex_ = 0;
        _this.tablesFetched = [];
        return _this;
    }
    Join.prototype.executeJoinQuery = function () {
        var _this = this;
        var query = this.query;
        if (this.getType(query.join) === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Object) {
            this.joinQueryStack_ = [query.join];
        }
        else {
            this.joinQueryStack_ = query.join;
        }
        // get the data for first table
        var tableName = query.from;
        new _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]({
            from: tableName,
            where: query.where,
        }, function (results) {
            results.forEach(function (item, index) {
                var _a;
                _this.results[index] = (_a = {},
                    _a[_this.currentQueryStackIndex_] = item,
                    _a);
            });
            _this.tablesFetched.push(tableName);
            _this.startExecutionJoinLogic_();
        }, this.onErrorOccured).execute();
    };
    Join.prototype.onJoinQueryFinished_ = function () {
        var _this = this;
        if (this.error == null) {
            var mapWithAlias_1 = function (query, value) {
                if (query.as) {
                    for (var key in query.as) {
                        value[query.as[key]] = value[key];
                        delete value[key];
                    }
                }
                return value;
            };
            var results_1 = [];
            var tables = Object.keys(this.results[0]);
            var tablesLength_1 = tables.length;
            this.results.forEach(function (result) {
                var data = result["0"]; // first table data
                for (var i = 1; i < tablesLength_1; i++) {
                    var query = _this.joinQueryStack_[i - 1];
                    data = __assign({}, data, mapWithAlias_1(query, result[i]));
                }
                results_1.push(data);
            });
            this.results = results_1;
            this.processOrderBy();
            if (this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Skip] && this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Limit]) {
                this.results.splice(0, this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Skip]);
                this.results.splice(this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Limit] - 1, this.results.length);
            }
            else if (this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Skip]) {
                this.results.splice(0, this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Skip]);
            }
            else if (this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Limit]) {
                this.results.splice(this.query[_enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"].Limit] - 1, this.results.length);
            }
            this.onSuccess(this.results);
        }
        else {
            this.onError(this.error);
        }
    };
    Join.prototype.startExecutionJoinLogic_ = function () {
        var _this = this;
        var query = this.joinQueryStack_[this.currentQueryStackIndex_];
        if (query) {
            var jointblInfo_1 = this.getJoinTableInfo_(query.on);
            if (true) {
                this.checkJoinTableShema(jointblInfo_1, query);
                if (this.error != null) {
                    this.onJoinQueryFinished_();
                    return;
                }
            }
            // table 1 is fetched & table2 needs to be fetched for join
            if (this.tablesFetched.indexOf(jointblInfo_1.table1.table) < 0) {
                jointblInfo_1 = {
                    table1: jointblInfo_1.table2,
                    table2: jointblInfo_1.table1
                };
            }
            new _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]({
                from: jointblInfo_1.table2.table,
                where: query.where
            }, function (results) {
                _this.jointables(query.type, jointblInfo_1, results);
                _this.tablesFetched.push(jointblInfo_1.table2.table);
                ++_this.currentQueryStackIndex_;
                _this.startExecutionJoinLogic_();
            }, this.onErrorOccured).execute();
        }
        else {
            this.onJoinQueryFinished_();
        }
    };
    Join.prototype.jointables = function (joinType, jointblInfo, secondtableData) {
        var _this = this;
        var results = [];
        var column1 = jointblInfo.table1.column;
        var column2 = jointblInfo.table2.column;
        var table1Index = this.tablesFetched.indexOf(jointblInfo.table1.table);
        var table2Index = this.currentQueryStackIndex_ + 1;
        var performInnerJoin = function () {
            var index = 0;
            _this.results.forEach(function (valueFromFirstTable) {
                secondtableData.forEach(function (valueFromSecondTable) {
                    if (valueFromFirstTable[table1Index][column1] === valueFromSecondTable[column2]) {
                        results[index] = valueFromFirstTable;
                        results[index++][table2Index] = valueFromSecondTable;
                    }
                });
            });
        };
        var performleftJoin = function () {
            var index = 0;
            var valueMatchedFromSecondTable;
            _this.results.forEach(function (valueFromFirstTable) {
                valueMatchedFromSecondTable = [];
                secondtableData.forEach(function (valueFromSecondTable) {
                    if (valueFromFirstTable[table1Index][column1] === valueFromSecondTable[column2]) {
                        valueMatchedFromSecondTable.push(valueFromSecondTable);
                    }
                });
                if (valueMatchedFromSecondTable.length === 0) {
                    valueMatchedFromSecondTable = [null];
                }
                valueMatchedFromSecondTable.forEach(function (value) {
                    results[index] = valueFromFirstTable;
                    results[index++][table2Index] = value;
                });
            });
        };
        switch (joinType) {
            case "left":
                performleftJoin();
                break;
            default:
                performInnerJoin();
        }
        this.results = results;
    };
    Join.prototype.getJoinTableInfo_ = function (joinOn) {
        joinOn = this.removeSpace(joinOn);
        var splittedjoinOn = joinOn.split("=");
        var splittedjoinOnbydotFirst = splittedjoinOn[0].split(".");
        var splittedjoinOnbydotSecond = splittedjoinOn[1].split(".");
        var info = {
            table1: {
                table: splittedjoinOnbydotFirst[0],
                column: splittedjoinOnbydotFirst[1]
            },
            table2: {
                table: splittedjoinOnbydotSecond[0],
                column: splittedjoinOnbydotSecond[1]
            }
        };
        return info;
    };
    Join.prototype.checkJoinTableShema = function (jointblInfo, qry) {
        var tableSchemaOf1stTable = this.getTable(jointblInfo.table1.table);
        var tableSchemaOf2ndTable = this.getTable(jointblInfo.table2.table);
        var err;
        if (qry.as == null) {
            qry.as = {};
        }
        tableSchemaOf1stTable.columns.every(function (column) {
            var columnFound = tableSchemaOf2ndTable.columns.find(function (q) { return q.name === column.name && q.name !== jointblInfo.table1.column; });
            if (columnFound != null && qry.as[columnFound.name] == null) {
                err = new _log_helper__WEBPACK_IMPORTED_MODULE_3__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].InvalidJoinQuery, {
                    column: column.name, table1: jointblInfo.table1.table,
                    table2: jointblInfo.table2.table
                });
                return false;
            }
            return true;
        });
        if (err != null) {
            this.onErrorOccured(err, true);
        }
    };
    return Join;
}(_orderby_helper__WEBPACK_IMPORTED_MODULE_2__["Helper"]));



/***/ }),

/***/ "./src/worker/business/select/not_where.ts":
/*!*************************************************!*\
  !*** ./src/worker/business/select/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_select */ "./src/worker/business/select/base_select.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        if (this.query.order && this.query.order.by && this.query.order.idbSorting !== false) {
            if (this.objectStore.indexNames.contains(this.query.order.by)) {
                var orderType = this.query.order.type &&
                    this.query.order.type.toLowerCase() === 'desc' ? 'prev' : 'next';
                this.sorted = true;
                this.cursorOpenRequest = this.objectStore.index(this.query.order.by).
                    openCursor(null, orderType);
            }
            else {
                var error = new _log_helper__WEBPACK_IMPORTED_MODULE_1__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_2__["ERROR_TYPE"].ColumnNotExist, { column: this.query.order.by, isOrder: true });
                this.onErrorOccured(error, true);
                return;
            }
        }
        else {
            this.cursorOpenRequest = this.objectStore.openCursor();
        }
        if (this.skipRecord && this.limitRecord) {
            this.executeSkipAndLimitForNoWhere_();
        }
        else if (this.skipRecord) {
            this.executeSkipForNoWhere_();
        }
        else if (this.limitRecord) {
            this.executeLimitForNotWhere_();
        }
        else {
            this.executeSimpleForNotWhere_();
        }
        this.cursorOpenRequest.onerror = this.onErrorOccured;
    };
    NotWhere.prototype.executeSkipAndLimitForNoWhere_ = function () {
        var _this = this;
        var recordSkipped = false, cursor;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped && _this.results.length !== _this.limitRecord) {
                    _this.results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(_this.skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    NotWhere.prototype.executeSkipForNoWhere_ = function () {
        var _this = this;
        var recordSkipped = false, cursor;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped) {
                    _this.results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(_this.skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    NotWhere.prototype.executeSimpleForNotWhere_ = function () {
        var cursor;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                this.results.push(cursor.value);
                cursor.continue();
            }
            else {
                this.onQueryFinished();
            }
        }.bind(this);
    };
    NotWhere.prototype.executeLimitForNotWhere_ = function () {
        var _this = this;
        var cursor;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor && _this.results.length !== _this.limitRecord) {
                _this.results.push(cursor.value);
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return NotWhere;
}(_base_select__WEBPACK_IMPORTED_MODULE_0__["BaseSelect"]));



/***/ }),

/***/ "./src/worker/business/select/orderby_helper.ts":
/*!******************************************************!*\
  !*** ./src/worker/business/select/orderby_helper.ts ***!
  \******************************************************/
/*! exports provided: Helper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return Helper; });
/* harmony import */ var _group_by_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./group_by_helper */ "./src/worker/business/select/group_by_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Helper = /** @class */ (function (_super) {
    __extends(Helper, _super);
    function Helper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Helper.prototype.processOrderBy = function () {
        var _this = this;
        var order = this.query.order;
        if (order && this.results.length > 0 && !this.sorted && order.by) {
            order.type = order.type ? order.type.toLowerCase() : 'asc';
            var orderColumn_1 = order.by;
            var sortNumberInAsc = function () {
                _this.results.sort(function (a, b) {
                    return a[orderColumn_1] - b[orderColumn_1];
                });
            };
            var sortNumberInDesc = function () {
                _this.results.sort(function (a, b) {
                    return b[orderColumn_1] - a[orderColumn_1];
                });
            };
            var sortDateInAsc = function () {
                _this.results.sort(function (a, b) {
                    return a[orderColumn_1].getTime() - b[orderColumn_1].getTime();
                });
            };
            var sortDateInDesc = function () {
                _this.results.sort(function (a, b) {
                    return b[orderColumn_1].getTime() - a[orderColumn_1].getTime();
                });
            };
            var sortAlphabetInAsc = function () {
                _this.results.sort(function (a, b) {
                    return a[orderColumn_1].localeCompare(b[orderColumn_1]);
                });
            };
            var sortAlphabetInDesc = function () {
                _this.results.sort(function (a, b) {
                    return b[orderColumn_1].localeCompare(a[orderColumn_1]);
                });
            };
            var column = void 0;
            if (this.query.join == null) {
                column = this.getColumnInfo(orderColumn_1, this.query.from);
            }
            else {
                var splittedByDot = this.removeSpace(orderColumn_1).split(".");
                orderColumn_1 = splittedByDot[1];
                column = this.getColumnInfo(orderColumn_1, splittedByDot[0]);
            }
            if (column == null) {
                this.onErrorOccured(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].ColumnNotExist, { column: orderColumn_1, isOrder: true }), true);
            }
            else if (column.dataType === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String) {
                if (order.type === 'asc') {
                    sortAlphabetInAsc();
                }
                else {
                    sortAlphabetInDesc();
                }
            }
            else if (column.dataType === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Number) {
                if (order.type === 'asc') {
                    sortNumberInAsc();
                }
                else {
                    sortNumberInDesc();
                }
            }
            else if (column.dataType === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].DateTime) {
                if (order.type === 'asc') {
                    sortDateInAsc();
                }
                else {
                    sortDateInDesc();
                }
            }
        }
    };
    Helper.prototype.processAggregateQry = function () {
        var datas = this.results;
        var datasLength = datas.length;
        var results = {};
        var columnToAggregate;
        // free results memory
        this.results = undefined;
        var getCount = function () {
            var result = 0;
            for (var i in datas) {
                result += datas[i][columnToAggregate] ? 1 : 0;
            }
            return result;
        };
        var getMax = function () {
            var result = 0;
            for (var i in datas) {
                result = result > datas[i][columnToAggregate] ?
                    result : datas[i][columnToAggregate];
            }
            return result;
        };
        var getMin = function () {
            var result = Infinity, value = Infinity;
            for (var i in datas) {
                value = datas[i][columnToAggregate] ?
                    datas[i][columnToAggregate] : Infinity;
                result = result < value ? result : value;
            }
            return result;
        };
        var getSum = function () {
            var result = 0;
            for (var i in datas) {
                result += datas[i][columnToAggregate];
            }
            return result;
        };
        var getAvg = function () {
            var result = 0;
            for (var i in datas) {
                result += datas[i][columnToAggregate];
            }
            return result / datasLength;
        };
        for (var prop in this.query.aggregate) {
            var aggregateColumn = this.query.aggregate[prop];
            var aggregateValType = this.getType(aggregateColumn);
            var aggregateCalculator = void 0;
            switch (prop) {
                case 'count':
                    aggregateCalculator = getCount;
                    break;
                case 'max':
                    aggregateCalculator = getMax;
                    break;
                case 'min':
                    aggregateCalculator = getMin;
                    break;
                case 'sum':
                    aggregateCalculator = getSum;
                    break;
                case 'avg':
                    aggregateCalculator = getAvg;
                    break;
            }
            switch (aggregateValType) {
                case _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].String:
                    columnToAggregate = aggregateColumn;
                    results[prop + "(" + columnToAggregate + ")"] = aggregateCalculator();
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Array:
                    for (var key in aggregateColumn) {
                        columnToAggregate = aggregateColumn[key];
                        results[prop + "(" + columnToAggregate + ")"] = aggregateCalculator();
                    }
            }
        }
        // add results to the first index of result
        for (var prop in results) {
            datas[0][prop] = results[prop];
        }
        this.results = [datas[0]];
    };
    return Helper;
}(_group_by_helper__WEBPACK_IMPORTED_MODULE_0__["GroupByHelper"]));



/***/ }),

/***/ "./src/worker/business/select/regex.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/select/regex.ts ***!
  \*********************************************/
/*! exports provided: Regex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Regex", function() { return Regex; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./src/worker/business/select/in.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var shouldAddValue;
var skipOrPush;
var skip;
var cursor;
var Regex = /** @class */ (function (_super) {
    __extends(Regex, _super);
    function Regex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Regex.prototype.executeRegexLogic = function (column, exp) {
        var _this = this;
        skip = this.skipRecord;
        this.regexExpression = exp;
        skipOrPush = function (val) {
            if (skip === 0) {
                _this.results.push(val);
            }
            else {
                --skip;
            }
        };
        shouldAddValue = function () {
            return _this.regexTest(cursor.key) &&
                _this.whereCheckerInstance.check(cursor.value);
        };
        this.cursorOpenRequest = this.objectStore.index(column).openCursor();
        this.cursorOpenRequest.onerror = this.onErrorOccured;
        if (this.skipRecord && this.limitRecord) {
            this.executeSkipAndLimitForRegex_();
        }
        else if (this.skipRecord) {
            this.executeSkipForRegex_();
        }
        else if (this.limitRecord) {
            this.executeLimitForRegex_();
        }
        else {
            this.executeSimpleForRegex_();
        }
    };
    Regex.prototype.executeSkipAndLimitForRegex_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (_this.results.length !== _this.limitRecord && cursor) {
                if (shouldAddValue()) {
                    skipOrPush(cursor.value);
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Regex.prototype.executeSkipForRegex_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    skipOrPush((cursor.value));
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Regex.prototype.executeLimitForRegex_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (_this.results.length !== _this.limitRecord && cursor) {
                if (shouldAddValue()) {
                    _this.results.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Regex.prototype.executeSimpleForRegex_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    _this.results.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return Regex;
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./src/worker/business/select/where.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/select/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex */ "./src/worker/business/select/regex.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var shouldAddValue;
var cursor;
var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeWhereLogic = function (column, value, op, dir) {
        var _this = this;
        shouldAddValue = function () {
            return _this.whereCheckerInstance.check(cursor.value);
        };
        value = op ? value[op] : value;
        this.cursorOpenRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op), dir);
        this.cursorOpenRequest.onerror = this.onErrorOccured;
        if (this.isOrderWithLimit === false) {
            if (this.skipRecord && this.limitRecord) {
                this.executeSkipAndLimitForWhere_();
            }
            else if (this.skipRecord) {
                this.executeSkipForWhere_();
            }
            else if (this.limitRecord) {
                this.executeLimitForWhere_();
            }
            else {
                this.executeSimpleForWhere_();
            }
        }
        else {
            if (this.skipRecord) {
                this.executeSkipForWhere_();
            }
            else {
                this.executeSimpleForWhere_();
            }
        }
    };
    Where.prototype.executeSkipAndLimitForWhere_ = function () {
        var _this = this;
        var recordSkipped = false;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped && _this.results.length !== _this.limitRecord) {
                    if (shouldAddValue()) {
                        _this.results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(_this.skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Where.prototype.executeSkipForWhere_ = function () {
        var _this = this;
        var recordSkipped = false;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped) {
                    if (shouldAddValue()) {
                        _this.results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(_this.skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Where.prototype.executeLimitForWhere_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor && _this.results.length !== _this.limitRecord &&
                shouldAddValue()) {
                _this.results.push(cursor.value);
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    Where.prototype.executeSimpleForWhere_ = function () {
        var _this = this;
        this.cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    _this.results.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return Where;
}(_regex__WEBPACK_IMPORTED_MODULE_0__["Regex"]));



/***/ }),

/***/ "./src/worker/business/transaction/index.ts":
/*!**************************************************!*\
  !*** ./src/worker/business/transaction/index.ts ***!
  \**************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/transaction/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./src/worker/business/transaction/instance.ts":
/*!*****************************************************!*\
  !*** ./src/worker/business/transaction/instance.ts ***!
  \*****************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./src/worker/business/base.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./src/worker/business/select/index.ts");
/* harmony import */ var _count_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../count/index */ "./src/worker/business/count/index.ts");
/* harmony import */ var _insert_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../insert/index */ "./src/worker/business/insert/index.ts");
/* harmony import */ var _remove_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../remove/index */ "./src/worker/business/remove/index.ts");
/* harmony import */ var _update_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../update/index */ "./src/worker/business/update/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _query_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../query_helper */ "./src/worker/business/query_helper.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../util */ "./src/worker/util.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();











var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(qry, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.requestQueue = [];
        _this.isQueryExecuting = false;
        _this.isTxStarted_ = false;
        _this.query = qry;
        _this.onError = onError;
        _this.onSuccess = onSuccess;
        _this.results = {};
        return _this;
    }
    Instance.prototype.execute = function () {
        var _this = this;
        var notExistingTable = this.getNotExistingTable_(this.query.tables);
        if (notExistingTable != null) {
            this.onError(new _log_helper__WEBPACK_IMPORTED_MODULE_8__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_6__["ERROR_TYPE"].TableNotExist, { tableName: notExistingTable }).get());
            return;
        }
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_10__["promiseAll"])(this.query.tables.map(function (table) {
            return _util__WEBPACK_IMPORTED_MODULE_9__["Util"].getAutoIncrementValues(_this.getTable(table));
        })).then(function (results) {
            results.forEach(function (result, index) {
                _query_helper__WEBPACK_IMPORTED_MODULE_7__["QueryHelper"].autoIncrementValues[_this.query.tables[index]] = result;
            });
            _this.startExecution_();
        }).catch(this.onError);
    };
    Instance.prototype.startExecution_ = function () {
        var _this = this;
        var select = function (qry) {
            return _this.pushRequest_({
                name: _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Select,
                query: qry
            });
        };
        var insert = function (qry) {
            return _this.pushRequest_({
                name: _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Insert,
                query: qry
            });
        };
        var update = function (qry) {
            return _this.pushRequest_({
                name: _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Update,
                query: qry
            });
        };
        var remove = function (qry) {
            return _this.pushRequest_({
                name: _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Remove,
                query: qry
            });
        };
        var count = function (qry) {
            return _this.pushRequest_({
                name: _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Count,
                query: qry
            });
        };
        var setResult = function (key, value) {
            _this.results[key] = value;
        };
        var getResult = function (key) {
            return _this.results[key];
        };
        var abort = function (msg) {
            _this.abortTransaction_(msg);
        };
        var start = function () {
            _this.checkQueries_(_this.requestQueue).then(function (results) {
                _this.startTransaction_();
            }).catch(function (err) {
                _this.onError(err);
            });
        };
        var txLogic = null;
        eval("txLogic =" + this.query.logic);
        txLogic.call(this, this.query.data);
        if (true) {
            console.log("transaction query started");
        }
    };
    Instance.prototype.startTransaction_ = function () {
        try {
            this.isTxStarted_ = true;
            this.initTransaction_(this.query.tables);
            this.processExecutionOfQry_();
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.query.tables });
        }
    };
    Instance.prototype.initTransaction_ = function (tableNames) {
        this.createTransaction(tableNames, this.onTransactionCompleted_.bind(this));
    };
    Instance.prototype.onTransactionCompleted_ = function () {
        if (true) {
            console.log("transaction finished");
        }
        this.onSuccess(this.results);
    };
    Instance.prototype.onRequestFinished_ = function (result) {
        var finisehdRequest = this.requestQueue.shift();
        if (true) {
            console.log("finished request : " + finisehdRequest.name + " ");
        }
        if (finisehdRequest) {
            if (this.error) {
                this.abortTransaction_("automatic abort of transaction due to error occured");
                if (true) {
                    console.log("transaction aborted due to error occured");
                }
                this.onErrorOccured(this.error);
            }
            else {
                this.isQueryExecuting = false;
                if (finisehdRequest.onSuccess) {
                    finisehdRequest.onSuccess(result);
                }
                this.processExecutionOfQry_();
            }
        }
    };
    Instance.prototype.abortTransaction_ = function (msg) {
        if (this.transaction != null) {
            this.transaction.abort();
            if (true) {
                console.log("transaction aborted. Msg : " + msg);
            }
        }
    };
    Instance.prototype.executeRequest_ = function (request) {
        this.isQueryExecuting = true;
        var requestObj;
        if (true) {
            console.log("executing request : " + request.name + " ");
        }
        switch (request.name) {
            case _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Select:
                requestObj = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"](request.query, this.onRequestFinished_.bind(this), this.onError.bind(this));
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Insert:
                requestObj = new _insert_index__WEBPACK_IMPORTED_MODULE_3__["Instance"](request.query, this.onRequestFinished_.bind(this), this.onError.bind(this));
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Update:
                requestObj = new _update_index__WEBPACK_IMPORTED_MODULE_5__["Instance"](request.query, this.onRequestFinished_.bind(this), this.onError.bind(this));
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Remove:
                requestObj = new _remove_index__WEBPACK_IMPORTED_MODULE_4__["Instance"](request.query, this.onRequestFinished_.bind(this), this.onError.bind(this));
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_6__["API"].Count:
                requestObj = new _count_index__WEBPACK_IMPORTED_MODULE_2__["Instance"](request.query, this.onRequestFinished_.bind(this), this.onError.bind(this));
                break;
        }
        requestObj.isTransaction = true;
        requestObj.execute();
    };
    Instance.prototype.pushRequest_ = function (request) {
        var _this = this;
        var push = function () {
            _this.requestQueue.push(request);
        };
        var promiseObj = Object(_helpers_index__WEBPACK_IMPORTED_MODULE_10__["promise"])(function (resolve, reject) {
            request.onSuccess = function (result) {
                resolve(result);
            };
            request.onError = function (error) {
                _this.error = error;
                reject(error);
            };
        });
        if (this.isTxStarted_ === true) {
            this.checkQueries_([request]).then(function () {
                push();
                _this.processExecutionOfQry_();
            }).catch(function (err) {
                _this.error = err;
                _this.abortTransaction_(JSON.stringify(err));
            });
        }
        else {
            push();
        }
        if (true) {
            console.log("request pushed : " + request.name + " with query value - " + JSON.stringify(request.query));
        }
        return promiseObj;
    };
    Instance.prototype.processExecutionOfQry_ = function () {
        if (this.requestQueue.length > 0 && this.isQueryExecuting === false) {
            this.executeRequest_(this.requestQueue[0]);
        }
    };
    Instance.prototype.checkQueries_ = function (requestQueue) {
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_10__["promiseAll"])(requestQueue.map(function (request) {
            var tableName = request.query.into || request.query.in;
            return new _query_helper__WEBPACK_IMPORTED_MODULE_7__["QueryHelper"](request.name, request.query).checkAndModify();
        }));
    };
    Instance.prototype.getNotExistingTable_ = function (tables) {
        var _this = this;
        var invalidTable = null;
        tables.every(function (table) {
            if (_this.isTableExist(table) === false) {
                invalidTable = table;
                return false;
            }
            return true;
        });
        return invalidTable;
    };
    return Instance;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/update/base_update.ts":
/*!***************************************************!*\
  !*** ./src/worker/business/update/base_update.ts ***!
  \***************************************************/
/*! exports provided: updateValue, BaseUpdate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateValue", function() { return updateValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseUpdate", function() { return BaseUpdate; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./src/worker/business/base.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./src/worker/util.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var updateValue = function (suppliedValue, storedValue) {
    for (var key in suppliedValue) {
        if (_util__WEBPACK_IMPORTED_MODULE_2__["Util"].getType(suppliedValue[key]) !== _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Object) {
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
var BaseUpdate = /** @class */ (function (_super) {
    __extends(BaseUpdate, _super);
    function BaseUpdate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onTransactionCompleted_ = function () {
            if (_this.error) {
                _this.onError(_this.error);
            }
            else {
                _this.onSuccess(_this.rowAffected);
            }
        };
        return _this;
    }
    BaseUpdate.prototype.initTransaction = function () {
        this.createTransaction([this.query.in], this.onTransactionCompleted_);
        this.objectStore = this.transaction.objectStore(this.query.in);
    };
    BaseUpdate.prototype.onQueryFinished = function () {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    };
    return BaseUpdate;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/update/in.ts":
/*!******************************************!*\
  !*** ./src/worker/business/update/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./src/worker/business/update/not_where.ts");
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base_update */ "./src/worker/business/update/base_update.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/index */ "./src/worker/helpers/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var _this = this;
        var cursor;
        var columnStore = this.objectStore.index(column);
        var cursorRequest;
        var runInLogic = function (value) {
            return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_2__["promise"])(function (res, rej) {
                cursorRequest = columnStore.openCursor(_this.getKeyRange(value));
                cursorRequest.onsuccess = function (e) {
                    cursor = e.target.result;
                    if (cursor) {
                        if (_this.whereCheckerInstance.check(cursor.value)) {
                            cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(_this.query.set, cursor.value));
                            ++_this.rowAffected;
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };
        Object(_helpers_index__WEBPACK_IMPORTED_MODULE_2__["promiseAll"])(values.map(function (val) {
            return runInLogic(val);
        })).then(function () {
            _this.onQueryFinished();
        }).catch(function (err) {
            _this.onErrorOccured(err);
        });
    };
    return In;
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./src/worker/business/update/index.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/update/index.ts ***!
  \*********************************************/
/*! exports provided: Instance, SchemaChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/business/update/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });

/* harmony import */ var _schema_checker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schema_checker */ "./src/worker/business/update/schema_checker.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SchemaChecker", function() { return _schema_checker__WEBPACK_IMPORTED_MODULE_1__["SchemaChecker"]; });





/***/ }),

/***/ "./src/worker/business/update/instance.ts":
/*!************************************************!*\
  !*** ./src/worker/business/update/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./src/worker/business/update/where.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./src/worker/business/select/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        _this.query = query;
        _this.tableName = _this.query.in;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            this.initTransaction();
            if (this.query.where != null) {
                if (this.query.where.or || this.isArray(this.query.where)) {
                    this.executeComplexLogic_();
                }
                else {
                    this.goToWhereLogic();
                }
            }
            else {
                this.executeWhereUndefinedLogic();
            }
        }
        catch (ex) {
            this.onExceptionOccured.call(this, ex, { tableName: this.query.in });
        }
    };
    Instance.prototype.executeComplexLogic_ = function () {
        var _this = this;
        var selectObject = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
            from: this.query.in,
            where: this.query.where,
            ignoreCase: this.query.ignoreCase
        }, function (results) {
            var _a, _b;
            var key = _this.getPrimaryKey(_this.query.in);
            var inQuery = [];
            results.forEach(function (value) {
                inQuery.push(value[key]);
            });
            results = null;
            var whereQry = (_a = {}, _a[key] = (_b = {}, _b[_enums__WEBPACK_IMPORTED_MODULE_2__["QUERY_OPTION"].In] = inQuery, _b), _a);
            _this.query.ignoreCase = null;
            _this.query[_enums__WEBPACK_IMPORTED_MODULE_2__["QUERY_OPTION"].Where] = whereQry;
            _this.initTransaction();
            _this.goToWhereLogic();
        }, this.onError);
        selectObject.isSubQuery = true;
        selectObject.execute();
    };
    return Instance;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./src/worker/business/update/not_where.ts":
/*!*************************************************!*\
  !*** ./src/worker/business/update/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_update */ "./src/worker/business/update/base_update.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        var cursor;
        var cursorRequest = this.objectStore.openCursor();
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_0__["updateValue"])(_this.query.set, cursor.value));
                ++_this.rowAffected;
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursorRequest.onerror = this.onErrorOccured;
    };
    return NotWhere;
}(_base_update__WEBPACK_IMPORTED_MODULE_0__["BaseUpdate"]));



/***/ }),

/***/ "./src/worker/business/update/regex.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/update/regex.ts ***!
  \*********************************************/
/*! exports provided: Regex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Regex", function() { return Regex; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./src/worker/business/update/in.ts");
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base_update */ "./src/worker/business/update/base_update.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Regex = /** @class */ (function (_super) {
    __extends(Regex, _super);
    function Regex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Regex.prototype.executeRegexLogic = function (column, exp) {
        var _this = this;
        var cursor;
        this.regexExpression = exp;
        var cursorOpenRequest = this.objectStore.index(column).openCursor();
        cursorOpenRequest.onerror = this.onErrorOccured;
        cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (_this.regexTest(cursor.key) &&
                    _this.whereCheckerInstance.check(cursor.value)) {
                    cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(_this.query.set, cursor.value));
                    ++_this.rowAffected;
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    return Regex;
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./src/worker/business/update/schema_checker.ts":
/*!******************************************************!*\
  !*** ./src/worker/business/update/schema_checker.ts ***!
  \******************************************************/
/*! exports provided: SchemaChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SchemaChecker", function() { return SchemaChecker; });
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./src/worker/util.ts");



var SchemaChecker = /** @class */ (function () {
    function SchemaChecker(table) {
        this.table = table;
    }
    SchemaChecker.prototype.check = function (setValue, tblName) {
        var _this = this;
        var log = null;
        if (typeof setValue === _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"].Object) {
            if (this.table) {
                // loop through table column and find data is valid
                this.table.columns.every(function (column) {
                    if (log === null) {
                        if (column.name in setValue) {
                            log = _this.checkByColumn_(column, setValue[column.name]);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                log = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].TableNotExist, { tableName: tblName });
            }
        }
        else {
            log = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].NotObject);
        }
        if (log != null) {
            return log.get();
        }
        return null;
    };
    SchemaChecker.prototype.isNull_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].isNull(value);
    };
    SchemaChecker.prototype.getType_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getType(value);
    };
    SchemaChecker.prototype.checkByColumn_ = function (column, value) {
        var log = null;
        // check not null schema
        if (column.notNull === true && this.isNull_(value)) {
            log = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].NullValue, { ColumnName: column.name });
        }
        // check datatype
        var type = this.getType_(value);
        var checkFurther = value != null;
        if (column.dataType && checkFurther) {
            if (type !== column.dataType && type !== 'object') {
                log = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].WrongDataType, { ColumnName: column.name });
            }
        }
        // check allowed operators
        if (checkFurther && type === 'object') {
            var allowedOp = ['+', '-', '*', '/'];
            for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
                var prop = _a[_i];
                if (allowedOp.indexOf(prop) < 0 && column.dataType && type !== column.dataType) {
                    log = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"].WrongDataType, { ColumnName: column.name });
                }
                break;
            }
        }
        return log;
    };
    return SchemaChecker;
}());



/***/ }),

/***/ "./src/worker/business/update/where.ts":
/*!*********************************************!*\
  !*** ./src/worker/business/update/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_update */ "./src/worker/business/update/base_update.ts");
/* harmony import */ var _regex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./regex */ "./src/worker/business/update/regex.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeWhereLogic = function (column, value, op) {
        var _this = this;
        var cursor, cursorRequest;
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
        cursorRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (_this.whereCheckerInstance.check(cursor.value)) {
                    cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_0__["updateValue"])(_this.query.set, cursor.value));
                    ++_this.rowAffected;
                }
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursorRequest.onerror = this.onErrorOccured;
    };
    return Where;
}(_regex__WEBPACK_IMPORTED_MODULE_1__["Regex"]));



/***/ }),

/***/ "./src/worker/business/where_base.ts":
/*!*******************************************!*\
  !*** ./src/worker/business/where_base.ts ***!
  \*******************************************/
/*! exports provided: WhereBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhereBase", function() { return WhereBase; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/worker/business/base.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var WhereBase = /** @class */ (function (_super) {
    __extends(WhereBase, _super);
    function WhereBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.results = [];
        return _this;
    }
    WhereBase.prototype.onQueryFinished = function () {
        // virtual
    };
    return WhereBase;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/business/where_checker.ts":
/*!**********************************************!*\
  !*** ./src/worker/business/where_checker.ts ***!
  \**********************************************/
/*! exports provided: WhereChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhereChecker", function() { return WhereChecker; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/enums.ts");

/**
 * For matching the different column value existance for where option
 *
 * @export
 * @class WhereChecker
 */
var WhereChecker = /** @class */ (function () {
    function WhereChecker(where, checkFlag) {
        this.where = where;
        this.checkFlag = checkFlag;
    }
    WhereChecker.prototype.check = function (rowValue) {
        this.status = true;
        if (this.checkFlag === true) {
            for (var columnName in this.where) {
                if (!this.status) {
                    break;
                }
                var columnValue = this.where[columnName];
                if (typeof columnValue === 'object') {
                    for (var key in columnValue) {
                        if (!this.status) {
                            break;
                        }
                        switch (key) {
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].In:
                                this.checkIn(columnName, rowValue[columnName]);
                                break;
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Like:
                                this.checkLike(columnName, rowValue[columnName]);
                                break;
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Regex:
                                this.checkRegex(columnName, rowValue[columnName]);
                                break;
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Between:
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].GreaterThan:
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].LessThan:
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].GreaterThanEqualTo:
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].LessThanEqualTo:
                            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo:
                                this.checkComparisionOp(columnName, rowValue[columnName], key);
                                break;
                        }
                    }
                }
                else {
                    this.status = columnValue === rowValue[columnName];
                }
            }
        }
        return this.status;
    };
    WhereChecker.prototype.checkIn = function (column, value) {
        for (var i = 0, values = this.where[column][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].In], length_1 = values.length; i < length_1; i++) {
            if (values[i] === value) {
                this.status = true;
                break;
            }
            else {
                this.status = false;
            }
        }
    };
    WhereChecker.prototype.checkLike = function (column, value) {
        var values = this.where[column][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Like].split('%');
        var compSymbol, compValue, symbolIndex;
        if (values[1]) {
            compValue = values[1];
            compSymbol = values.length > 2 ? _enums__WEBPACK_IMPORTED_MODULE_0__["OCCURENCE"].Any : _enums__WEBPACK_IMPORTED_MODULE_0__["OCCURENCE"].Last;
        }
        else {
            compValue = values[0];
            compSymbol = _enums__WEBPACK_IMPORTED_MODULE_0__["OCCURENCE"].First;
        }
        value = value.toLowerCase();
        switch (compSymbol) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["OCCURENCE"].Any:
                symbolIndex = value.indexOf(compValue.toLowerCase());
                if (symbolIndex < 0) {
                    this.status = false;
                }
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["OCCURENCE"].First:
                symbolIndex = value.indexOf(compValue.toLowerCase());
                if (symbolIndex > 0 || symbolIndex < 0) {
                    this.status = false;
                }
                break;
            default:
                symbolIndex = value.lastIndexOf(compValue.toLowerCase());
                if (symbolIndex < value.length - compValue.length) {
                    this.status = false;
                }
        }
    };
    WhereChecker.prototype.checkRegex = function (column, value) {
        var expr = this.where[column][_enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Regex];
        this.status = expr.test(value);
    };
    WhereChecker.prototype.checkComparisionOp = function (column, value, symbol) {
        var compareValue = this.where[column][symbol];
        switch (symbol) {
            // greater than
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].GreaterThan:
                if (value <= compareValue) {
                    this.status = false;
                }
                break;
            // less than
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].LessThan:
                if (value >= compareValue) {
                    this.status = false;
                }
                break;
            // less than equal
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].LessThanEqualTo:
                if (value > compareValue) {
                    this.status = false;
                }
                break;
            // greather than equal
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].GreaterThanEqualTo:
                if (value < compareValue) {
                    this.status = false;
                }
                break;
            // between
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].Between:
                if (value < compareValue.Low || value > compareValue.High) {
                    this.status = false;
                }
                break;
            // Not equal to
            case _enums__WEBPACK_IMPORTED_MODULE_0__["QUERY_OPTION"].NotEqualTo:
                if (value === compareValue) {
                    this.status = false;
                }
                break;
        }
    };
    return WhereChecker;
}());



/***/ }),

/***/ "./src/worker/config.ts":
/*!******************************!*\
  !*** ./src/worker/config.ts ***!
  \******************************/
/*! exports provided: Config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return Config; });
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.isLogEnabled = false;
    Config.isRuningInWorker = false;
    return Config;
}());



/***/ }),

/***/ "./src/worker/enums.ts":
/*!*****************************!*\
  !*** ./src/worker/enums.ts ***!
  \*****************************/
/*! exports provided: OCCURENCE, WEBWORKER_STATUS, CONNECTION_STATUS, DATA_TYPE, ERROR_TYPE, QUERY_OPTION, IDB_MODE, API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OCCURENCE", function() { return OCCURENCE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEBWORKER_STATUS", function() { return WEBWORKER_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_STATUS", function() { return CONNECTION_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATA_TYPE", function() { return DATA_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR_TYPE", function() { return ERROR_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QUERY_OPTION", function() { return QUERY_OPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IDB_MODE", function() { return IDB_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });
var OCCURENCE;
(function (OCCURENCE) {
    OCCURENCE["First"] = "f";
    OCCURENCE["Last"] = "l";
    OCCURENCE["Any"] = "a";
})(OCCURENCE || (OCCURENCE = {}));
var WEBWORKER_STATUS;
(function (WEBWORKER_STATUS) {
    WEBWORKER_STATUS["Registered"] = "registerd";
    WEBWORKER_STATUS["Failed"] = "failed";
    WEBWORKER_STATUS["NotStarted"] = "not_started";
})(WEBWORKER_STATUS || (WEBWORKER_STATUS = {}));
var CONNECTION_STATUS;
(function (CONNECTION_STATUS) {
    CONNECTION_STATUS["Connected"] = "connected";
    CONNECTION_STATUS["Closed"] = "closed";
    CONNECTION_STATUS["NotStarted"] = "not_started";
    CONNECTION_STATUS["UnableToStart"] = "unable_to_start";
    CONNECTION_STATUS["ClosedByJsStore"] = "closed_by_jsstore";
})(CONNECTION_STATUS || (CONNECTION_STATUS = {}));
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
var ERROR_TYPE;
(function (ERROR_TYPE) {
    ERROR_TYPE["UndefinedColumn"] = "undefined_column";
    ERROR_TYPE["UndefinedValue"] = "undefined_value";
    ERROR_TYPE["UndefinedColumnName"] = "undefined_column_name";
    ERROR_TYPE["UndefinedDbName"] = "undefined_database_name";
    ERROR_TYPE["UndefinedColumnValue"] = "undefined_column_value";
    ERROR_TYPE["NotArray"] = "not_array";
    ERROR_TYPE["NoValueSupplied"] = "no_value_supplied";
    ERROR_TYPE["ColumnNotExist"] = "column_not_exist";
    ERROR_TYPE["EnableSearchOff"] = "enable_search_off";
    ERROR_TYPE["InvalidOp"] = "invalid_operator";
    ERROR_TYPE["NullValue"] = "null_value";
    ERROR_TYPE["WrongDataType"] = "wrong_data_type";
    ERROR_TYPE["NextJoinNotExist"] = "next_join_not_exist";
    ERROR_TYPE["TableNotExist"] = "table_not_exist";
    ERROR_TYPE["DbNotExist"] = "db_not_exist";
    ERROR_TYPE["ConnectionAborted"] = "connection_aborted";
    ERROR_TYPE["ConnectionClosed"] = "connection_closed";
    ERROR_TYPE["NotObject"] = "not_object";
    ERROR_TYPE["InvalidConfig"] = "invalid_config";
    ERROR_TYPE["DbBlocked"] = "Db_blocked";
    ERROR_TYPE["IndexedDbUndefined"] = "indexeddb_undefined";
    ERROR_TYPE["IndexedDbBlocked"] = "indexeddb_blocked";
    ERROR_TYPE["NullValueInWhere"] = "null_value_in_where";
    ERROR_TYPE["InvalidJoinQuery"] = "invalid_join_query";
})(ERROR_TYPE || (ERROR_TYPE = {}));
var QUERY_OPTION;
(function (QUERY_OPTION) {
    QUERY_OPTION["Where"] = "where";
    QUERY_OPTION["Like"] = "like";
    QUERY_OPTION["Regex"] = "regex";
    QUERY_OPTION["In"] = "in";
    QUERY_OPTION["Between"] = "-";
    QUERY_OPTION["GreaterThan"] = ">";
    QUERY_OPTION["LessThan"] = "<";
    QUERY_OPTION["GreaterThanEqualTo"] = ">=";
    QUERY_OPTION["LessThanEqualTo"] = "<=";
    QUERY_OPTION["NotEqualTo"] = "!=";
    QUERY_OPTION["Aggregate"] = "aggregate";
    QUERY_OPTION["Max"] = "max";
    QUERY_OPTION["Min"] = "min";
    QUERY_OPTION["Avg"] = "avg";
    QUERY_OPTION["Count"] = "count";
    QUERY_OPTION["Sum"] = "sum";
    QUERY_OPTION["Or"] = "or";
    QUERY_OPTION["Skip"] = "skip";
    QUERY_OPTION["Limit"] = "limit";
    QUERY_OPTION["And"] = "and";
    QUERY_OPTION["IgnoreCase"] = "ignoreCase";
})(QUERY_OPTION || (QUERY_OPTION = {}));
var IDB_MODE;
(function (IDB_MODE) {
    IDB_MODE["ReadOnly"] = "readonly";
    IDB_MODE["ReadWrite"] = "readwrite";
})(IDB_MODE || (IDB_MODE = {}));
var API;
(function (API) {
    API["InitDb"] = "init_db";
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
    API["ChangeLogStatus"] = "change_log_status";
    API["Transaction"] = "transaction";
    API["FinishTransaction"] = "finish_transaction";
    API["Terminate"] = "terminate";
    API["InitKeyStore"] = "init_keystore";
    API["CloseDb"] = "close_db";
})(API || (API = {}));


/***/ }),

/***/ "./src/worker/export.ts":
/*!******************************!*\
  !*** ./src/worker/export.ts ***!
  \******************************/
/*! exports provided: OCCURENCE, WEBWORKER_STATUS, CONNECTION_STATUS, DATA_TYPE, ERROR_TYPE, QUERY_OPTION, IDB_MODE, API, IdbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business/idb_helper */ "./src/worker/business/idb_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]; });

/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums */ "./src/worker/enums.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OCCURENCE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["OCCURENCE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WEBWORKER_STATUS", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["WEBWORKER_STATUS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_STATUS", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DATA_TYPE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["DATA_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ERROR_TYPE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["ERROR_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QUERY_OPTION", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["QUERY_OPTION"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IDB_MODE", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["IDB_MODE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "API", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["API"]; });





/***/ }),

/***/ "./src/worker/helpers/index.ts":
/*!*************************************!*\
  !*** ./src/worker/helpers/index.ts ***!
  \*************************************/
/*! exports provided: promise, promiseAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./promise */ "./src/worker/helpers/promise.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "promise", function() { return _promise__WEBPACK_IMPORTED_MODULE_0__["promise"]; });

/* harmony import */ var _promise_all__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./promise_all */ "./src/worker/helpers/promise_all.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "promiseAll", function() { return _promise_all__WEBPACK_IMPORTED_MODULE_1__["promiseAll"]; });





/***/ }),

/***/ "./src/worker/helpers/promise.ts":
/*!***************************************!*\
  !*** ./src/worker/helpers/promise.ts ***!
  \***************************************/
/*! exports provided: promise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "promise", function() { return promise; });
var promise = function (callBack) {
    return new Promise(callBack);
};


/***/ }),

/***/ "./src/worker/helpers/promise_all.ts":
/*!*******************************************!*\
  !*** ./src/worker/helpers/promise_all.ts ***!
  \*******************************************/
/*! exports provided: promiseAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "promiseAll", function() { return promiseAll; });
var promiseAll = function (promises) {
    return Promise.all(promises);
};


/***/ }),

/***/ "./src/worker/index.ts":
/*!*****************************!*\
  !*** ./src/worker/index.ts ***!
  \*****************************/
/*! exports provided: QueryExecutor, initialize, Config, KeyStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./query_executor */ "./src/worker/query_executor.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QueryExecutor", function() { return _query_executor__WEBPACK_IMPORTED_MODULE_0__["QueryExecutor"]; });

/* harmony import */ var _start__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./start */ "./src/worker/start.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initialize", function() { return _start__WEBPACK_IMPORTED_MODULE_1__["initialize"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./src/worker/config.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return _config__WEBPACK_IMPORTED_MODULE_2__["Config"]; });

/* harmony import */ var _keystore_instance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keystore/instance */ "./src/worker/keystore/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KeyStore", function() { return _keystore_instance__WEBPACK_IMPORTED_MODULE_3__["KeyStore"]; });







/***/ }),

/***/ "./src/worker/keystore/business/base_logic.ts":
/*!****************************************************!*\
  !*** ./src/worker/keystore/business/base_logic.ts ***!
  \****************************************************/
/*! exports provided: Base */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
var Base = /** @class */ (function () {
    function Base() {
        this.results = null;
        this.errorOccured = false;
        this.errorCount = 0;
    }
    Base.prototype.onErrorOccured = function (e) {
        ++this.errorCount;
        if (this.errorCount === 1) {
            if (this.onError != null) {
                this.onError(e.target.error);
            }
        }
        console.error(e);
    };
    return Base;
}());



/***/ }),

/***/ "./src/worker/keystore/business/get_logic.ts":
/*!***************************************************!*\
  !*** ./src/worker/keystore/business/get_logic.ts ***!
  \***************************************************/
/*! exports provided: Get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Get", function() { return Get; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./src/worker/keystore/business/base_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../query_executor */ "./src/worker/keystore/query_executor.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/keystore/business/idb_helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onTransactionCompleted_ = function () {
            if (_this.errorOccured === false) {
                _this.onSuccess(_this.results);
            }
        };
        _this.key = key;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    Get.prototype.execute = function () {
        var _this = this;
        var getData = function (column, value) {
            var cursorRequest = _this.objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursorRequest.onerror = function (e) {
                _this.errorOccured = true;
                _this.onErrorOccured(e);
            };
            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    _this.results = cursor.value['Value'];
                }
            };
        };
        this.initTransaction_();
        getData(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].columnName, this.key);
    };
    Get.prototype.initTransaction_ = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].tableName], this.onTransactionCompleted_, 'readonly');
        this.objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].tableName);
    };
    return Get;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/keystore/business/idb_helper.ts":
/*!****************************************************!*\
  !*** ./src/worker/keystore/business/idb_helper.ts ***!
  \****************************************************/
/*! exports provided: IdbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return IdbHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/keystore/enums.ts");

var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.callDbDroppedByBrowser = function () {
        IdbHelper.isDbDeletedByBrowser = IdbHelper.dbStatus.conStatus === _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Connected ? true : false;
    };
    IdbHelper.createTransaction = function (tableNames, callBack, mode) {
        if (IdbHelper.transaction === null) {
            mode = mode ? mode : "readwrite";
            IdbHelper.transaction = IdbHelper.dbConnection.transaction(tableNames, mode);
            IdbHelper.transaction.oncomplete = function () {
                IdbHelper.transaction = null;
                callBack();
            };
            IdbHelper.transaction.ontimeout = function () {
                this._transaction = null;
                console.error('transaction timed out');
            };
        }
    };
    IdbHelper.transaction = null;
    IdbHelper.dbStatus = {
        conStatus: _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].NotStarted,
    };
    return IdbHelper;
}());



/***/ }),

/***/ "./src/worker/keystore/business/init_db_logic.ts":
/*!*******************************************************!*\
  !*** ./src/worker/keystore/business/init_db_logic.ts ***!
  \*******************************************************/
/*! exports provided: tempDatas, InitDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tempDatas", function() { return tempDatas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitDb", function() { return InitDb; });
/* harmony import */ var _export__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../export */ "./src/worker/export.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./src/worker/keystore/enums.ts");
/* harmony import */ var _utils_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils_logic */ "./src/worker/keystore/utils_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/keystore/business/idb_helper.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../query_executor */ "./src/worker/keystore/query_executor.ts");





var tempDatas;
var InitDb = /** @class */ (function () {
    function InitDb(dbName, onSuccess, onError) {
        var dbRequest = self.indexedDB.open(dbName, 1);
        _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].isDbDeletedByBrowser = false;
        dbRequest.onerror = function (event) {
            if (event.target.error.name === 'InvalidStateError') {
                _export__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus = {
                    conStatus: _export__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].UnableToStart,
                    lastError: _export__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].IndexedDbBlocked,
                };
            }
            if (onError != null) {
                onError(event.target.error);
            }
        };
        dbRequest.onsuccess = function (event) {
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbStatus.conStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Connected;
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbConnection = dbRequest.result;
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbConnection.onclose = function () {
                _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].callDbDroppedByBrowser();
                _utils_logic__WEBPACK_IMPORTED_MODULE_2__["Utils"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed, _export__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].ConnectionClosed);
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbConnection.onversionchange = function (e) {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].callDbDroppedByBrowser();
                    _utils_logic__WEBPACK_IMPORTED_MODULE_2__["Utils"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed, _export__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].ConnectionClosed);
                }
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbConnection.onerror = function (e) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbStatus.lastError = "Error occured in connection :" + e.target.result;
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbConnection.onabort = function (e) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].dbStatus = {
                    conStatus: _enums__WEBPACK_IMPORTED_MODULE_1__["CONNECTION_STATUS"].Closed,
                    lastError: "Connection aborted"
                };
            };
            if (onSuccess != null) {
                onSuccess();
            }
        };
        dbRequest.onupgradeneeded = function (event) {
            var db = event.target.result, column = "Key";
            db.createObjectStore(_query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"].tableName, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
    return InitDb;
}());



/***/ }),

/***/ "./src/worker/keystore/business/main_logic.ts":
/*!****************************************************!*\
  !*** ./src/worker/keystore/business/main_logic.ts ***!
  \****************************************************/
/*! exports provided: Main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Main", function() { return Main; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/worker/keystore/enums.ts");
/* harmony import */ var _remove_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./remove_logic */ "./src/worker/keystore/business/remove_logic.ts");
/* harmony import */ var _set_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./set_logic */ "./src/worker/keystore/business/set_logic.ts");
/* harmony import */ var _init_db_logic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./init_db_logic */ "./src/worker/keystore/business/init_db_logic.ts");
/* harmony import */ var _get_logic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./get_logic */ "./src/worker/keystore/business/get_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/keystore/business/idb_helper.ts");






var Main = /** @class */ (function () {
    function Main(onQueryFinished) {
        if (onQueryFinished === void 0) { onQueryFinished = null; }
        this.onQueryFinished = onQueryFinished;
    }
    Main.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        if (request.name === 'init_db') {
            this.executeLogic(request);
        }
        else {
            switch (_idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].dbStatus.conStatus) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Connected:
                    this.executeLogic(request);
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].NotStarted:
                    setTimeout(function () {
                        _this.checkConnectionAndExecuteLogic(request);
                    }, 100);
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Closed:
                    if (_idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].isDbDeletedByBrowser) {
                        this.createDb(function () {
                            _idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].isDbDeletedByBrowser = false;
                            _this.checkConnectionAndExecuteLogic(request);
                        }, function (err) {
                            console.error(err);
                        });
                    }
            }
        }
    };
    Main.prototype.returnResult = function (result) {
        this.onQueryFinished(result);
    };
    Main.prototype.executeLogic = function (request) {
        var _this = this;
        var onSuccess = function (results) {
            _this.returnResult({
                returnedValue: results
            });
        };
        var onError = function (err) {
            _this.returnResult({
                errorDetails: err,
                errorOccured: true
            });
        };
        switch (request.name) {
            case 'get':
                this.get(request.query, onSuccess, onError);
                break;
            case 'set':
                this.set(request.query, onSuccess, onError);
                break;
            case 'remove':
                this.remove(request.query, onSuccess, onError);
                break;
            case 'init_db':
                this.createDb(onSuccess, onError);
                break;
            case 'close_db':
                this.closeDb(onSuccess, onError);
                break;
        }
    };
    Main.prototype.set = function (query, onSuccess, onError) {
        var insertInstance = new _set_logic__WEBPACK_IMPORTED_MODULE_2__["Set"](query, onSuccess, onError);
        insertInstance.execute();
    };
    Main.prototype.remove = function (key, onSuccess, onError) {
        var deleteInstance = new _remove_logic__WEBPACK_IMPORTED_MODULE_1__["Remove"](key, onSuccess, onError);
        deleteInstance.execute();
    };
    Main.prototype.get = function (key, onSuccess, onError) {
        var getInstance = new _get_logic__WEBPACK_IMPORTED_MODULE_4__["Get"](key, onSuccess, onError);
        getInstance.execute();
    };
    Main.prototype.createDb = function (onSuccess, onError) {
        var dbName = "KeyStore";
        var initDbInstance = new _init_db_logic__WEBPACK_IMPORTED_MODULE_3__["InitDb"](dbName, onSuccess, onError);
    };
    Main.prototype.closeDb = function (onSuccess, onError) {
        if (_idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].dbStatus.conStatus === _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Connected) {
            _idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].dbStatus.conStatus = _enums__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].Closed;
            _idb_helper__WEBPACK_IMPORTED_MODULE_5__["IdbHelper"].dbConnection.close();
        }
        onSuccess();
    };
    return Main;
}());



/***/ }),

/***/ "./src/worker/keystore/business/remove_logic.ts":
/*!******************************************************!*\
  !*** ./src/worker/keystore/business/remove_logic.ts ***!
  \******************************************************/
/*! exports provided: Remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Remove", function() { return Remove; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./src/worker/keystore/business/base_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../query_executor */ "./src/worker/keystore/query_executor.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/keystore/business/idb_helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Remove = /** @class */ (function (_super) {
    __extends(Remove, _super);
    function Remove(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.rowAffected = 0;
        _this.key = key;
        _this.onSuccess = onSuccess;
        _this.onError = onError;
        return _this;
    }
    Remove.prototype.execute = function () {
        var _this = this;
        this.initTransaction();
        var removeData = function (column, value) {
            var cursorRequest = _this.objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursorRequest.onerror = function (e) {
                _this.errorOccured = true;
                _this.onErrorOccured(e);
            };
            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++_this.rowAffected;
                    cursor.continue();
                }
            };
        };
        if (!this.errorOccured) {
            removeData(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].columnName, this.key);
        }
    };
    Remove.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].tableName], this.onTransactionCompleted.bind(this));
        this.objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].tableName);
    };
    Remove.prototype.onTransactionCompleted = function () {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    };
    return Remove;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/keystore/business/set_logic.ts":
/*!***************************************************!*\
  !*** ./src/worker/keystore/business/set_logic.ts ***!
  \***************************************************/
/*! exports provided: Set */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Set", function() { return Set; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./src/worker/keystore/business/base_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./src/worker/keystore/business/idb_helper.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../query_executor */ "./src/worker/keystore/query_executor.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Set = /** @class */ (function (_super) {
    __extends(Set, _super);
    function Set(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this.onTransactionCompleted_ = function () {
            if (_this.errorOccured === false && _this.onSuccess) {
                _this.onSuccess(null);
            }
        };
        try {
            _this.query = query;
            _this.onSuccess = onSuccess;
            _this.onError = onError;
        }
        catch (ex) {
            console.error(ex);
        }
        return _this;
    }
    Set.prototype.execute = function () {
        var _this = this;
        var updateIfExistElseInsert = function () {
            var cursorRequest = _this.objectStore.index(_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"].columnName).openCursor(IDBKeyRange.only(_this.query[_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"].columnName]));
            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.update(_this.query);
                }
                else {
                    insertData();
                }
            };
            cursorRequest.onerror = function (e) {
                _this.errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        var insertData = function () {
            var addResult = _this.objectStore.add(_this.query);
            addResult.onerror = function (e) {
                _this.errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        this.initTransaction();
        updateIfExistElseInsert();
    };
    Set.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"].tableName], this.onTransactionCompleted_);
        this.objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"].tableName);
    };
    return Set;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./src/worker/keystore/enums.ts":
/*!**************************************!*\
  !*** ./src/worker/keystore/enums.ts ***!
  \**************************************/
/*! exports provided: CONNECTION_STATUS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_STATUS", function() { return CONNECTION_STATUS; });
var CONNECTION_STATUS;
(function (CONNECTION_STATUS) {
    CONNECTION_STATUS["Connected"] = "connected";
    CONNECTION_STATUS["Closed"] = "closed";
    CONNECTION_STATUS["NotStarted"] = "not_connected";
})(CONNECTION_STATUS || (CONNECTION_STATUS = {}));


/***/ }),

/***/ "./src/worker/keystore/index.ts":
/*!**************************************!*\
  !*** ./src/worker/keystore/index.ts ***!
  \**************************************/
/*! exports provided: KeyStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./src/worker/keystore/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KeyStore", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["KeyStore"]; });




/***/ }),

/***/ "./src/worker/keystore/instance.ts":
/*!*****************************************!*\
  !*** ./src/worker/keystore/instance.ts ***!
  \*****************************************/
/*! exports provided: KeyStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyStore", function() { return KeyStore; });
/* harmony import */ var _utils_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils_logic */ "./src/worker/keystore/utils_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query_executor */ "./src/worker/keystore/query_executor.ts");


var KeyStore = /** @class */ (function () {
    function KeyStore() {
    }
    /**
     * Initialize KeyStore
     *
     */
    KeyStore.init = function () {
        _utils_logic__WEBPACK_IMPORTED_MODULE_0__["Utils"].setDbType();
        if (indexedDB) {
            _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
                name: 'init_db',
                query: null
            });
        }
    };
    KeyStore.close = function () {
        return _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
            name: 'close_db',
            query: null
        });
    };
    /**
     * return the value by key
     *
     * @param {string} key
     * @param {(result) => void} onSuccess
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    KeyStore.get = function (key) {
        return _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
            name: 'get',
            query: key
        });
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
    KeyStore.set = function (key, value) {
        var query = {
            Key: key,
            Value: value
        };
        return _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
            name: 'set',
            query: query
        });
    };
    /**
     * delete value
     *
     * @param {string} key
     * @param {(result) => void} [onSuccess=null]
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    KeyStore.remove = function (key) {
        return _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
            name: 'remove',
            query: key
        });
    };
    return KeyStore;
}());



/***/ }),

/***/ "./src/worker/keystore/query_executor.ts":
/*!***********************************************!*\
  !*** ./src/worker/keystore/query_executor.ts ***!
  \***********************************************/
/*! exports provided: QueryExecutor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryExecutor", function() { return QueryExecutor; });
/* harmony import */ var _business_main_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business/main_logic */ "./src/worker/keystore/business/main_logic.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");


var QueryExecutor = /** @class */ (function () {
    function QueryExecutor() {
    }
    QueryExecutor.prcoessQuery = function (request) {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promise"])(function (resolve, reject) {
            request.onSuccess = function (result) {
                resolve(result);
            };
            request.onError = function (error) {
                if (true) {
                    console.error(error);
                }
                reject(error);
            };
            _this.requestQueue.push(request);
            _this.executeCode();
        });
    };
    QueryExecutor.executeCode = function () {
        if (!this.isCodeExecuting && this.requestQueue.length > 0) {
            this.isCodeExecuting = true;
            var request = {
                name: this.requestQueue[0].name,
                query: this.requestQueue[0].query
            };
            new _business_main_logic__WEBPACK_IMPORTED_MODULE_0__["Main"](this.onQueryFinished.bind(this)).checkConnectionAndExecuteLogic(request);
        }
    };
    QueryExecutor.onQueryFinished = function (message) {
        var finishedRequest = this.requestQueue.shift();
        this.isCodeExecuting = false;
        if (message.errorOccured) {
            finishedRequest.onError(message.errorDetails);
        }
        else {
            finishedRequest.onSuccess(message.returnedValue);
        }
        this.executeCode();
    };
    QueryExecutor.requestQueue = [];
    QueryExecutor.tableName = "LocalStore";
    QueryExecutor.columnName = "Key";
    QueryExecutor.isCodeExecuting = false;
    return QueryExecutor;
}());



/***/ }),

/***/ "./src/worker/keystore/utils_logic.ts":
/*!********************************************!*\
  !*** ./src/worker/keystore/utils_logic.ts ***!
  \********************************************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
/* harmony import */ var _export__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../export */ "./src/worker/export.ts");
/* harmony import */ var _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./business/idb_helper */ "./src/worker/keystore/business/idb_helper.ts");


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
        if (!indexedDB) {
            indexedDB = self.mozIndexedDB ||
                self.webkitIndexedDB || self.msIndexedDB;
        }
        if (indexedDB) {
            IDBTransaction = IDBTransaction ||
                self.webkitIDBTransaction || self.msIDBTransaction;
            self.IDBKeyRange = self.IDBKeyRange ||
                self.webkitIDBKeyRange || self.msIDBKeyRange;
        }
        else {
            _export__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus = {
                conStatus: _export__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_STATUS"].UnableToStart,
                lastError: _export__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].IndexedDbUndefined
            };
        }
    };
    Utils.updateDbStatus = function (status, err) {
        if (err === undefined) {
            _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].dbStatus.conStatus = status;
        }
        else {
            _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    };
    return Utils;
}());



/***/ }),

/***/ "./src/worker/log_helper.ts":
/*!**********************************!*\
  !*** ./src/worker/log_helper.ts ***!
  \**********************************/
/*! exports provided: LogHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogHelper", function() { return LogHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/worker/enums.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/worker/config.ts");


var LogHelper = /** @class */ (function () {
    function LogHelper(type, info) {
        if (info === void 0) { info = null; }
        this.type = type;
        this.info_ = info;
        this.message = this.getMsg_();
    }
    LogHelper.prototype.throw = function () {
        throw this.get();
    };
    LogHelper.log = function (msg) {
        if (_config__WEBPACK_IMPORTED_MODULE_1__["Config"].isLogEnabled) {
            console.log(msg);
        }
    };
    LogHelper.prototype.logError = function () {
        console.error(this.get());
    };
    // logWarning() {
    //     console.warn(this.get());
    // }
    LogHelper.prototype.get = function () {
        return {
            message: this.message,
            type: this.type
        };
    };
    LogHelper.prototype.getMsg_ = function () {
        var errMsg;
        switch (this.type) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NotArray:
                errMsg = "Supplied value is not an array";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].UndefinedColumn:
                errMsg = "Column is undefined in Where";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].UndefinedValue:
                errMsg = "Value is undefined in Where";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].UndefinedColumnName:
                errMsg = "Column name is undefined '" + this.info_['TableName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].UndefinedDbName:
                errMsg = "Database name is not supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].UndefinedColumnValue:
                errMsg = "Column value is undefined";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NoValueSupplied:
                errMsg = "No value is supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].InvalidOp:
                errMsg = "Invalid Op Value '" + this.info_['Op'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].ColumnNotExist:
                errMsg = this.info_['isOrder'] ?
                    "Column '" + this.info_['column'] + "' in order query does not exist" :
                    "Column '" + this.info_['column'] + "' does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].EnableSearchOff:
                errMsg = "Search is turned off for the Column '" + this.info_['ColumnName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NullValue:
                errMsg = "Null value is not allowed for column '" + this.info_['ColumnName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].WrongDataType:
                errMsg = "Supplied value for column '" + this.info_['ColumnName'] +
                    "' have wrong data type";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NextJoinNotExist:
                errMsg = "Next join details not supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].TableNotExist:
                errMsg = "Table '" + this.info_['tableName'] + "' does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].DbNotExist:
                errMsg = "Database with name " + this.info_['dbName'] + " does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NotObject:
                errMsg = "supplied value is not object";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].InvalidOp:
                errMsg = "Invalid Config '" + this.info_['Config'] + " '";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].DbBlocked:
                errMsg = "database is blocked, cant be deleted right now";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].NullValueInWhere:
                errMsg = "Null/undefined is not allowed in where. Column '" + this.info_['column'] + "' has null";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["ERROR_TYPE"].InvalidJoinQuery:
                errMsg = "column " + this.info_.column + " exist in both table " + this.info_.table1 + " & " + this.info_.table2;
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

/***/ "./src/worker/model/column.ts":
/*!************************************!*\
  !*** ./src/worker/model/column.ts ***!
  \************************************/
/*! exports provided: Column */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return Column; });
var Column = /** @class */ (function () {
    function Column(key) {
        this.name = key.name;
        this.autoIncrement = key.autoIncrement != null ? key.autoIncrement : false;
        this.primaryKey = key.primaryKey != null ? key.primaryKey : false;
        this.unique = key.unique != null ? key.unique : false;
        this.notNull = key.notNull != null ? key.notNull : false;
        this.dataType = key.dataType != null ? key.dataType : (key.autoIncrement ? 'number' : null);
        this.default = key.default;
        this.multiEntry = key.multiEntry == null ? false : key.multiEntry;
        this.enableSearch = key.enableSearch == null ? true : key.enableSearch;
        this.keyPath = key.keyPath;
    }
    return Column;
}());



/***/ }),

/***/ "./src/worker/model/database.ts":
/*!**************************************!*\
  !*** ./src/worker/model/database.ts ***!
  \**************************************/
/*! exports provided: DataBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataBase", function() { return DataBase; });
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table */ "./src/worker/model/table.ts");

var DataBase = /** @class */ (function () {
    function DataBase(dataBase) {
        var _this = this;
        this.tables = [];
        this.name = dataBase.name;
        dataBase.tables.forEach(function (item) {
            _this.tables.push(new _table__WEBPACK_IMPORTED_MODULE_0__["Table"](item));
        });
    }
    return DataBase;
}());



/***/ }),

/***/ "./src/worker/model/db_helper.ts":
/*!***************************************!*\
  !*** ./src/worker/model/db_helper.ts ***!
  \***************************************/
/*! exports provided: DbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DbHelper", function() { return DbHelper; });
/* harmony import */ var _table_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table_helper */ "./src/worker/model/table_helper.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");


var DbHelper = /** @class */ (function () {
    function DbHelper(dataBase) {
        this.tables = [];
        this.dbName = dataBase.name;
        this.tables = dataBase.tables;
    }
    DbHelper.prototype.createMetaData = function () {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_1__["promiseAll"])(this.tables.map(function (table) {
            return new _table_helper__WEBPACK_IMPORTED_MODULE_0__["TableHelper"](table).createMetaData(_this.dbName);
        }));
    };
    return DbHelper;
}());



/***/ }),

/***/ "./src/worker/model/index.ts":
/*!***********************************!*\
  !*** ./src/worker/model/index.ts ***!
  \***********************************/
/*! exports provided: Column, DataBase, DbHelper, Table, TableHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _column__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./column */ "./src/worker/model/column.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return _column__WEBPACK_IMPORTED_MODULE_0__["Column"]; });

/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./database */ "./src/worker/model/database.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataBase", function() { return _database__WEBPACK_IMPORTED_MODULE_1__["DataBase"]; });

/* harmony import */ var _db_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./db_helper */ "./src/worker/model/db_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DbHelper", function() { return _db_helper__WEBPACK_IMPORTED_MODULE_2__["DbHelper"]; });

/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table */ "./src/worker/model/table.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Table", function() { return _table__WEBPACK_IMPORTED_MODULE_3__["Table"]; });

/* harmony import */ var _table_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./table_helper */ "./src/worker/model/table_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TableHelper", function() { return _table_helper__WEBPACK_IMPORTED_MODULE_4__["TableHelper"]; });








/***/ }),

/***/ "./src/worker/model/table.ts":
/*!***********************************!*\
  !*** ./src/worker/model/table.ts ***!
  \***********************************/
/*! exports provided: Table */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Table", function() { return Table; });
/* harmony import */ var _column__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./column */ "./src/worker/model/column.ts");

var Table = /** @class */ (function () {
    function Table(table) {
        this.columns = [];
        this.name = table.name;
        this.version = table.version == null ? 1 : table.version;
        for (var columnName in table.columns) {
            var column = {
                name: columnName
            };
            for (var feature in table.columns[columnName]) {
                var value = table.columns[columnName][feature];
                switch (feature) {
                    case 'primaryKey':
                    case 'autoIncrement':
                    case 'unique':
                    case 'dataType':
                    case 'enableSearch':
                    case 'keyPath':
                    case 'multiEntry':
                    case 'default':
                    case 'notNull':
                        column[feature] = value;
                        break;
                }
            }
            this.columns.push(new _column__WEBPACK_IMPORTED_MODULE_0__["Column"](column));
        }
    }
    return Table;
}());



/***/ }),

/***/ "./src/worker/model/table_helper.ts":
/*!******************************************!*\
  !*** ./src/worker/model/table_helper.ts ***!
  \******************************************/
/*! exports provided: TableHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableHelper", function() { return TableHelper; });
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _business_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../business/index */ "./src/worker/business/index.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/index */ "./src/worker/helpers/index.ts");



var TableHelper = /** @class */ (function () {
    function TableHelper(table) {
        this.columns = [];
        this.requireDelete = false;
        this.requireCreation = false;
        this.name = table.name;
        this.version = table.version;
        this.columns = table.columns;
        this.setPrimaryKey_();
    }
    TableHelper.prototype.createMetaData = function (dbName) {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_2__["promise"])(function (resolve) {
            _this.callback_ = resolve;
            _this.setRequireDelete_(dbName);
            _this.setDbVersion_(dbName);
        });
    };
    TableHelper.prototype.setPrimaryKey_ = function () {
        var _this = this;
        this.columns.every(function (item) {
            _this.primaryKey = item.primaryKey ? item.name : "";
            return !item.primaryKey;
        });
    };
    TableHelper.prototype.setRequireDelete_ = function (dbName) {
        var _this = this;
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].get("JsStore_" + dbName + "_" + this.name + "_Version").then(function (tableVersion) {
            if (tableVersion == null) {
                _this.requireCreation = true;
            }
            // mark only table which has version greater than store version
            else if (tableVersion < _this.version) {
                _this.requireDelete = true;
            }
        });
    };
    TableHelper.prototype.setDbVersion_ = function (dbName) {
        var _this = this;
        _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion = _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion > this.version ? _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion : this.version;
        // setting db version
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].set("JsStore_" + dbName + "_Db_Version", _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion);
        // setting table version
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["KeyStore"].set("JsStore_" + dbName + "_" + this.name + "_Version", _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion).then(function () {
            _this.version = _business_index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].activeDbVersion;
            _this.callback_(_this);
        });
    };
    return TableHelper;
}());



/***/ }),

/***/ "./src/worker/query_executor.ts":
/*!**************************************!*\
  !*** ./src/worker/query_executor.ts ***!
  \**************************************/
/*! exports provided: QueryExecutor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryExecutor", function() { return QueryExecutor; });
/* harmony import */ var _business_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business/index */ "./src/worker/business/index.ts");
/* harmony import */ var _business_select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./business/select/index */ "./src/worker/business/select/index.ts");
/* harmony import */ var _business_count_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./business/count/index */ "./src/worker/business/count/index.ts");
/* harmony import */ var _business_insert_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./business/insert/index */ "./src/worker/business/insert/index.ts");
/* harmony import */ var _business_remove_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./business/remove/index */ "./src/worker/business/remove/index.ts");
/* harmony import */ var _business_update_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./business/update/index */ "./src/worker/business/update/index.ts");
/* harmony import */ var _business_transaction_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./business/transaction/index */ "./src/worker/business/transaction/index.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./log_helper */ "./src/worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./enums */ "./src/worker/enums.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./config */ "./src/worker/config.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _model_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./model/index */ "./src/worker/model/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./util */ "./src/worker/util.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./helpers/index */ "./src/worker/helpers/index.ts");














var QueryExecutor = /** @class */ (function () {
    function QueryExecutor(fn) {
        this.onQueryFinished = fn;
        _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"].autoIncrementValues = {};
    }
    QueryExecutor.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        _log_helper__WEBPACK_IMPORTED_MODULE_7__["LogHelper"].log('request executing:' + request.name);
        switch (request.name) {
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].InitDb:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].IsDbExist:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbVersion:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbList:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbSchema:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Get:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Set:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].ChangeLogStatus:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Terminate:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].OpenDb:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].InitKeyStore:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].CloseDb:
                this.executeLogic_(request);
                break;
            default:
                switch (this.dbStatus_.conStatus) {
                    case _enums__WEBPACK_IMPORTED_MODULE_8__["CONNECTION_STATUS"].Connected:
                        {
                            this.executeLogic_(request);
                        }
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_8__["CONNECTION_STATUS"].Closed:
                        {
                            if (this.isDbDeletedByBrowser_ === true) {
                                this.initDb_(null, function () {
                                    _this.isDbDeletedByBrowser_ = false;
                                    _this.checkConnectionAndExecuteLogic(request);
                                }, request.onError);
                            }
                            else {
                                this.initDb_(this.activeDb_, function () {
                                    _this.checkConnectionAndExecuteLogic(request);
                                }, request.onError);
                            }
                        }
                        break;
                }
        }
    };
    QueryExecutor.prototype.changeLogStatus_ = function (status, onSuccess, onError) {
        _config__WEBPACK_IMPORTED_MODULE_9__["Config"].isLogEnabled = status;
        onSuccess();
    };
    QueryExecutor.prototype.returnResult_ = function (result) {
        if (_config__WEBPACK_IMPORTED_MODULE_9__["Config"].isRuningInWorker === true) {
            self.postMessage(result);
        }
        else {
            this.onQueryFinished(result);
        }
    };
    QueryExecutor.prototype.executeLogic_ = function (request) {
        var _this = this;
        var onSuccess = function (results) {
            _this.returnResult_({
                returnedValue: results
            });
        };
        var onError = function (err) {
            _this.returnResult_({
                errorDetails: err,
                errorOccured: true
            });
        };
        QueryExecutor.isTransactionQuery = request.name === _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Transaction;
        switch (request.name) {
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].OpenDb:
                this.openDb_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Select:
                this.select_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Insert:
                this.insert_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Update:
                this.update_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Remove:
                this.remove_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].IsDbExist:
                this.isDbExist_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbVersion:
                this.getDbVersion_(request.query).then(onSuccess).catch(onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbList:
                this.getDbList_().then(onSuccess).catch(onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].GetDbSchema:
                this.getDbSchema_(request.query).then(onSuccess).catch(onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].InitDb:
                if (this.isDbDeletedByBrowser_ === true) {
                    this.initDb_(null, function () {
                        _this.isDbDeletedByBrowser_ = false;
                        onSuccess();
                    }, onError);
                }
                else {
                    this.initDb_(request.query, onSuccess, onError);
                }
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Clear:
                this.clear_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].DropDb:
                this.dropDb_(onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Count:
                this.count_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].BulkInsert:
                this.bulkInsert_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Get:
                this.get_(request.query).then(onSuccess).catch(onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Set:
                this.set_(request.query).then(onSuccess).catch(onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].ChangeLogStatus:
                this.changeLogStatus_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Transaction:
                this.transaction_(request.query, onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].CloseDb:
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].Terminate:
                this.terminate_(onSuccess, onError);
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_8__["API"].InitKeyStore:
                this.initKeyStore_(onSuccess);
                break;
            default:
                console.error('The Api:-' + request.name + ' does not support.');
        }
    };
    QueryExecutor.prototype.openDb_ = function (dbName, onSuccess, onError) {
        var _this = this;
        if (this.activeDb_ != null && this.activeDb_.name === dbName) {
            this.processCreateDb(this.activeDb_).then(onSuccess).catch(onError);
        }
        else {
            this.getDbSchema_(dbName).then(function (db) {
                if (db != null) {
                    _this.processCreateDb(db).then(onSuccess).catch(onError);
                }
                else {
                    onError(new _log_helper__WEBPACK_IMPORTED_MODULE_7__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["ERROR_TYPE"].DbNotExist, { dbName: dbName }).get());
                }
            }).catch(onError);
        }
    };
    QueryExecutor.prototype.initKeyStore_ = function (onSuccess) {
        _keystore_index__WEBPACK_IMPORTED_MODULE_10__["KeyStore"].init();
        onSuccess();
    };
    QueryExecutor.prototype.getDbSchema_ = function (dbName) {
        return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbSchema(dbName);
    };
    QueryExecutor.prototype.terminate_ = function (onSuccess, onError) {
        var _this = this;
        _keystore_index__WEBPACK_IMPORTED_MODULE_10__["KeyStore"].close().then(function () {
            _this.closeDb_();
            onSuccess();
        });
    };
    Object.defineProperty(QueryExecutor.prototype, "isDbDeletedByBrowser_", {
        get: function () {
            return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].isDbDeletedByBrowser;
        },
        set: function (value) {
            _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].isDbDeletedByBrowser = value;
        },
        enumerable: true,
        configurable: true
    });
    QueryExecutor.prototype.getDbList_ = function () {
        return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbList();
    };
    Object.defineProperty(QueryExecutor.prototype, "activeDb_", {
        get: function () {
            return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDb;
        },
        set: function (value) {
            _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDb = value;
        },
        enumerable: true,
        configurable: true
    });
    QueryExecutor.prototype.closeDb_ = function () {
        if (_business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus.conStatus === _enums__WEBPACK_IMPORTED_MODULE_8__["CONNECTION_STATUS"].Connected) {
            _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus.conStatus = _enums__WEBPACK_IMPORTED_MODULE_8__["CONNECTION_STATUS"].ClosedByJsStore;
            _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbConnection.close();
        }
    };
    QueryExecutor.prototype.dropDb_ = function (onSuccess, onError) {
        this.closeDb_();
        var dropDbInstance = new _business_index__WEBPACK_IMPORTED_MODULE_0__["DropDb"](onSuccess, onError);
        dropDbInstance.deleteDb();
    };
    QueryExecutor.prototype.update_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].Update, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            var updateDbInstance = new _business_update_index__WEBPACK_IMPORTED_MODULE_5__["Instance"](query, onSuccess, onError);
            updateDbInstance.execute();
        }
        else {
            onError(queryHelper.error);
        }
    };
    QueryExecutor.prototype.insert_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].Insert, query);
        queryHelper.checkAndModify().then(function () {
            query = queryHelper.query;
            var insertInstance = new _business_insert_index__WEBPACK_IMPORTED_MODULE_3__["Instance"](query, onSuccess, onError);
            insertInstance.execute();
        }).catch(onError);
    };
    QueryExecutor.prototype.bulkInsert_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].BulkInsert, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            var bulkInsertInstance = new _business_index__WEBPACK_IMPORTED_MODULE_0__["BulkInsert"](query, onSuccess, onError);
            bulkInsertInstance.execute();
        }
        else {
            onError(queryHelper.error);
        }
    };
    QueryExecutor.prototype.remove_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].Remove, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            var deleteObject = new _business_remove_index__WEBPACK_IMPORTED_MODULE_4__["Instance"](query, onSuccess, onError);
            deleteObject.execute();
        }
        else {
            onError(queryHelper.error);
        }
    };
    QueryExecutor.prototype.select_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].Select, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            var selectInstance = new _business_select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"](query, onSuccess, onError);
            selectInstance.execute();
        }
        else {
            onError(queryHelper.error);
        }
    };
    QueryExecutor.prototype.count_ = function (query, onSuccess, onError) {
        var queryHelper = new _business_index__WEBPACK_IMPORTED_MODULE_0__["QueryHelper"](_enums__WEBPACK_IMPORTED_MODULE_8__["API"].Count, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            var countInstance = new _business_count_index__WEBPACK_IMPORTED_MODULE_2__["Instance"](query, onSuccess, onError);
            countInstance.execute();
        }
        else {
            onError(queryHelper.error);
        }
    };
    QueryExecutor.prototype.processCreateDb = function (db) {
        var _this = this;
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_13__["promise"])(function (res, rej) {
            // create meta data
            var dbHelper = new _model_index__WEBPACK_IMPORTED_MODULE_11__["DbHelper"](db);
            dbHelper.createMetaData().then(function (tablesMetaData) {
                _this.activeDb_ = db;
                var createDbInstance = new _business_index__WEBPACK_IMPORTED_MODULE_0__["InitDb"](function (isDbCreated) {
                    _this.activeDb_ = db;
                    // save dbSchema in keystore
                    _keystore_index__WEBPACK_IMPORTED_MODULE_10__["KeyStore"].set("JsStore_" + db.name + "_Schema", db);
                    res(isDbCreated);
                }, rej);
                createDbInstance.execute(tablesMetaData);
            });
        });
    };
    QueryExecutor.prototype.initDb_ = function (dataBase, onSuccess, onError) {
        var _this = this;
        if (dataBase == null) {
            this.processCreateDb(this.activeDb_);
        }
        else {
            this.closeDb_();
            this.getDbVersion_(dataBase.name).then(function (version) {
                _this.activeDbVersion_ = version ? version : 1;
                _this.processCreateDb(new _model_index__WEBPACK_IMPORTED_MODULE_11__["DataBase"](dataBase)).then(onSuccess).catch(onError);
            });
        }
    };
    Object.defineProperty(QueryExecutor.prototype, "activeDbVersion_", {
        get: function () {
            return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDbVersion;
        },
        set: function (value) {
            _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].activeDbVersion = value;
        },
        enumerable: true,
        configurable: true
    });
    QueryExecutor.prototype.getDbVersion_ = function (dbName) {
        return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(dbName);
    };
    Object.defineProperty(QueryExecutor.prototype, "dbStatus_", {
        get: function () {
            return _business_index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].dbStatus;
        },
        enumerable: true,
        configurable: true
    });
    QueryExecutor.prototype.clear_ = function (tableName, onSuccess, onError) {
        var clearInstance = new _business_index__WEBPACK_IMPORTED_MODULE_0__["Clear"](tableName, onSuccess, onError);
        clearInstance.execute();
    };
    QueryExecutor.prototype.getType_ = function (value) {
        return _util__WEBPACK_IMPORTED_MODULE_12__["Util"].getType(value);
    };
    QueryExecutor.prototype.isDbExist_ = function (dbInfo, onSuccess, onError) {
        if (this.dbStatus_.conStatus !== _enums__WEBPACK_IMPORTED_MODULE_8__["CONNECTION_STATUS"].UnableToStart) {
            if (this.getType_(dbInfo) === _enums__WEBPACK_IMPORTED_MODULE_8__["DATA_TYPE"].String) {
                this.getDbVersion_(dbInfo).then(function (dbVersion) {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                this.getDbVersion_(dbInfo.dbName).then(function (dbVersion) {
                    onSuccess(dbInfo.table.version <= dbVersion);
                });
            }
        }
        else {
            var error = {
                message: null,
                type: this.dbStatus_.lastError,
            };
            switch (error.type) {
                case _enums__WEBPACK_IMPORTED_MODULE_8__["ERROR_TYPE"].IndexedDbBlocked:
                    error.message = "IndexedDB is blocked";
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_8__["ERROR_TYPE"].IndexedDbUndefined:
                    error.message = "IndexedDB is not supported";
                    break;
                default: break;
            }
            onError(error);
        }
    };
    QueryExecutor.prototype.get_ = function (key) {
        return _keystore_index__WEBPACK_IMPORTED_MODULE_10__["KeyStore"].get(key);
    };
    QueryExecutor.prototype.set_ = function (query) {
        return _keystore_index__WEBPACK_IMPORTED_MODULE_10__["KeyStore"].set(query.key, query.value);
    };
    QueryExecutor.prototype.transaction_ = function (qry, onSuccess, onError) {
        var transaction = new _business_transaction_index__WEBPACK_IMPORTED_MODULE_6__["Instance"](qry, onSuccess, onError);
        transaction.execute();
    };
    QueryExecutor.isTransactionQuery = false;
    return QueryExecutor;
}());



/***/ }),

/***/ "./src/worker/start.ts":
/*!*****************************!*\
  !*** ./src/worker/start.ts ***!
  \*****************************/
/*! exports provided: initialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialize", function() { return initialize; });
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./query_executor */ "./src/worker/query_executor.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/worker/config.ts");


var initialize = function () {
    if (typeof self.alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined') {
        _config__WEBPACK_IMPORTED_MODULE_1__["Config"].isRuningInWorker = true;
        self.onmessage = function (e) {
            new _query_executor__WEBPACK_IMPORTED_MODULE_0__["QueryExecutor"]().checkConnectionAndExecuteLogic(e.data);
        };
    }
};
initialize();


/***/ }),

/***/ "./src/worker/util.ts":
/*!****************************!*\
  !*** ./src/worker/util.ts ***!
  \****************************/
/*! exports provided: Util */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/worker/enums.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keystore/index */ "./src/worker/keystore/index.ts");
/* harmony import */ var _business_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./business/index */ "./src/worker/business/index.ts");
/* harmony import */ var _helpers_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/index */ "./src/worker/helpers/index.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query_executor */ "./src/worker/query_executor.ts");





var Util = /** @class */ (function () {
    function Util() {
    }
    Util.isNull = function (value) {
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
    Util.isNullOrEmpty = function (value) {
        return value == null || value.length === 0;
    };
    Util.isString = function (value) {
        return typeof value === _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].String;
    };
    Util.isArray = function (value) {
        return Array.isArray(value);
    };
    Util.isObject = function (value) {
        return typeof value === _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Object;
    };
    Util.getObjectFirstKey = function (value) {
        for (var key in value) {
            return key;
        }
        return null;
    };
    /**
     *  get data type of supplied value
     *
     * @static
     * @param {any} value
     * @returns
     * @memberof Util
     */
    Util.getType = function (value) {
        if (value == null) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Null;
        }
        var type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].Array;
                }
                else if (value.getDate && value.getTime) {
                    return _enums__WEBPACK_IMPORTED_MODULE_0__["DATA_TYPE"].DateTime;
                }
            default:
                return type;
        }
    };
    Util.getAutoIncrementValues = function (table) {
        var autoIncColumns = table.columns.filter(function (col) {
            return col.autoIncrement;
        });
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promise"])(function (resolve, reject) {
            Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promiseAll"])(autoIncColumns.map(function (column) {
                var autoIncrementKey = "JsStore_" + _business_index__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].activeDb.name + "_" + table.name + "_" + column.name + "_Value";
                return _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].get(autoIncrementKey);
            })).then(function (results) {
                var autoIncValues = {};
                for (var i = 0; i < autoIncColumns.length; i++) {
                    autoIncValues[autoIncColumns[i].name] = results[i];
                }
                resolve(autoIncValues);
            }).catch(reject);
        });
    };
    Util.setAutoIncrementValue = function (table, autoIncrementValue) {
        var keys = Object.keys(autoIncrementValue);
        return Object(_helpers_index__WEBPACK_IMPORTED_MODULE_3__["promiseAll"])(keys.map(function (columnName) {
            var autoIncrementKey = "JsStore_" + _business_index__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].activeDb.name + "_" + table.name + "_" + columnName + "_Value";
            var value = autoIncrementValue[columnName];
            if (_query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"].isTransactionQuery === true) {
                _business_index__WEBPACK_IMPORTED_MODULE_2__["QueryHelper"].autoIncrementValues[table.name][columnName] = value;
            }
            return _keystore_index__WEBPACK_IMPORTED_MODULE_1__["KeyStore"].set(autoIncrementKey, value);
        }));
    };
    Util.removeSpace = function (value) {
        return value.replace(/\s/g, '');
    };
    return Util;
}());



/***/ })

/******/ });
//# sourceMappingURL=jsstore.worker.js.map