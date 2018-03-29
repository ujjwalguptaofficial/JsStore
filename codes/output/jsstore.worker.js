/*!
 * @license :jsstore - V2.0.0 - 28/03/2018
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2018 @Ujjwal Gupta; Licensed MIT
 */
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./web_worker/start.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./web_worker/business/base.ts":
/*!*************************************!*\
  !*** ./web_worker/business/base.ts ***!
  \*************************************/
/*! exports provided: Base */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
/* harmony import */ var _base_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_helper */ "./web_worker/business/base_helper.ts");
/* harmony import */ var _where_checker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./where_checker */ "./web_worker/business/where_checker.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util */ "./web_worker/util.ts");
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





var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._errorOccured = false;
        _this._errorCount = 0;
        _this._rowAffected = 0;
        _this.goToWhereLogic = function () {
            var column_name = _util__WEBPACK_IMPORTED_MODULE_4__["Util"].getObjectFirstKey(this._query.where);
            if (this._query.IgnoreCase === true) {
                this._query.where = this.makeQryInCaseSensitive(this._query.where);
            }
            if (this._objectStore.indexNames.contains(column_name)) {
                var value = this._query.where[column_name];
                if (typeof value === 'object') {
                    this._checkFlag = Boolean(Object.keys(value).length > 1 ||
                        Object.keys(this._query.where).length > 1);
                    if (this._checkFlag === true) {
                        this._whereChecker = new _where_checker__WEBPACK_IMPORTED_MODULE_1__["WhereChecker"](this._query.where);
                    }
                    var key = _util__WEBPACK_IMPORTED_MODULE_4__["Util"].getObjectFirstKey(value);
                    switch (key) {
                        case 'Like':
                            {
                                var filter_values = value.Like.split('%'), filter_value, occurence;
                                if (filter_values[1]) {
                                    filter_value = filter_values[1];
                                    occurence = filter_values.length > 2 ? _enums__WEBPACK_IMPORTED_MODULE_3__["Occurence"].Any : _enums__WEBPACK_IMPORTED_MODULE_3__["Occurence"].Last;
                                }
                                else {
                                    filter_value = filter_values[0];
                                    occurence = _enums__WEBPACK_IMPORTED_MODULE_3__["Occurence"].First;
                                }
                                if (occurence === _enums__WEBPACK_IMPORTED_MODULE_3__["Occurence"].First) {
                                    this.getAllCombinationOfWord(filter_value).forEach(function (item) {
                                        this.executeWhereLogic(column_name, { '-': { Low: item, High: item + '\uffff' } }, '-');
                                    }, this);
                                    delete this._query.where[column_name]['Like'];
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
                    this._checkFlag = Boolean(Object.keys(this._query.where).length > 1);
                    if (this._checkFlag === true) {
                        this._whereChecker = new _where_checker__WEBPACK_IMPORTED_MODULE_1__["WhereChecker"](this._query.where);
                    }
                    this.executeWhereLogic(column_name, value);
                }
            }
            else {
                this._errorOccured = true;
                var column = this.getColumnInfo(column_name), error;
                if (column == null) {
                    error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["Error_Type"].ColumnNotExist, { ColumnName: column_name }).get();
                }
                else {
                    error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["Error_Type"].EnableSearchOff, { ColumnName: column_name }).get();
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
                    var error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](e.target.error.name);
                    error._message = e.target.error.message;
                    error.logError();
                    this._onError(error);
                }
                else {
                    this._onError(e);
                    e.logError(e);
                }
            }
        }
    };
    Base.prototype.onExceptionOccured = function (ex, info) {
        switch (ex.name) {
            case 'NotFoundError':
                var error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["Error_Type"].TableNotExist, info);
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
        var where_query = this._query.where, value;
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
                this._query.where = where_query;
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
                this._query.where = where_tmp;
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
                        case _enums__WEBPACK_IMPORTED_MODULE_3__["WhereQryOption"].In:
                            results = results.concat(this.getAllCombinationOfWord(key_value, true));
                            break;
                        case _enums__WEBPACK_IMPORTED_MODULE_3__["WhereQryOption"].Like:
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
}(_base_helper__WEBPACK_IMPORTED_MODULE_0__["BaseHelper"]));



/***/ }),

/***/ "./web_worker/business/base_helper.ts":
/*!********************************************!*\
  !*** ./web_worker/business/base_helper.ts ***!
  \********************************************/
/*! exports provided: BaseHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseHelper", function() { return BaseHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");


var BaseHelper = /** @class */ (function () {
    function BaseHelper() {
        this.filterOnOccurence = function (value) {
            var found = false;
            value = value.toLowerCase();
            switch (this._compSymbol) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].Any:
                    if (value.indexOf(this._compValue) >= 0) {
                        found = true;
                    }
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].First:
                    if (value.indexOf(this._compValue) === 0) {
                        found = true;
                    }
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].Last:
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
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._tables.every(function (table) {
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
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._tables.every(function (table) {
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
        var transaction = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbConnection.transaction([tableName], "readonly"), object_store = transaction.objectStore(tableName);
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



/***/ }),

/***/ "./web_worker/business/bulk_insert.ts":
/*!********************************************!*\
  !*** ./web_worker/business/bulk_insert.ts ***!
  \********************************************/
/*! exports provided: BulkInsert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BulkInsert", function() { return BulkInsert; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./web_worker/business/base.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");
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
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].NotArray).get(), true);
        }
        else if (this.isTableExist(this._query.into) === true) {
            try {
                this.bulkinsertData();
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._query.into });
            }
        }
        else {
            var error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].TableNotExist, { TableName: this._query.into });
            error.throw();
        }
    };
    BulkInsert.prototype.bulkinsertData = function () {
        var _this = this;
        _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].createTransaction([this._query.into], function () {
            _this._onSuccess();
        });
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._transaction.objectStore(this._query.into);
        this._query.values.forEach(function (value) {
            this._objectStore.add(value);
        }, this);
    };
    return BulkInsert;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/clear.ts":
/*!**************************************!*\
  !*** ./web_worker/business/clear.ts ***!
  \**************************************/
/*! exports provided: Clear */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clear", function() { return Clear; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./web_worker/business/base.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../keystore/index */ "./web_worker/keystore/index.ts");
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
        var _this = this;
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].createTransaction([this._query], function () {
            if (_this._errorOccured === false) {
                _this._onSuccess();
            }
        });
        var clear_request = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._transaction.objectStore(this._query).clear();
        clear_request.onsuccess = function (e) {
            var current_table = _this.getTable(_this._query);
            current_table._columns.forEach(function (column) {
                if (column._autoIncrement) {
                    _keystore_index__WEBPACK_IMPORTED_MODULE_2__["set"]("JsStore_" + _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._name + "_" + _this._query + "_" + column._name + "_Value", 0);
                }
            });
        };
        clear_request.onerror = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
    };
    return Clear;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/count/base_count.ts":
/*!*************************************************!*\
  !*** ./web_worker/business/count/base_count.ts ***!
  \*************************************************/
/*! exports provided: BaseCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseCount", function() { return BaseCount; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./web_worker/business/base.ts");
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

var BaseCount = /** @class */ (function (_super) {
    __extends(BaseCount, _super);
    function BaseCount() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._resultCount = 0;
        _this._checkFlag = false;
        return _this;
    }
    return BaseCount;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/count/in_logic.ts":
/*!***********************************************!*\
  !*** ./web_worker/business/count/in_logic.ts ***!
  \***********************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./web_worker/business/count/not_where.ts");
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
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./web_worker/business/count/index.ts":
/*!********************************************!*\
  !*** ./web_worker/business/count/index.ts ***!
  \********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/business/count/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./web_worker/business/count/instance.ts":
/*!***********************************************!*\
  !*** ./web_worker/business/count/instance.ts ***!
  \***********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./web_worker/business/count/where.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./web_worker/business/select/index.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../idb_helper */ "./web_worker/business/idb_helper.ts");
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
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onSuccess = onSuccess;
        _this._query = query;
        return _this;
    }
    Instance.prototype.execute = function () {
        var _this = this;
        if (this.isTableExist(this._query.from)) {
            try {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.where.Or || Array.isArray(this._query.where)) {
                        var select_object = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"](this._query, function (results) {
                            _this._resultCount = results.length;
                            _this.onTransactionCompleted();
                        }, this._onError);
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
                this.onExceptionOccured(ex, { TableName: this._query.from });
            }
        }
        else {
            this._errorOccured = true;
            this.onErrorOccured(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_3__["Error_Type"].TableNotExist, { TableName: this._query.From }).get(), true);
        }
    };
    Instance.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_4__["IdbHelper"].createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_4__["IdbHelper"]._transaction.objectStore(this._query.From);
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
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./web_worker/business/count/like_logic.ts":
/*!*************************************************!*\
  !*** ./web_worker/business/count/like_logic.ts ***!
  \*************************************************/
/*! exports provided: Like */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Like", function() { return Like; });
/* harmony import */ var _in_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in_logic */ "./web_worker/business/count/in_logic.ts");
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
}(_in_logic__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./web_worker/business/count/not_where.ts":
/*!************************************************!*\
  !*** ./web_worker/business/count/not_where.ts ***!
  \************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_count__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_count */ "./web_worker/business/count/base_count.ts");
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
}(_base_count__WEBPACK_IMPORTED_MODULE_0__["BaseCount"]));



/***/ }),

/***/ "./web_worker/business/count/where.ts":
/*!********************************************!*\
  !*** ./web_worker/business/count/where.ts ***!
  \********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _like_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./like_logic */ "./web_worker/business/count/like_logic.ts");
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
}(_like_logic__WEBPACK_IMPORTED_MODULE_0__["Like"]));



/***/ }),

/***/ "./web_worker/business/create_db.ts":
/*!******************************************!*\
  !*** ./web_worker/business/create_db.ts ***!
  \******************************************/
/*! exports provided: CreateDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateDb", function() { return CreateDb; });
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../keystore/index */ "./web_worker/keystore/index.ts");



