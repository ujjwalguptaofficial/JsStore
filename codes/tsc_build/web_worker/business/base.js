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
import { BaseHelper } from "./base_helper";
import { WhereChecker } from "./where_checker";
import { LogHelper } from "../log_helper";
import { Error_Type, Occurence, WhereQryOption } from "../enums";
import { Util } from "../util";
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._errorOccured = false;
        _this._errorCount = 0;
        _this._rowAffected = 0;
        _this.goToWhereLogic = function () {
            var column_name = Util.getObjectFirstKey(this._query.where);
            if (this._query.IgnoreCase === true) {
                this._query.where = this.makeQryInCaseSensitive(this._query.where);
            }
            if (this._objectStore.indexNames.contains(column_name)) {
                var value = this._query.where[column_name];
                if (typeof value === 'object') {
                    this._checkFlag = Boolean(Object.keys(value).length > 1 ||
                        Object.keys(this._query.where).length > 1);
                    if (this._checkFlag === true) {
                        this._whereChecker = new WhereChecker(this._query.where);
                    }
                    var key = Util.getObjectFirstKey(value);
                    switch (key) {
                        case 'Like':
                            {
                                var filter_values = value.Like.split('%'), filter_value, occurence;
                                if (filter_values[1]) {
                                    filter_value = filter_values[1];
                                    occurence = filter_values.length > 2 ? Occurence.Any : Occurence.Last;
                                }
                                else {
                                    filter_value = filter_values[0];
                                    occurence = Occurence.First;
                                }
                                if (occurence === Occurence.First) {
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
                        this._whereChecker = new WhereChecker(this._query.where);
                    }
                    this.executeWhereLogic(column_name, value);
                }
            }
            else {
                this._errorOccured = true;
                var column = this.getColumnInfo(column_name), error;
                if (column == null) {
                    error = new LogHelper(Error_Type.ColumnNotExist, { ColumnName: column_name }).get();
                }
                else {
                    error = new LogHelper(Error_Type.EnableSearchOff, { ColumnName: column_name }).get();
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
                    var error = new LogHelper(e.target.error.name);
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
                var error = new LogHelper(Error_Type.TableNotExist, info);
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
                        case WhereQryOption.In:
                            results = results.concat(this.getAllCombinationOfWord(key_value, true));
                            break;
                        case WhereQryOption.Like:
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
}(BaseHelper));
export { Base };
//# sourceMappingURL=base.js.map