var CreateDb = /** @class */ (function () {
    function CreateDb(tablesMetaData, onSuccess, onError) {
        var _this = this;
        this._dbName = _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._name;
        var table_created_list = [], db_request = indexedDB.open(this._dbName, _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbVersion);
        db_request.onerror = function (event) {
            if (onError != null) {
                onError(event.target.error);
            }
        };
        db_request.onsuccess = function (event) {
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Connected;
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection = db_request.result;
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onclose = function (e) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].callDbDroppedByBrowser();
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionClosed);
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onversionchange = function (e) {
                if (e.newVersion === null) {
                    e.target.close(); // Manually close our connection to the db
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].callDbDroppedByBrowser(true);
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionClosed);
                }
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onerror = function (e) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.LastError = ("Error occured in connection :" + e.target.result);
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onabort = function (e) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus = {
                    ConStatus: _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed,
                    LastError: _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionAborted
                };
            };
            // save in database list
            _this.saveDbName();
            if (onSuccess != null) {
                onSuccess(table_created_list);
            }
        };
        db_request.onupgradeneeded = function (event) {
            var db_connection = event.target.result;
            var createObjectStore = function (item, index) {
                try {
                    if (item._primaryKey.length > 0) {
                        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._tables[index]._primaryKey = item._primaryKey;
                        var store = db_connection.createObjectStore(item._name, {
                            keyPath: item._primaryKey
                        });
                        item._columns.forEach(function (column) {
                            if (column._enableSearch === true) {
                                var options = column._primaryKey ? { unique: true } : { unique: column._unique };
                                options['multiEntry'] = column._multiEntry;
                                store.createIndex(column._name, column._name, options);
                                if (column._autoIncrement) {
                                    _keystore_index__WEBPACK_IMPORTED_MODULE_2__["set"]("JsStore_" + _this._dbName + "_" + item._name + "_" + column._name + "_Value", 0);
                                }
                            }
                        });
                    }
                    else {
                        var store = db_connection.createObjectStore(item._name, {
                            autoIncrement: true
                        });
                        item._columns.forEach(function (column) {
                            var options = { unique: column._unique, multiEntry: column._multiEntry };
                            store.createIndex(column._name, column._name, options);
                            if (column._autoIncrement) {
                                _keystore_index__WEBPACK_IMPORTED_MODULE_2__["set"]("JsStore_" + _this._dbName + "_" + item._name + "_" + column._name + "_Value", 0);
                            }
                        });
                    }
                    table_created_list.push(item._name);
                    // setting the table version
                    _keystore_index__WEBPACK_IMPORTED_MODULE_2__["set"]("JsStore_" + _this._dbName + "_" + item._name + "_Version", item._version);
                }
                catch (e) {
                    console.error(e);
                }
            };
            tablesMetaData.forEach(function (item, index) {
                if (item._requireDelete) {
                    // Delete the old datastore.    
                    if (db_connection.objectStoreNames.contains(item._name)) {
                        db_connection.deleteObjectStore(item._name);
                    }
                    createObjectStore(item, index);
                }
                else if (item._requireCreation) {
                    createObjectStore(item, index);
                }
            });
        };
    }
    CreateDb.prototype.saveDbName = function () {
        var _this = this;
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbList(function (result) {
            if (result.indexOf(_this._dbName) < 0) {
                result.push(_this._dbName);
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].setDbList(result);
            }
        });
    };
    return CreateDb;
}());



/***/ }),

/***/ "./web_worker/business/drop_db.ts":
/*!****************************************!*\
  !*** ./web_worker/business/drop_db.ts ***!
  \****************************************/
/*! exports provided: DropDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropDb", function() { return DropDb; });
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keystore/index */ "./web_worker/keystore/index.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log_helper */ "./web_worker/log_helper.ts");




var DropDb = /** @class */ (function () {
    function DropDb(onSuccess, onError) {
        this._onSuccess = onSuccess;
        this._onError = onError;
        this._dbName = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._name;
    }
    DropDb.prototype.deleteMetaData = function () {
        var _this = this;
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["remove"]("JsStore_" + this._dbName + "_Db_Version");
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._tables.forEach(function (table) {
            _keystore_index__WEBPACK_IMPORTED_MODULE_0__["remove"]("JsStore_" + _this._dbName + "_" + table._name + "_Version");
            table._columns.forEach(function (column) {
                if (column._autoIncrement) {
                    _keystore_index__WEBPACK_IMPORTED_MODULE_0__["remove"]("JsStore_" + this._dbName + "_" + table._name + "_" + column._name + "_Value");
                }
            });
        });
        // remove from database_list 
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].getDbList(function (result) {
            result.splice(result.indexOf(_this._dbName), 1);
            _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].setDbList(result);
        });
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["remove"]("JsStore_" + this._dbName + "_Schema", this._onSuccess);
    };
    DropDb.prototype.deleteDb = function () {
        var _this = this;
        setTimeout(function () {
            var db_drop_request = indexedDB.deleteDatabase(_this._dbName);
            db_drop_request.onblocked = function () {
                if (_this._onError != null) {
                    _this._onError(new _log_helper__WEBPACK_IMPORTED_MODULE_3__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_2__["Error_Type"].DbBlocked).get());
                }
            };
            db_drop_request.onerror = function (e) {
                if (_this._onError != null) {
                    _this._onError(event.target.error);
                }
            };
            db_drop_request.onsuccess = function () {
                _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].Closed;
                _this.deleteMetaData();
            };
        }, 100);
    };
    return DropDb;
}());



/***/ }),

/***/ "./web_worker/business/idb_helper.ts":
/*!*******************************************!*\
  !*** ./web_worker/business/idb_helper.ts ***!
  \*******************************************/
/*! exports provided: IdbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return IdbHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keystore/index */ "./web_worker/keystore/index.ts");
/* harmony import */ var _model_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/database */ "./web_worker/model/database.ts");
/* harmony import */ var _drop_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drop_db */ "./web_worker/business/drop_db.ts");




var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.callDbDroppedByBrowser = function (deleteMetaData) {
        if (this._dbStatus.ConStatus === _enums__WEBPACK_IMPORTED_MODULE_0__["Connection_Status"].Connected) {
            this._isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                var drop_db_object = new _drop_db__WEBPACK_IMPORTED_MODULE_3__["DropDb"](this._onDbDroppedByBrowser, null);
                drop_db_object.deleteMetaData();
            }
        }
    };
    IdbHelper.createTransaction = function (tableNames, callBack, mode) {
        var _this = this;
        if (this._transaction === null) {
            mode = mode ? mode : "readwrite";
            this._transaction = this._dbConnection.transaction(tableNames, mode);
            this._transaction.oncomplete = function () {
                _this._transaction = null;
                callBack();
            };
            this._transaction.ontimeout = function () {
                _this._transaction = null;
                console.error('transaction timed out');
            };
        }
    };
    IdbHelper.setDbList = function (list) {
        _keystore_index__WEBPACK_IMPORTED_MODULE_1__["set"]('database_list', list);
    };
    IdbHelper.updateDbStatus = function (status, err) {
        if (err === undefined) {
            this._dbStatus.ConStatus = status;
        }
        else {
            this._dbStatus = {
                ConStatus: status,
                LastError: err
            };
        }
    };
    IdbHelper.getDbList = function (callback) {
        _keystore_index__WEBPACK_IMPORTED_MODULE_1__["get"]('Database_List', function (result) {
            result = result == null ? [] : result;
            callback(result);
        });
    };
    IdbHelper.getDbVersion = function (dbName, callback) {
        _keystore_index__WEBPACK_IMPORTED_MODULE_1__["get"]("JsStore_" + dbName + "_Db_Version", function (dbVersion) {
            callback.call(this, Number(dbVersion));
        }.bind(this));
    };
    IdbHelper.getDbSchema = function (dbName, callback) {
        _keystore_index__WEBPACK_IMPORTED_MODULE_1__["get"]("JsStore_" + dbName + "_Schema", function (result) {
            if (result) {
                if (result._name) {
                    callback(result);
                }
                else {
                    var db_schema = new _model_database__WEBPACK_IMPORTED_MODULE_2__["DataBase"](result);
                    _keystore_index__WEBPACK_IMPORTED_MODULE_1__["set"]("JsStore_" + dbName + "_Schema", db_schema);
                    callback(db_schema);
                }
            }
            else {
                callback(result);
            }
        });
    };
    IdbHelper._transaction = null;
    IdbHelper._dbVersion = 0;
    IdbHelper._dbStatus = {
        ConStatus: _enums__WEBPACK_IMPORTED_MODULE_0__["Connection_Status"].NotStarted,
        LastError: null
    };
    return IdbHelper;
}());



/***/ }),

/***/ "./web_worker/business/insert/index.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/insert/index.ts ***!
  \*********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/business/insert/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./web_worker/business/insert/instance.ts":
/*!************************************************!*\
  !*** ./web_worker/business/insert/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./web_worker/business/base.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _values_checker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./values_checker */ "./web_worker/business/insert/values_checker.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../idb_helper */ "./web_worker/business/idb_helper.ts");
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
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._valuesAffected = [];
        _this._onError = onError;
        _this._query = query;
        _this._onSuccess = onSuccess;
        _this._tableName = _this._query.into;
        return _this;
    }
    Instance.prototype.execute = function () {
        var table = this.getTable(this._tableName);
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].NotArray).get(), true);
        }
        else if (table) {
            try {
                if (this._query.skipDataCheck) {
                    this.insertData(this._query.values);
                }
                else {
                    var value_checker_obj = new _values_checker__WEBPACK_IMPORTED_MODULE_3__["ValuesChecker"](table, this._query.values);
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
                this._query.values = undefined;
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._tableName });
            }
        }
        else {
            new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].TableNotExist, { TableName: this._tableName }).throw();
        }
    };
    Instance.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._query.return ? this._valuesAffected : this._rowAffected);
        }
    };
    Instance.prototype.onQueryFinished = function () {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    };
    Instance.prototype.insertData = function (values) {
        var value_index = 0, insertDataIntoTable;
        if (this._query.return) {
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
        _idb_helper__WEBPACK_IMPORTED_MODULE_4__["IdbHelper"].createTransaction([this._query.into], this.onTransactionCompleted.bind(this));
        var object_store = _idb_helper__WEBPACK_IMPORTED_MODULE_4__["IdbHelper"]._transaction.objectStore(this._query.into);
        insertDataIntoTable.call(this, values[value_index++]);
    };
    return Instance;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/insert/value_checker.ts":
/*!*****************************************************!*\
  !*** ./web_worker/business/insert/value_checker.ts ***!
  \*****************************************************/
/*! exports provided: ValueChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValueChecker", function() { return ValueChecker; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util */ "./web_worker/util.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");



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
        if (column._notNull && _util__WEBPACK_IMPORTED_MODULE_0__["Util"].isNull(this._value[column._name])) {
            this.onValidationError(_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].NullValue, { ColumnName: column._name });
        }
        else if (column._dataType && !_util__WEBPACK_IMPORTED_MODULE_0__["Util"].isNull(this._value[column._name]) &&
            _util__WEBPACK_IMPORTED_MODULE_0__["Util"].getType(this._value[column._name]) !== column._dataType) {
            this.onValidationError(_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].BadDataType, { ColumnName: column._name });
        }
    };
    ValueChecker.prototype.checkAndModifyColumnValue = function (column) {
        // check auto increment scheme
        if (column._autoIncrement) {
            this._value[column._name] = ++this._autoIncrementValue[column._name];
        }
        else if (column._default && _util__WEBPACK_IMPORTED_MODULE_0__["Util"].isNull(this._value[column._name])) {
            this._value[column._name] = column._default;
        }
        this.checkNotNullAndDataType(column);
    };
    ValueChecker.prototype.onValidationError = function (error, details) {
        this._errorOccured = true;
        this._error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](error, details).get();
    };
    return ValueChecker;
}());



/***/ }),

/***/ "./web_worker/business/insert/values_checker.ts":
/*!******************************************************!*\
  !*** ./web_worker/business/insert/values_checker.ts ***!
  \******************************************************/
/*! exports provided: ValuesChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValuesChecker", function() { return ValuesChecker; });
/* harmony import */ var _value_checker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./value_checker */ "./web_worker/business/insert/value_checker.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../index */ "./web_worker/index.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../keystore/index */ "./web_worker/keystore/index.ts");



var ValuesChecker = /** @class */ (function () {
    function ValuesChecker(table, values) {
        this._table = table;
        this._values = values;
    }
    ValuesChecker.prototype.checkAndModifyValues = function (onFinish) {
        var _this = this;
        this._onFinish = onFinish;
        var auto_inc_columns = this._table._columns.filter(function (col) {
            return col._autoIncrement;
        });
        var auto_inc_values = {};
        auto_inc_columns.forEach(function (column) {
            var auto_increment_key = "JsStore_" + _index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._name + "_" + _this._table._name + "_" + column._name + "_Value";
            _keystore_index__WEBPACK_IMPORTED_MODULE_2__["get"](auto_increment_key, function (val) {
                auto_inc_values[column._name] = val;
            });
        });
        _keystore_index__WEBPACK_IMPORTED_MODULE_2__["get"]('dumy_key', function (val) {
            _this._valueCheckerObj = new _value_checker__WEBPACK_IMPORTED_MODULE_0__["ValueChecker"](_this._table, auto_inc_values);
            _this.startChecking();
        }, function (err) {
            _this._error = err;
            _this._onFinish(true);
        });
    };
    ValuesChecker.prototype.startChecking = function () {
        var _this = this;
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
                var auto_increment_key = "JsStore_" + _index__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._activeDb._name + "_" + this._table._name + "_" + prop + "_Value";
                _keystore_index__WEBPACK_IMPORTED_MODULE_2__["set"](auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
            }
            _keystore_index__WEBPACK_IMPORTED_MODULE_2__["get"]('dumy_key', function (val) {
                _this._onFinish(false);
            }, function (err) {
                _this._error = err;
                _this._onFinish(true);
            });
        }
    };
    return ValuesChecker;
}());



/***/ }),

/***/ "./web_worker/business/open_db.ts":
/*!****************************************!*\
  !*** ./web_worker/business/open_db.ts ***!
  \****************************************/
/*! exports provided: OpenDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpenDb", function() { return OpenDb; });
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log_helper */ "./web_worker/log_helper.ts");



var OpenDb = /** @class */ (function () {
    function OpenDb(onSuccess, onError) {
        this._dbName = _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._name;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }
    OpenDb.prototype.execute = function () {
        var _this = this;
        if (this._dbName.length > 0) {
            var db_request = indexedDB.open(this._dbName, _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbVersion);
            db_request.onerror = function (event) {
                if (_this._onError != null) {
                    _this._onError(event.target.error);
                }
            };
            db_request.onsuccess = function (event) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Connected;
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection = db_request.result;
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onclose = function (e) {
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].callDbDroppedByBrowser();
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionClosed);
                };
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onversionchange = function (e) {
                    if (e.newVersion === null) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].callDbDroppedByBrowser(true);
                            _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionClosed);
                        }
                    }
                };
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onerror = function (e) {
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.LastError = ("Error occured in connection :" + e.target.result);
                };
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.onabort = function (e) {
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed;
                    _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.LastError = _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].ConnectionAborted;
                };
                if (_this._onSuccess != null) {
                    _this._onSuccess();
                }
                _this.setPrimaryKey();
            };
        }
        else {
            var error = new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].UndefinedDbName);
            error.throw();
        }
    };
    OpenDb.prototype.setPrimaryKey = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._tables.forEach(function (table, index) {
            table._columns.every(function (item) {
                _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                return !item._primaryKey;
            });
        });
    };
    return OpenDb;
}());



/***/ }),

/***/ "./web_worker/business/remove/base_remove.ts":
/*!***************************************************!*\
  !*** ./web_worker/business/remove/base_remove.ts ***!
  \***************************************************/
/*! exports provided: BaseRemove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseRemove", function() { return BaseRemove; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./web_worker/business/base.ts");
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

var BaseRemove = /** @class */ (function (_super) {
    __extends(BaseRemove, _super);
    function BaseRemove() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._checkFlag = false;
        return _this;
    }
    BaseRemove.prototype.onQueryFinished = function () {
        // ff
    };
    return BaseRemove;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/remove/in.ts":
/*!******************************************!*\
  !*** ./web_worker/business/remove/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./web_worker/business/remove/not_where.ts");
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
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./web_worker/business/remove/index.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/remove/index.ts ***!
  \*********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/business/remove/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./web_worker/business/remove/instance.ts":
/*!************************************************!*\
  !*** ./web_worker/business/remove/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./web_worker/business/remove/where.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./web_worker/util.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../select/index */ "./web_worker/business/select/index.ts");
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
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._query = query;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            if (this._query.where !== undefined) {
                this.addGreatAndLessToNotOp();
                this.initTransaction();
                if (Array.isArray(this._query.where)) {
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
            this.onExceptionOccured(ex, { TableName: this._query.from });
        }
    };
    Instance.prototype.processWhereArrayQry = function () {
        var select_object = new _select_index__WEBPACK_IMPORTED_MODULE_3__["Instance"](this._query, function (results) {
            var key_list = [], p_key = this.getPrimaryKey(this._query.from);
            results.forEach(function (item) {
                key_list.push(item[p_key]);
            });
            results = null;
            this._query.where = {};
            this._query.where[p_key] = { In: key_list };
            this.processWhere(false);
        }.bind(this), this._onError);
        select_object.execute();
    };
    Instance.prototype.processWhere = function () {
        if (this._query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    };
    Instance.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].createTransaction([this._query.from], this.onTransactionCompleted.bind(this));
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._transaction.objectStore(this._query.from);
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
        var key = _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getObjectFirstKey(this._orInfo.OrQuery);
        if (key != null) {
            var where = {};
            where[key] = this._orInfo.OrQuery[key];
            delete this._orInfo.OrQuery[key];
            this._query.where = where;
            this.goToWhereLogic();
        }
        else {
            this._isOr = true;
        }
    };
    Instance.prototype.processOrLogic = function () {
        this._isOr = true;
        this._orInfo = {
            OrQuery: this._query.where.Or
        };
        // free or memory
        delete this._query.where.Or;
    };
    return Instance;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./web_worker/business/remove/like.ts":
/*!********************************************!*\
  !*** ./web_worker/business/remove/like.ts ***!
  \********************************************/
/*! exports provided: Like */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Like", function() { return Like; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./web_worker/business/remove/in.ts");
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
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./web_worker/business/remove/not_where.ts":
/*!*************************************************!*\
  !*** ./web_worker/business/remove/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_remove__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_remove */ "./web_worker/business/remove/base_remove.ts");
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

var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        var cursor, cursor_request = this._objectStore.openCursor();
        cursor_request.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                ++_this._rowAffected;
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursor_request.onerror = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
    };
    return NotWhere;
}(_base_remove__WEBPACK_IMPORTED_MODULE_0__["BaseRemove"]));



/***/ }),

/***/ "./web_worker/business/remove/where.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/remove/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _like__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./like */ "./web_worker/business/remove/like.ts");
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
}(_like__WEBPACK_IMPORTED_MODULE_0__["Like"]));



/***/ }),

/***/ "./web_worker/business/select/base_select.ts":
/*!***************************************************!*\
  !*** ./web_worker/business/select/base_select.ts ***!
  \***************************************************/
/*! exports provided: BaseSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseSelect", function() { return BaseSelect; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./web_worker/business/base.ts");
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
        var key = this.getPrimaryKey(this._query.from);
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
    BaseSelect.prototype.onQueryFinished = function () {
        // ff
    };
    return BaseSelect;
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/select/group_by_helper.ts":
/*!*******************************************************!*\
  !*** ./web_worker/business/select/group_by_helper.ts ***!
  \*******************************************************/
/*! exports provided: GroupByHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupByHelper", function() { return GroupByHelper; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./web_worker/business/select/where.ts");
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
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./web_worker/business/select/helper.ts":
/*!**********************************************!*\
  !*** ./web_worker/business/select/helper.ts ***!
  \**********************************************/
/*! exports provided: Helper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return Helper; });
/* harmony import */ var _group_by_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./group_by_helper */ "./web_worker/business/select/group_by_helper.ts");
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
}(_group_by_helper__WEBPACK_IMPORTED_MODULE_0__["GroupByHelper"]));



/***/ }),

/***/ "./web_worker/business/select/in.ts":
/*!******************************************!*\
  !*** ./web_worker/business/select/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./web_worker/business/select/not_where.ts");
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
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./web_worker/business/select/index.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/select/index.ts ***!
  \*********************************************/
/*! exports provided: Instance, Join */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/business/select/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });

/* harmony import */ var _join__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./join */ "./web_worker/business/select/join.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Join", function() { return _join__WEBPACK_IMPORTED_MODULE_1__["Join"]; });





/***/ }),

/***/ "./web_worker/business/select/instance.ts":
/*!************************************************!*\
  !*** ./web_worker/business/select/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./web_worker/business/select/helper.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util */ "./web_worker/util.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
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
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onSuccess = onSuccess;
        _this._query = query;
        _this._skipRecord = query.skip;
        _this._limitRecord = query.limit;
        _this._tableName = query.from;
        return _this;
    }
    Instance.prototype.execute = function () {
        if (this.isTableExist(this._tableName) === true) {
            try {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    this.initTransaction();
                    if (Array.isArray(this._query.where)) {
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
            this.onErrorOccured(new _log_helper__WEBPACK_IMPORTED_MODULE_2__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_4__["Error_Type"].TableNotExist, { TableName: this._query.From }).get(), true);
        }
    };
    Instance.prototype.processWhereArrayQry = function () {
        this._isArrayQry = true;
        var is_first_where = true, where_query = this._query.where, output = [], operation, pKey = this.getPrimaryKey(this._query.From), isItemExist = function (keyValue) {
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
            this._query.where = where_query.shift();
            if (this._query.where['or']) {
                if (Object.keys(this._query.where).length === 1) {
                    operation = 'or';
                    this._query.where = this._query.where['or'];
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
        _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].createTransaction([this._tableName], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._transaction.objectStore(this._tableName);
    };
    Instance.prototype.processWhere = function () {
        if (this._query.where.or) {
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
            var key = _util__WEBPACK_IMPORTED_MODULE_3__["Util"].getObjectFirstKey(this._orInfo.OrQuery);
            if (key != null) {
                var where = {};
                where[key] = this._orInfo.OrQuery[key];
                delete this._orInfo.OrQuery[key];
                this._query.where = where;
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
            OrQuery: this._query.where.or,
            Results: []
        };
        // free or memory
        delete this._query.where.or;
    };
    return Instance;
}(_helper__WEBPACK_IMPORTED_MODULE_1__["Helper"]));



/***/ }),

/***/ "./web_worker/business/select/join.ts":
/*!********************************************!*\
  !*** ./web_worker/business/select/join.ts ***!
  \********************************************/
/*! exports provided: Join */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Join", function() { return Join; });
/* harmony import */ var _base_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_select */ "./web_worker/business/select/base_select.ts");
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instance */ "./web_worker/business/select/instance.ts");
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
                qry.Table2['JoinType'] = qry.join === undefined ?
                    'inner' : qry.join.toLowerCase();
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
        convertQueryIntoStack(query.from);
        _this._queryStack.reverse();
        // get the data for first table
        if (!_this._errorOccured) {
            var select_object = new _instance__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
                from: _this._queryStack[0].table,
                where: _this._queryStack[0].where
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
        var results = [], join_index = 0, column = query.column, tmp_results = this._results, item, result_length = tmp_results.length;
        // get the data from query table
        var select_object = new _instance__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
            from: query.table,
            order: query.order,
            where: query.where
        }, function (selectResults) {
            // perform join
            selectResults.forEach(function (value, index) {
                // search item through each global result
                for (var i = 0; i < result_length; i++) {
                    item = tmp_results[i][joinQuery.table][joinQuery.column];
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
            if (value1 === value2[query.column]) {
                results[join_index][query.table] = value2;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    results[join_index][this._queryStack[j].Table] =
                        tmp_results[itemIndex][this._queryStack[j].Table];
                }
                ++join_index;
            }
            else if (query.joinType === 'left') {
                // left join
                results[join_index] = {};
                results[join_index][query.table] = null;
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
        var _this = this;
        var join_results = [], join_index = 0, column = query.column, tmp_results = this._results, result_length = tmp_results.length, item_index = 0, where = {}, onExecutionFinished = function () {
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
                    if (item[query.column] ===
                        tmp_results[item_index][joinQuery.table][joinQuery.column]) {
                        value_found = true;
                        break;
                    }
                }
                join_results[index] = {};
                join_results[index][query.table] = item;
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
            var select_object = new _instance__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
                from: query.table,
                order: query.order,
                where: query.where
            }, function (results) {
                doRightJoin(results);
                onExecutionFinished();
            }, _this.onErrorOccured.bind(_this));
            select_object.execute();
        };
        executeLogic();
    };
    Join.prototype.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
        var join_results = [], join_index = 0, column = query.column, tmp_results = this._results, 
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
                    join_results[join_index][query.table] = value;
                    // copy other relative data into current result
                    for (var k = 0; k < this._currentQueryStackIndex; k++) {
                        join_results[join_index][this._queryStack[k].Table] =
                            tmp_results[item_index][this._queryStack[k].Table];
                    }
                    ++join_index;
                }, this);
            }
            else if (query.joinType === 'left') {
                // left join
                join_results[join_index] = {};
                join_results[join_index][query.table] = null;
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
                    where[query.column] = tmp_results[item_index][joinQuery.table][joinQuery.column];
                    var select_object = new _instance__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
                        from: query.table,
                        order: query.order,
                        where: where
                    }, function (results) {
                        doJoin(results);
                        ++item_index;
                        executeLogic();
                    }, this.onErrorOccured.bind(this));
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
                column: this._queryStack[this._currentQueryStackIndex].nextJoin.column,
                table: this._queryStack[this._currentQueryStackIndex].nextJoin.table
            };
            this._currentQueryStackIndex++;
        }
        else {
            join_query = this._queryStack[this._currentQueryStackIndex++];
        }
        var query = this._queryStack[this._currentQueryStackIndex];
        if (query.joinType === 'right') {
            this.executeRightJoin(join_query, query);
        }
        else if (query.where) {
            this.executeWhereJoinLogic(join_query, query);
        }
        else {
            this.executeWhereUndefinedLogicForJoin(join_query, query);
        }
    };
    return Join;
}(_base_select__WEBPACK_IMPORTED_MODULE_0__["BaseSelect"]));



/***/ }),

/***/ "./web_worker/business/select/like.ts":
/*!********************************************!*\
  !*** ./web_worker/business/select/like.ts ***!
  \********************************************/
/*! exports provided: Like */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Like", function() { return Like; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./web_worker/business/select/in.ts");
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
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./web_worker/business/select/not_where.ts":
/*!*************************************************!*\
  !*** ./web_worker/business/select/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_select */ "./web_worker/business/select/base_select.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
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
                var error = new _log_helper__WEBPACK_IMPORTED_MODULE_1__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_2__["Error_Type"].ColumnNotExist, { ColumnName: this._query.Order.By });
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
        var _this = this;
        var record_skipped = false, cursor;
        this._cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (record_skipped && _this._results.length !== _this._limitRecord) {
                    _this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    record_skipped = true;
                    cursor.advance(_this._skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
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
}(_base_select__WEBPACK_IMPORTED_MODULE_0__["BaseSelect"]));



/***/ }),

/***/ "./web_worker/business/select/where.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/select/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _like__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./like */ "./web_worker/business/select/like.ts");
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
}(_like__WEBPACK_IMPORTED_MODULE_0__["Like"]));



/***/ }),

/***/ "./web_worker/business/update/base_update.ts":
/*!***************************************************!*\
  !*** ./web_worker/business/update/base_update.ts ***!
  \***************************************************/
/*! exports provided: updateValue, BaseUpdate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateValue", function() { return updateValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseUpdate", function() { return BaseUpdate; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./web_worker/business/base.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../idb_helper */ "./web_worker/business/idb_helper.ts");
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


var updateValue = function (suppliedValue, storedValue) {
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
var BaseUpdate = /** @class */ (function (_super) {
    __extends(BaseUpdate, _super);
    function BaseUpdate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._checkFlag = false;
        return _this;
    }
    BaseUpdate.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].createTransaction([this._query.in], this.onTransactionCompleted.bind(this));
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._transaction.objectStore(this._query.in);
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
}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/business/update/in.ts":
/*!******************************************!*\
  !*** ./web_worker/business/update/in.ts ***!
  \******************************************/
/*! exports provided: In */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "In", function() { return In; });
/* harmony import */ var _not_where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./not_where */ "./web_worker/business/update/not_where.ts");
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base_update */ "./web_worker/business/update/base_update.ts");
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


var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var _this = this;
        var cursor, column_store = this._objectStore.index(column), cursor_request, onCursorError = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
        if (this._checkFlag) {
            for (var i = 0, length = values.length; i < length; i++) {
                if (!this._errorOccured) {
                    cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this._whereChecker.check(cursor.value)) {
                                cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(this._query.Set, cursor.value));
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
                            cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(this._query.Set, cursor.value));
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
}(_not_where__WEBPACK_IMPORTED_MODULE_0__["NotWhere"]));



/***/ }),

/***/ "./web_worker/business/update/index.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/update/index.ts ***!
  \*********************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/business/update/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["Instance"]; });




/***/ }),

/***/ "./web_worker/business/update/instance.ts":
/*!************************************************!*\
  !*** ./web_worker/business/update/instance.ts ***!
  \************************************************/
/*! exports provided: Instance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instance", function() { return Instance; });
/* harmony import */ var _where__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./where */ "./web_worker/business/update/where.ts");
/* harmony import */ var _select_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/index */ "./web_worker/business/select/index.ts");
/* harmony import */ var _schema_checker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schema_checker */ "./web_worker/business/update/schema_checker.ts");
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
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        _this._query = query;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            this._error = new _schema_checker__WEBPACK_IMPORTED_MODULE_2__["SchemaChecker"](this.getTable(this._query.in)).
                check(this._query.set, this._query.in);
            if (!this._error) {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.where.or || Array.isArray(this._query.where)) {
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
            this.onExceptionOccured.call(this, ex, { TableName: this._query.in });
        }
    };
    Instance.prototype.executeComplexLogic = function () {
        var _this = this;
        var select_object = new _select_index__WEBPACK_IMPORTED_MODULE_1__["Instance"]({
            from: this._query.in,
            where: this._query.where
        }, function (results) {
            var key = _this.getPrimaryKey(_this._query.in), in_query = [], where_qry = {};
            results.forEach(function (value) {
                in_query.push(value[key]);
            });
            results = null;
            where_qry[key] = { In: in_query };
            _this._query['where'] = where_qry;
            _this.initTransaction();
            _this.goToWhereLogic();
        }, this._onError.bind(this));
        select_object.execute();
    };
    return Instance;
}(_where__WEBPACK_IMPORTED_MODULE_0__["Where"]));



/***/ }),

/***/ "./web_worker/business/update/like.ts":
/*!********************************************!*\
  !*** ./web_worker/business/update/like.ts ***!
  \********************************************/
/*! exports provided: Like */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Like", function() { return Like; });
/* harmony import */ var _in__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./in */ "./web_worker/business/update/in.ts");
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base_update */ "./web_worker/business/update/base_update.ts");
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
                        cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(this._query.Set, cursor.value));
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
                        cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_1__["updateValue"])(this._query.Set, cursor.value));
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
}(_in__WEBPACK_IMPORTED_MODULE_0__["In"]));



/***/ }),

/***/ "./web_worker/business/update/not_where.ts":
/*!*************************************************!*\
  !*** ./web_worker/business/update/not_where.ts ***!
  \*************************************************/
/*! exports provided: NotWhere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotWhere", function() { return NotWhere; });
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_update */ "./web_worker/business/update/base_update.ts");
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

var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        var cursor, cursor_request = this._objectStore.openCursor();
        cursor_request.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_0__["updateValue"])(_this._query.Set, cursor.value));
                ++_this._rowAffected;
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursor_request.onerror = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
    };
    return NotWhere;
}(_base_update__WEBPACK_IMPORTED_MODULE_0__["BaseUpdate"]));



/***/ }),

/***/ "./web_worker/business/update/schema_checker.ts":
/*!******************************************************!*\
  !*** ./web_worker/business/update/schema_checker.ts ***!
  \******************************************************/
/*! exports provided: SchemaChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SchemaChecker", function() { return SchemaChecker; });
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./web_worker/enums.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util */ "./web_worker/util.ts");



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
                error = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].TableNotExist, { TableName: tblName });
            }
        }
        else {
            error = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].NotObject);
        }
        return error;
    };
    SchemaChecker.prototype.checkByColumn = function (column, value) {
        var error = null;
        // check not null schema
        if (column._notNull && _util__WEBPACK_IMPORTED_MODULE_2__["Util"].isNull(value)) {
            error = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].NullValue, { ColumnName: column._name });
        }
        // check datatype
        var type = _util__WEBPACK_IMPORTED_MODULE_2__["Util"].getType(value);
        if (column._dataType) {
            if (type !== column._dataType && type !== 'object') {
                error = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].BadDataType, { ColumnName: column._name });
            }
        }
        // check allowed operators
        if (type === 'object') {
            var allowed_prop = ['+', '-', '*', '/'];
            for (var prop in value) {
                if (allowed_prop.indexOf(prop) < 0 && column._dataType && type !== column._dataType) {
                    error = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].BadDataType, { ColumnName: column._name }).get();
                }
                break;
            }
        }
        return error;
    };
    return SchemaChecker;
}());



/***/ }),

/***/ "./web_worker/business/update/where.ts":
/*!*********************************************!*\
  !*** ./web_worker/business/update/where.ts ***!
  \*********************************************/
/*! exports provided: Where */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Where", function() { return Where; });
/* harmony import */ var _base_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_update */ "./web_worker/business/update/base_update.ts");
/* harmony import */ var _like__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./like */ "./web_worker/business/update/like.ts");
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
                        cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_0__["updateValue"])(this._query.Set, cursor.value));
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
                    cursor.update(Object(_base_update__WEBPACK_IMPORTED_MODULE_0__["updateValue"])(this._query.Set, cursor.value));
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
}(_like__WEBPACK_IMPORTED_MODULE_1__["Like"]));



/***/ }),

/***/ "./web_worker/business/where_checker.ts":
/*!**********************************************!*\
  !*** ./web_worker/business/where_checker.ts ***!
  \**********************************************/
/*! exports provided: WhereChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhereChecker", function() { return WhereChecker; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");

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
            comp_symbol = values.length > 2 ? _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].Any : _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].Last;
        }
        else {
            comp_value = values[0];
            comp_symbol = _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].First;
        }
        value = value.toLowerCase();
        switch (comp_symbol) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].Any:
                symbol_index = value.indexOf(comp_value.toLowerCase());
                if (symbol_index < 0) {
                    this._status = false;
                }
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Occurence"].First:
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



/***/ }),

/***/ "./web_worker/config.ts":
/*!******************************!*\
  !*** ./web_worker/config.ts ***!
  \******************************/
/*! exports provided: Config */
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

/***/ "./web_worker/enums.ts":
/*!*****************************!*\
  !*** ./web_worker/enums.ts ***!
  \*****************************/
/*! exports provided: Occurence, WebWorker_Status, Connection_Status, WhereQryOption, Data_Type, Error_Type */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Occurence", function() { return Occurence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebWorker_Status", function() { return WebWorker_Status; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Connection_Status", function() { return Connection_Status; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhereQryOption", function() { return WhereQryOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Data_Type", function() { return Data_Type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Error_Type", function() { return Error_Type; });
var Occurence;
(function (Occurence) {
    Occurence["First"] = "f";
    Occurence["Last"] = "l";
    Occurence["Any"] = "a";
})(Occurence || (Occurence = {}));
var WebWorker_Status;
(function (WebWorker_Status) {
    WebWorker_Status["Registered"] = "registerd";
    WebWorker_Status["Failed"] = "failed";
    WebWorker_Status["NotStarted"] = "not_started";
})(WebWorker_Status || (WebWorker_Status = {}));
var Connection_Status;
(function (Connection_Status) {
    Connection_Status["Connected"] = "connected";
    Connection_Status["Closed"] = "closed";
    Connection_Status["NotStarted"] = "not_started";
    Connection_Status["UnableToStart"] = "unable_to_start";
    Connection_Status["ClosedByJsStore"] = "closed_by_jsstore";
})(Connection_Status || (Connection_Status = {}));
var WhereQryOption;
(function (WhereQryOption) {
    WhereQryOption["In"] = "In";
    WhereQryOption["Like"] = "Like";
    WhereQryOption["Or"] = "Or";
})(WhereQryOption || (WhereQryOption = {}));
var Data_Type;
(function (Data_Type) {
    Data_Type["String"] = "string";
    Data_Type["Object"] = "object";
    Data_Type["Array"] = "array";
    Data_Type["Number"] = "number";
    Data_Type["Boolean"] = "boolean";
    Data_Type["Null"] = "null";
})(Data_Type || (Data_Type = {}));
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
    Error_Type["ConnectionAborted"] = "connection_aborted";
    Error_Type["ConnectionClosed"] = "connection_closed";
    Error_Type["NotObject"] = "not_object";
    Error_Type["InvalidConfig"] = "invalid_config";
    Error_Type["DbBlocked"] = "Db_blocked";
    Error_Type["IndexedDbUndefined"] = "indexeddb_undefined";
    Error_Type["IndexedDbBlocked"] = "indexeddb_blocked";
})(Error_Type || (Error_Type = {}));


/***/ }),

/***/ "./web_worker/index.ts":
/*!*****************************!*\
  !*** ./web_worker/index.ts ***!
  \*****************************/
/*! exports provided: IdbHelper, Occurence, WebWorker_Status, Connection_Status, WhereQryOption, Data_Type, Error_Type, registerEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business/idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]; });

/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums */ "./web_worker/enums.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Occurence", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["Occurence"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebWorker_Status", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["WebWorker_Status"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Connection_Status", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WhereQryOption", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["WhereQryOption"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Data_Type", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["Data_Type"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Error_Type", function() { return _enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"]; });

/* harmony import */ var _start__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./start */ "./web_worker/start.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerEvents", function() { return _start__WEBPACK_IMPORTED_MODULE_2__["registerEvents"]; });






/***/ }),

/***/ "./web_worker/keystore/business/base_logic.ts":
/*!****************************************************!*\
  !*** ./web_worker/keystore/business/base_logic.ts ***!
  \****************************************************/
/*! exports provided: Base */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
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



/***/ }),

/***/ "./web_worker/keystore/business/get_logic.ts":
/*!***************************************************!*\
  !*** ./web_worker/keystore/business/get_logic.ts ***!
  \***************************************************/
/*! exports provided: Get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Get", function() { return Get; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./web_worker/keystore/business/base_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/keystore/business/idb_helper.ts");
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



var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._key = key;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Get.prototype.execute = function () {
        var _this = this;
        var getData = function (column, value) {
            var cursor_request = _this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = function (e) {
                this._errorOccured = true;
                this.on_errorOccured(e);
            }.bind(_this);
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    this._results = cursor.value['Value'];
                }
            }.bind(_this);
        };
        this.initTransaction();
        getData(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._columnName, this._key);
    };
    Get.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._tableName], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"]._transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._tableName);
    };
    Get.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._results);
        }
    };
    return Get;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/keystore/business/idb_helper.ts":
/*!****************************************************!*\
  !*** ./web_worker/keystore/business/idb_helper.ts ***!
  \****************************************************/
/*! exports provided: IdbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdbHelper", function() { return IdbHelper; });
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/keystore/enums.ts");


var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.callDbDroppedByBrowser = function () {
        this._isDbDeletedByBrowser = _query_executor__WEBPACK_IMPORTED_MODULE_0__["QueryExecutor"]._dbStatus.ConStatus === _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Connected ? true : false;
    };
    IdbHelper.createTransaction = function (tableNames, callBack, mode) {
        var _this = this;
        if (this._transaction === null) {
            mode = mode ? mode : "readwrite";
            this._transaction = this._dbConnection.transaction(tableNames, mode);
            this._transaction.oncomplete = function () {
                _this._transaction = null;
                callBack();
            };
            this._transaction.ontimeout = function () {
                this._transaction = null;
                console.error('transaction timed out');
            };
        }
    };
    IdbHelper._transaction = null;
    return IdbHelper;
}());



/***/ }),

/***/ "./web_worker/keystore/business/init_db_logic.ts":
/*!*******************************************************!*\
  !*** ./web_worker/keystore/business/init_db_logic.ts ***!
  \*******************************************************/
/*! exports provided: temp_datas, InitDb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "temp_datas", function() { return temp_datas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitDb", function() { return InitDb; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../index */ "./web_worker/index.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/keystore/enums.ts");
/* harmony import */ var _utils_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils_logic */ "./web_worker/keystore/utils_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/keystore/business/idb_helper.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");





var temp_datas;
var InitDb = /** @class */ (function () {
    function InitDb(dbName, onSuccess, onError) {
        var db_request = self.indexedDB.open(dbName, 1);
        _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._isDbDeletedByBrowser = false;
        db_request.onerror = function (event) {
            if (event.target.error.name === 'InvalidStateError') {
                _index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus = {
                    ConStatus: _index__WEBPACK_IMPORTED_MODULE_0__["Connection_Status"].UnableToStart,
                    LastError: _index__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].IndexedDbBlocked,
                };
            }
            if (onError != null) {
                onError(event.target.error);
            }
        };
        db_request.onsuccess = function (event) {
            _query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Connected;
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._dbConnection = db_request.result;
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._dbConnection.onclose = function () {
                _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].callDbDroppedByBrowser();
                _utils_logic__WEBPACK_IMPORTED_MODULE_2__["Utils"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _index__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].ConnectionClosed);
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._dbConnection.onversionchange = function (e) {
                if (e.newVersion === null) {
                    e.target.close(); // Manually close our connection to the db
                    _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"].callDbDroppedByBrowser();
                    _utils_logic__WEBPACK_IMPORTED_MODULE_2__["Utils"].updateDbStatus(_enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed, _index__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].ConnectionClosed);
                }
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._dbConnection.onerror = function (e) {
                _query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"]._dbStatus.LastError = "Error occured in connection :" + e.target.result;
            };
            _idb_helper__WEBPACK_IMPORTED_MODULE_3__["IdbHelper"]._dbConnection.onabort = function (e) {
                _query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"]._dbStatus = {
                    ConStatus: _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed,
                    LastError: "Connection aborted"
                };
            };
            if (onSuccess != null) {
                onSuccess();
            }
        };
        db_request.onupgradeneeded = function (event) {
            var db = event.target.result, column = "Key";
            db.createObjectStore(_query_executor__WEBPACK_IMPORTED_MODULE_4__["QueryExecutor"]._tableName, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
    return InitDb;
}());



/***/ }),

/***/ "./web_worker/keystore/business/main_logic.ts":
/*!****************************************************!*\
  !*** ./web_worker/keystore/business/main_logic.ts ***!
  \****************************************************/
/*! exports provided: Main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Main", function() { return Main; });
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/keystore/enums.ts");
/* harmony import */ var _remove_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./remove_logic */ "./web_worker/keystore/business/remove_logic.ts");
/* harmony import */ var _set_logic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./set_logic */ "./web_worker/keystore/business/set_logic.ts");
/* harmony import */ var _init_db_logic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./init_db_logic */ "./web_worker/keystore/business/init_db_logic.ts");
/* harmony import */ var _get_logic__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./get_logic */ "./web_worker/keystore/business/get_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/keystore/business/idb_helper.ts");







var Main = /** @class */ (function () {
    function Main(onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        this._onSuccess = onSuccess;
    }
    Main.prototype.set = function (query, onSuccess, onError) {
        var obj_insert = new _set_logic__WEBPACK_IMPORTED_MODULE_3__["Set"](query, onSuccess, onError);
        obj_insert.execute();
    };
    Main.prototype.remove = function (key, onSuccess, onError) {
        var obj_delete = new _remove_logic__WEBPACK_IMPORTED_MODULE_2__["Remove"](key, onSuccess, onError);
        obj_delete.execute();
    };
    Main.prototype.get = function (key, onSuccess, onError) {
        var get_object = new _get_logic__WEBPACK_IMPORTED_MODULE_5__["Get"](key, onSuccess, onError);
        get_object.execute();
    };
    Main.prototype.createDb = function (onSuccess, onError) {
        var db_name = "KeyStore";
        var init_db_object = new _init_db_logic__WEBPACK_IMPORTED_MODULE_4__["InitDb"](db_name, onSuccess, onError);
    };
    Main.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        if (request.Name === 'create_db' || request.Name === 'open_db') {
            this.executeLogic(request);
        }
        else {
            switch (_query_executor__WEBPACK_IMPORTED_MODULE_0__["QueryExecutor"]._dbStatus.ConStatus) {
                case _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Connected:
                    this.executeLogic(request);
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].NotStarted:
                    setTimeout(function () {
                        this.checkConnectionAndExecuteLogic(request);
                    }.bind(this), 100);
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_1__["Connection_Status"].Closed:
                    if (_idb_helper__WEBPACK_IMPORTED_MODULE_6__["IdbHelper"]._isDbDeletedByBrowser) {
                        this.createDb(function () {
                            _idb_helper__WEBPACK_IMPORTED_MODULE_6__["IdbHelper"]._isDbDeletedByBrowser = false;
                            _this.checkConnectionAndExecuteLogic(request);
                        }, function (err) {
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
    return Main;
}());



/***/ }),

/***/ "./web_worker/keystore/business/remove_logic.ts":
/*!******************************************************!*\
  !*** ./web_worker/keystore/business/remove_logic.ts ***!
  \******************************************************/
/*! exports provided: Remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Remove", function() { return Remove; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./web_worker/keystore/business/base_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/keystore/business/idb_helper.ts");
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



var Remove = /** @class */ (function (_super) {
    __extends(Remove, _super);
    function Remove(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._rowAffected = 0;
        _this._key = key;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Remove.prototype.execute = function () {
        this.initTransaction();
        var removeData = function (column, value) {
            var _this = this;
            var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++_this._rowAffected;
                    cursor.continue();
                }
            };
        }.bind(this);
        if (!this._errorOccured) {
            removeData(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._columnName, this._key);
        }
    };
    Remove.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_2__["IdbHelper"]._transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._tableName);
    };
    Remove.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    };
    return Remove;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/keystore/business/set_logic.ts":
/*!***************************************************!*\
  !*** ./web_worker/keystore/business/set_logic.ts ***!
  \***************************************************/
/*! exports provided: Set */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Set", function() { return Set; });
/* harmony import */ var _base_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base_logic */ "./web_worker/keystore/business/base_logic.ts");
/* harmony import */ var _idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./idb_helper */ "./web_worker/keystore/business/idb_helper.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../query_executor */ "./web_worker/keystore/query_executor.ts");
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
        var _this = this;
        var updateIfExistElseInsert = function () {
            var cursor_request = _this._objectStore.index(_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"]._columnName).openCursor(IDBKeyRange.only(_this._query[_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"]._columnName]));
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.update(_this._query);
                }
                else {
                    insertData();
                }
            };
            cursor_request.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        var insertData = function () {
            var add_result = _this._objectStore.add(_this._query);
            add_result.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        this.initTransaction();
        updateIfExistElseInsert();
    };
    Set.prototype.initTransaction = function () {
        _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"].createTransaction([_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"]._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = _idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._transaction.objectStore(_query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"]._tableName);
    };
    Set.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false && this._onSuccess) {
            this._onSuccess(null);
        }
    };
    return Set;
}(_base_logic__WEBPACK_IMPORTED_MODULE_0__["Base"]));



/***/ }),

/***/ "./web_worker/keystore/enums.ts":
/*!**************************************!*\
  !*** ./web_worker/keystore/enums.ts ***!
  \**************************************/
/*! exports provided: Connection_Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Connection_Status", function() { return Connection_Status; });
var Connection_Status;
(function (Connection_Status) {
    Connection_Status["Connected"] = "connected";
    Connection_Status["Closed"] = "closed";
    Connection_Status["NotStarted"] = "not_connected";
})(Connection_Status || (Connection_Status = {}));


/***/ }),

/***/ "./web_worker/keystore/index.ts":
/*!**************************************!*\
  !*** ./web_worker/keystore/index.ts ***!
  \**************************************/
/*! exports provided: init, get, set, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instance */ "./web_worker/keystore/instance.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "init", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["init"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["get"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "set", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["set"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return _instance__WEBPACK_IMPORTED_MODULE_0__["remove"]; });




/***/ }),

/***/ "./web_worker/keystore/instance.ts":
/*!*****************************************!*\
  !*** ./web_worker/keystore/instance.ts ***!
  \*****************************************/
/*! exports provided: init, get, set, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony import */ var _utils_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils_logic */ "./web_worker/keystore/utils_logic.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query_executor */ "./web_worker/keystore/query_executor.ts");
var _this = undefined;


/**
 * Initialize KeyStore
 *
 */
var init = function () {
    _utils_logic__WEBPACK_IMPORTED_MODULE_0__["Utils"].setDbType();
    if (indexedDB) {
        _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
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
var get = function (key, onSuccess, onError) {
    if (onError === void 0) { onError = null; }
    _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
        Name: 'get',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    });
    return _this;
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
var set = function (key, value, onSuccess, onError) {
    var query = {
        Key: key,
        Value: value
    };
    _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
        Name: 'set',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: query
    });
    return _this;
};
/**
 * delete value
 *
 * @param {string} key
 * @param {(result) => void} [onSuccess=null]
 * @param {(err: IError) => void} [onError=null]
 * @returns
 */
var remove = function (key, onSuccess, onError) {
    if (onSuccess === void 0) { onSuccess = null; }
    if (onError === void 0) { onError = null; }
    _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"].prcoessQuery({
        Name: 'remove',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    });
    return _this;
};


/***/ }),

/***/ "./web_worker/keystore/query_executor.ts":
/*!***********************************************!*\
  !*** ./web_worker/keystore/query_executor.ts ***!
  \***********************************************/
/*! exports provided: QueryExecutor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryExecutor", function() { return QueryExecutor; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./web_worker/keystore/enums.ts");
/* harmony import */ var _business_main_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./business/main_logic */ "./web_worker/keystore/business/main_logic.ts");


var QueryExecutor = /** @class */ (function () {
    function QueryExecutor() {
    }
    QueryExecutor.prcoessQuery = function (request) {
        this._requestQueue.push(request);
        if (this._requestQueue.length === 1) {
            this.executeCode();
        }
    };
    QueryExecutor.executeCode = function () {
        var _this = this;
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            this._isCodeExecuting = true;
            var request = {
                Name: this._requestQueue[0].Name,
                Query: this._requestQueue[0].Query
            };
            new _business_main_logic__WEBPACK_IMPORTED_MODULE_1__["Main"](function (results) {
                _this.onQueryFinished(results);
            }).checkConnectionAndExecuteLogic(request);
        }
    };
    QueryExecutor.onQueryFinished = function (message) {
        var finished_request = this._requestQueue.shift();
        this._isCodeExecuting = false;
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
    QueryExecutor._requestQueue = [];
    QueryExecutor._tableName = "LocalStore";
    QueryExecutor._columnName = "Key";
    QueryExecutor._isCodeExecuting = false;
    QueryExecutor._dbStatus = {
        ConStatus: _enums__WEBPACK_IMPORTED_MODULE_0__["Connection_Status"].NotStarted,
        LastError: ""
    };
    return QueryExecutor;
}());

// export var query_executor_instance = new QueryExecutor();
// export default (new QueryExecutor());


/***/ }),

/***/ "./web_worker/keystore/utils_logic.ts":
/*!********************************************!*\
  !*** ./web_worker/keystore/utils_logic.ts ***!
  \********************************************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./web_worker/index.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query_executor */ "./web_worker/keystore/query_executor.ts");


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
            _index__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus = {
                ConStatus: _index__WEBPACK_IMPORTED_MODULE_0__["Connection_Status"].UnableToStart,
                LastError: _index__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].IndexedDbUndefined
            };
        }
    };
    Utils.updateDbStatus = function (status, err) {
        if (err === undefined) {
            _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._dbStatus.ConStatus = status;
        }
        else {
            _query_executor__WEBPACK_IMPORTED_MODULE_1__["QueryExecutor"]._dbStatus = {
                ConStatus: status,
                LastError: err
            };
        }
    };
    return Utils;
}());



/***/ }),

/***/ "./web_worker/log_helper.ts":
/*!**********************************!*\
  !*** ./web_worker/log_helper.ts ***!
  \**********************************/
/*! exports provided: LogHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogHelper", function() { return LogHelper; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./web_worker/enums.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./web_worker/config.ts");


var LogHelper = /** @class */ (function () {
    function LogHelper(type, info) {
        if (info === void 0) { info = null; }
        this._type = type;
        this._info = info;
        this._message = this.getMsg();
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
            _message: this._message,
            _type: this._type
        };
    };
    LogHelper.prototype.getMsg = function () {
        var err_msg;
        switch (this._type) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].NotArray:
                err_msg = "Supplied value is not an array";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].UndefinedColumn:
                err_msg = "Column is undefined in Where";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].UndefinedValue:
                err_msg = "Value is undefined in Where";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].UndefinedColumnName:
                err_msg = "Column name is undefined '" + this._info['TableName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].UndefinedDbName:
                err_msg = "Database name is not supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].UndefinedColumnValue:
                err_msg = "Column value is undefined";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].NoValueSupplied:
                err_msg = "No value supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].InvalidOp:
                err_msg = "Invalid Op Value '" + this._info['Op'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].ColumnNotExist:
                err_msg = "Column '" + this._info['ColumnName'] + "' does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].EnableSearchOff:
                err_msg = "Search is turned off for the Column '" + this._info['ColumnName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].NullValue:
                err_msg = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].BadDataType:
                err_msg = "Supplied value for column '" + this._info['ColumnName'] +
                    "' does not have valid type";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].NextJoinNotExist:
                err_msg = "Next join details not supplied";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].TableNotExist:
                err_msg = "Table '" + this._info['TableName'] + "' does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].DbNotExist:
                err_msg = "Database '" + this._info['DbName'] + "' does not exist";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].NotObject:
                err_msg = "supplied value is not object";
                break;
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].InvalidOp:
                err_msg = "Invalid Config '" + this._info['Config'] + " '";
            case _enums__WEBPACK_IMPORTED_MODULE_0__["Error_Type"].DbBlocked:
                err_msg = "database is blocked, cant be deleted right now";
            default:
                err_msg = this._message;
                break;
        }
        return err_msg;
    };
    return LogHelper;
}());



/***/ }),

/***/ "./web_worker/model/column.ts":
/*!************************************!*\
  !*** ./web_worker/model/column.ts ***!
  \************************************/
/*! exports provided: Column */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Column", function() { return Column; });
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./web_worker/enums.ts");


var Column = /** @class */ (function () {
    function Column(key, tableName) {
        if (key.Name != null) {
            this._name = key.Name;
        }
        else {
            var err = new _log_helper__WEBPACK_IMPORTED_MODULE_0__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_1__["Error_Type"].UndefinedColumnName, { TableName: tableName });
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



/***/ }),

/***/ "./web_worker/model/database.ts":
/*!**************************************!*\
  !*** ./web_worker/model/database.ts ***!
  \**************************************/
/*! exports provided: DataBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataBase", function() { return DataBase; });
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table */ "./web_worker/model/table.ts");

var DataBase = /** @class */ (function () {
    function DataBase(dataBase) {
        this._tables = [];
        this._name = dataBase.Name;
        dataBase.Tables.forEach(function (item) {
            this._tables.push(new _table__WEBPACK_IMPORTED_MODULE_0__["Table"](item));
        }, this);
    }
    return DataBase;
}());



/***/ }),

/***/ "./web_worker/model/db_helper.ts":
/*!***************************************!*\
  !*** ./web_worker/model/db_helper.ts ***!
  \***************************************/
/*! exports provided: DbHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DbHelper", function() { return DbHelper; });
/* harmony import */ var _table_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table_helper */ "./web_worker/model/table_helper.ts");

var DbHelper = /** @class */ (function () {
    function DbHelper(dataBase) {
        this._tables = [];
        this._name = dataBase._name;
        this._tables = dataBase._tables;
    }
    DbHelper.prototype.createMetaData = function (callBack) {
        var _this = this;
        var index = 0, table_helpers = [], createMetaDataForTable = function () {
            if (index < _this._tables.length) {
                var table = _this._tables[index], table_helper = new _table_helper__WEBPACK_IMPORTED_MODULE_0__["TableHelper"](table);
                table_helper.createMetaData(_this._name, function () {
                    table_helper._callback = null;
                    table_helpers.push(table_helper);
                    createMetaDataForTable();
                });
                ++index;
            }
            else {
                callBack(table_helpers);
            }
        };
        createMetaDataForTable();
    };
    return DbHelper;
}());



/***/ }),

/***/ "./web_worker/model/table.ts":
/*!***********************************!*\
  !*** ./web_worker/model/table.ts ***!
  \***********************************/
/*! exports provided: Table */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Table", function() { return Table; });
/* harmony import */ var _column__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./column */ "./web_worker/model/column.ts");

var Table = /** @class */ (function () {
    function Table(table) {
        this._columns = [];
        this._name = table.Name;
        this._version = table.Version == null ? 1 : table.Version;
        table.Columns.forEach(function (item) {
            this._columns.push(new _column__WEBPACK_IMPORTED_MODULE_0__["Column"](item, table.Name));
        }, this);
    }
    return Table;
}());



/***/ }),

/***/ "./web_worker/model/table_helper.ts":
/*!******************************************!*\
  !*** ./web_worker/model/table_helper.ts ***!
  \******************************************/
/*! exports provided: TableHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableHelper", function() { return TableHelper; });
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keystore/index */ "./web_worker/keystore/index.ts");
/* harmony import */ var _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../business/idb_helper */ "./web_worker/business/idb_helper.ts");


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
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["get"]("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
            if (tableVersion == null) {
                this._requireCreation = true;
            }
            else if (tableVersion < this._version) {
                this._requireDelete = true;
            }
        }.bind(this));
    };
    TableHelper.prototype.setDbVersion = function (dbName) {
        _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion = _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion > this._version ? _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion : this._version;
        // setting db version
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["set"]("JsStore_" + dbName + "_Db_Version", _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion);
        // setting table version
        _keystore_index__WEBPACK_IMPORTED_MODULE_0__["set"]("JsStore_" + dbName + "_" + this._name + "_Version", _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion, this._callback);
        this._version = _business_idb_helper__WEBPACK_IMPORTED_MODULE_1__["IdbHelper"]._dbVersion;
    };
    return TableHelper;
}());



/***/ }),

/***/ "./web_worker/query_executor.ts":
/*!**************************************!*\
  !*** ./web_worker/query_executor.ts ***!
  \**************************************/
/*! exports provided: QueryExecutor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryExecutor", function() { return QueryExecutor; });
/* harmony import */ var _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./business/idb_helper */ "./web_worker/business/idb_helper.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./enums */ "./web_worker/enums.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./web_worker/config.ts");
/* harmony import */ var _business_open_db__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./business/open_db */ "./web_worker/business/open_db.ts");
/* harmony import */ var _business_drop_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./business/drop_db */ "./web_worker/business/drop_db.ts");
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./keystore/index */ "./web_worker/keystore/index.ts");
/* harmony import */ var _model_db_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model/db_helper */ "./web_worker/model/db_helper.ts");
/* harmony import */ var _business_create_db__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./business/create_db */ "./web_worker/business/create_db.ts");
/* harmony import */ var _model_database__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./model/database */ "./web_worker/model/database.ts");
/* harmony import */ var _business_select_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./business/select/index */ "./web_worker/business/select/index.ts");
/* harmony import */ var _business_count_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./business/count/index */ "./web_worker/business/count/index.ts");
/* harmony import */ var _business_insert_index__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./business/insert/index */ "./web_worker/business/insert/index.ts");
/* harmony import */ var _business_remove_index__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./business/remove/index */ "./web_worker/business/remove/index.ts");
/* harmony import */ var _business_update_index__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./business/update/index */ "./web_worker/business/update/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./util */ "./web_worker/util.ts");
/* harmony import */ var _business_clear__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./business/clear */ "./web_worker/business/clear.ts");
/* harmony import */ var _business_bulk_insert__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./business/bulk_insert */ "./web_worker/business/bulk_insert.ts");


















var QueryExecutor = /** @class */ (function () {
    function QueryExecutor() {
    }
    QueryExecutor.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        _log_helper__WEBPACK_IMPORTED_MODULE_1__["LogHelper"].log('checking connection and executing request:' + request.Name);
        switch (request.Name) {
            case 'create_db':
            case 'is_db_exist':
            case 'get_db_version':
            case 'get_db_list':
            case 'get_db_schema':
            case 'open_db':
                this.executeLogic(request);
                break;
            case 'change_log_status':
                this.changeLogStatus(request.Query['logging']);
                break;
            default:
                switch (_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus) {
                    case _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].Connected:
                        {
                            this.executeLogic(request);
                        }
                        break;
                    case _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].Closed:
                        {
                            if (_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._isDbDeletedByBrowser === true) {
                                this.createDb(null, function () {
                                    _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._isDbDeletedByBrowser = false;
                                    this.checkConnectionAndExecuteLogic(request);
                                }.bind(this), request.OnError);
                            }
                            else {
                                this.openDb(_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._name, function () {
                                    _this.checkConnectionAndExecuteLogic(request);
                                }, request.OnError);
                            }
                        }
                        break;
                }
        }
    };
    QueryExecutor.prototype.changeLogStatus = function (enableLog) {
        _config__WEBPACK_IMPORTED_MODULE_3__["Config"]._isLogEnabled = enableLog;
    };
    QueryExecutor.prototype.returnResult = function (result) {
        self.postMessage(result);
    };
    QueryExecutor.prototype.executeLogic = function (request) {
        var _this = this;
        var onSuccess = function (results) {
            _this.returnResult({
                ReturnedValue: results
            });
        };
        var onError = function (err) {
            _this.returnResult({
                ErrorDetails: err,
                ErrorOccured: true
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
            case 'remove':
                this.remove(request.Query, onSuccess, onError);
                break;
            case 'is_db_exist':
                this.isDbExist(request.Query, onSuccess, onError);
                break;
            case 'get_db_version':
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(request.Query, onSuccess);
                break;
            case 'get_db_list':
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbList(onSuccess);
                break;
            case 'get_db_schema':
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbSchema(request.Query, onSuccess);
                break;
            case 'open_db':
                if (_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._isDbDeletedByBrowser === true) {
                    this.createDb(null, function () {
                        _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._isDbDeletedByBrowser = false;
                        onSuccess();
                    }, onError);
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
            case 'export_json':
                this.exportJson(request.Query, onSuccess, onError);
                break;
            default: console.error('The Api:-' + request.Name + ' does not support.');
        }
    };
    QueryExecutor.prototype.openDb = function (dbName, onSuccess, onError) {
        _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(dbName, function (dbVersion) {
            if (dbVersion !== 0) {
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbVersion = dbVersion;
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbSchema(dbName, function (result) {
                    _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb = result;
                    var open_db_object = new _business_open_db__WEBPACK_IMPORTED_MODULE_4__["OpenDb"](onSuccess, onError);
                    open_db_object.execute();
                });
            }
            else {
                var err = new _log_helper__WEBPACK_IMPORTED_MODULE_1__["LogHelper"](_enums__WEBPACK_IMPORTED_MODULE_2__["Error_Type"].DbNotExist, { DbName: dbName });
                err.logError();
                onError(err.get());
            }
        });
    };
    QueryExecutor.prototype.closeDb = function () {
        if (_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus === _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].Connected) {
            _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus = _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].ClosedByJsStore;
            _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbConnection.close();
        }
    };
    QueryExecutor.prototype.dropDb = function (onSuccess, onError) {
        this.closeDb();
        var drop_db_object = new _business_drop_db__WEBPACK_IMPORTED_MODULE_5__["DropDb"](onSuccess, onError);
        drop_db_object.deleteDb();
    };
    QueryExecutor.prototype.update = function (query, onSuccess, onError) {
        var update_db_object = new _business_update_index__WEBPACK_IMPORTED_MODULE_14__["Instance"](query, onSuccess, onError);
        update_db_object.execute();
    };
    QueryExecutor.prototype.insert = function (query, onSuccess, onError) {
        var insert_object = new _business_insert_index__WEBPACK_IMPORTED_MODULE_12__["Instance"](query, onSuccess, onError);
        insert_object.execute();
    };
    QueryExecutor.prototype.bulkInsert = function (query, onSuccess, onError) {
        var bulk_insert_object = new _business_bulk_insert__WEBPACK_IMPORTED_MODULE_17__["BulkInsert"](query, onSuccess, onError);
        bulk_insert_object.execute();
    };
    QueryExecutor.prototype.remove = function (query, onSuccess, onError) {
        var delete_object = new _business_remove_index__WEBPACK_IMPORTED_MODULE_13__["Instance"](query, onSuccess, onError);
        delete_object.execute();
    };
    QueryExecutor.prototype.select = function (query, onSuccess, onError) {
        if (typeof query.From === 'object') {
            var select_join_object = new _business_select_index__WEBPACK_IMPORTED_MODULE_10__["Join"](query, onSuccess, onError);
        }
        else {
            var select_instance = new _business_select_index__WEBPACK_IMPORTED_MODULE_10__["Instance"](query, onSuccess, onError);
            select_instance.execute();
        }
    };
    QueryExecutor.prototype.count = function (query, onSuccess, onError) {
        if (typeof query.From === 'object') {
            query['Count'] = true;
            var select_join_object = new _business_select_index__WEBPACK_IMPORTED_MODULE_10__["Join"](query, onSuccess, onError);
        }
        else {
            var count_object = new _business_count_index__WEBPACK_IMPORTED_MODULE_11__["Instance"](query, onSuccess, onError);
            count_object.execute();
        }
    };
    QueryExecutor.prototype.createDb = function (dataBase, onSuccess, onError) {
        var processCreateDb = function () {
            // save dbSchema in keystore
            _keystore_index__WEBPACK_IMPORTED_MODULE_6__["set"]("JsStore_" + _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb._name + "_Schema", _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb);
            // create meta data
            var db_helper = new _model_db_helper__WEBPACK_IMPORTED_MODULE_7__["DbHelper"](_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb);
            db_helper.createMetaData(function (tablesMetaData) {
                var create_db_object = new _business_create_db__WEBPACK_IMPORTED_MODULE_8__["CreateDb"](tablesMetaData, onSuccess, onError);
            });
        };
        if (dataBase == null) {
            processCreateDb();
        }
        else {
            this.closeDb();
            _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(dataBase.Name, function (version) {
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbVersion = version ? version : 1;
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._activeDb = new _model_database__WEBPACK_IMPORTED_MODULE_9__["DataBase"](dataBase);
                processCreateDb();
            });
        }
    };
    QueryExecutor.prototype.clear = function (tableName, onSuccess, onError) {
        var clear_object = new _business_clear__WEBPACK_IMPORTED_MODULE_16__["Clear"](tableName, onSuccess, onError);
        clear_object.execute();
    };
    QueryExecutor.prototype.exportJson = function (query, onSuccess, onError) {
        this.select(query, function (results) {
            var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                type: "text/json"
            }));
            onSuccess(url);
        }, function (err) {
            onError(err);
        });
    };
    QueryExecutor.prototype.isDbExist = function (dbInfo, onSuccess, onError) {
        if (_business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.ConStatus !== _enums__WEBPACK_IMPORTED_MODULE_2__["Connection_Status"].UnableToStart) {
            if (_util__WEBPACK_IMPORTED_MODULE_15__["Util"].getType(dbInfo) === _enums__WEBPACK_IMPORTED_MODULE_2__["Data_Type"].String) {
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(dbInfo, function (dbVersion) {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"].getDbVersion(dbInfo.DbName, function (dbVersion) {
                    onSuccess(dbInfo.Table.Version <= dbVersion);
                });
            }
        }
        else {
            var error = {
                _message: null,
                _type: _business_idb_helper__WEBPACK_IMPORTED_MODULE_0__["IdbHelper"]._dbStatus.LastError,
            };
            switch (error._type) {
                case _enums__WEBPACK_IMPORTED_MODULE_2__["Error_Type"].IndexedDbBlocked:
                    error._message = "IndexedDB is blocked";
                    break;
                case _enums__WEBPACK_IMPORTED_MODULE_2__["Error_Type"].IndexedDbUndefined:
                    error._message = "IndexedDB is not supported";
                    break;
            }
            onError(error);
        }
    };
    return QueryExecutor;
}());



/***/ }),

/***/ "./web_worker/start.ts":
/*!*****************************!*\
  !*** ./web_worker/start.ts ***!
  \*****************************/
/*! exports provided: registerEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerEvents", function() { return registerEvents; });
/* harmony import */ var _keystore_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keystore/index */ "./web_worker/keystore/index.ts");
/* harmony import */ var _log_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log_helper */ "./web_worker/log_helper.ts");
/* harmony import */ var _query_executor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./query_executor */ "./web_worker/query_executor.ts");



var registerEvents = function () {
    self.onmessage = function (e) {
        _log_helper__WEBPACK_IMPORTED_MODULE_1__["LogHelper"].log("Request executing from WebWorker, request name: " + e.data.Name);
        var request = e.data;
        var query_executor = new _query_executor__WEBPACK_IMPORTED_MODULE_2__["QueryExecutor"]();
        query_executor.checkConnectionAndExecuteLogic(request);
    };
};
registerEvents();
_keystore_index__WEBPACK_IMPORTED_MODULE_0__["init"]();


/***/ }),

/***/ "./web_worker/util.ts":
/*!****************************!*\
  !*** ./web_worker/util.ts ***!
  \****************************/
/*! exports provided: Util */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./web_worker/enums.ts");

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
        if (value === null) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__["Data_Type"].Null;
        }
        var type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return _enums__WEBPACK_IMPORTED_MODULE_0__["Data_Type"].Array;
                }
            default:
                return type;
        }
    };
    return Util;
}());



/***/ })

/******/ });
//# sourceMappingURL=jsstore.worker.js.map