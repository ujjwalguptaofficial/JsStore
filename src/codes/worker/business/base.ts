import { BaseHelper } from "./base_helper";
import { IError } from "../interfaces";
import { WhereChecker } from "./where_checker";
import { IdbHelper } from "./idb_helper";
import { LogHelper } from "../log_helper";
import { ERROR_TYPE, OCCURENCE } from "../enums";
import { Column } from "../model/column";
import { QUERY_OPTION } from "../enums";

export class Base extends BaseHelper {
    error: IError;
    errorOccured = false;
    errorCount = 0;
    rowAffected = 0;
    onSuccess: (result?) => void;
    onError: (err: IError) => void;
    objectStore: IDBObjectStore;
    query;
    whereCheckerInstance: WhereChecker;
    tableName: string;
    isTransaction: boolean;
    cursorOpenRequest: IDBRequest;

    protected onErrorOccured(e, customError = false) {
        ++this.errorCount;
        if (this.errorCount === 1) {
            if (customError) {
                e.logError();
                this.onError((e as LogHelper).get());
            }
            else {
                const error = new LogHelper((e as any).target.error.name);
                error.message = (e as any).target.error.message;
                error.logError();
                this.onError(error.get());
            }
        }
    }

    protected onExceptionOccured(ex: DOMException, info) {
        switch (ex.name) {
            case 'NotFoundError':
                const error = new LogHelper(ERROR_TYPE.TableNotExist, info);
                this.onErrorOccured(error, true);
                break;
            default: console.error(ex);
        }
    }

    protected getColumnInfo(columnName) {
        let columnInfo: Column;
        this.getTable(this.tableName).columns.every((column) => {
            if (column.name === columnName) {
                columnInfo = column;
                return false;
            }
            return true;
        });
        return columnInfo;
    }

    protected addGreatAndLessToNotOp() {
        const whereQuery = this.query.where;
        let value;
        if (this.containsNot(whereQuery)) {
            const queryKeys = Object.keys(whereQuery);
            if (queryKeys.length === 1) {
                queryKeys.forEach((prop) => {
                    value = whereQuery[prop];
                    if (value[QUERY_OPTION.NotEqualTo]) {
                        whereQuery[prop][QUERY_OPTION.GreaterThan] = value[QUERY_OPTION.NotEqualTo];
                        if (whereQuery[QUERY_OPTION.Or] === undefined) {
                            whereQuery[QUERY_OPTION.Or] = {};
                            whereQuery[QUERY_OPTION.Or][prop] = {};
                        }
                        else if (whereQuery[QUERY_OPTION.Or][prop] === undefined) {
                            whereQuery[QUERY_OPTION.Or][prop] = {};
                        }
                        whereQuery[QUERY_OPTION.Or][prop][QUERY_OPTION.LessThan] = value[QUERY_OPTION.NotEqualTo];
                        delete whereQuery[prop][QUERY_OPTION.NotEqualTo];
                    }
                });
                this.query.where = whereQuery;
            }
            else {
                var where_tmp = [];
                queryKeys.forEach((prop) => {
                    value = whereQuery[prop];
                    var tmp_qry = {};
                    if (value[QUERY_OPTION.NotEqualTo]) {
                        tmp_qry[prop] = {};
                        tmp_qry[prop][QUERY_OPTION.GreaterThan] = value[QUERY_OPTION.NotEqualTo];
                        tmp_qry[prop][QUERY_OPTION.Or] = {};
                        tmp_qry[prop][QUERY_OPTION.Or][prop] = {};
                        tmp_qry[prop][QUERY_OPTION.Or][prop][QUERY_OPTION.LessThan] = value[QUERY_OPTION.NotEqualTo];
                    }
                    else {
                        tmp_qry[prop] = value;
                    }
                    where_tmp.push(tmp_qry);
                });
                this.query.where = where_tmp;
            }
        }
    }

    protected goToWhereLogic = function () {
        var column_name = this.getObjectFirstKey(this._query.where);
        if (this._query.IgnoreCase === true) {
            this._query.where = this.makeQryInCaseSensitive(this._query.where);
        }
        if (this._objectStore.indexNames.contains(column_name)) {
            var value = this._query.where[column_name];
            if (typeof value === 'object') {
                this._checkFlag = Boolean(
                    Object.keys(value).length > 1 ||
                    Object.keys(this._query.where).length > 1
                );
                if (this._checkFlag === true) {
                    this._whereChecker = new WhereChecker(this._query.where);
                }
                var key = this.getObjectFirstKey(value);
                switch (key) {
                    case QUERY_OPTION.Like: {
                        var filter_values = value[QUERY_OPTION.Like].split('%'),
                            filter_value: string,
                            occurence: OCCURENCE;
                        if (filter_values[1]) {
                            filter_value = filter_values[1];
                            occurence = filter_values.length > 2 ? OCCURENCE.Any : OCCURENCE.Last;
                        }
                        else {
                            filter_value = filter_values[0];
                            occurence = OCCURENCE.First;
                        }
                        if (occurence === OCCURENCE.First) {
                            this.getAllCombinationOfWord(filter_value).forEach((item) => {
                                this.executeWhereLogic(column_name,
                                    { '-': { low: item, high: item + '\uffff' } },
                                    '-');
                            });
                            delete this._query.where[column_name][QUERY_OPTION.Like];
                        }
                        else {
                            this.executeLikeLogic(column_name, filter_value, occurence);
                        }
                    } break;
                    case QUERY_OPTION.In:
                        this.executeInLogic(column_name, value[QUERY_OPTION.In]);
                        break;
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        this.executeWhereLogic(column_name, value, key);
                        break;
                    case QUERY_OPTION.Aggregate: break;
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
            var column: Column = this.getColumnInfo(column_name),
                error = column == null ?
                    new LogHelper(ERROR_TYPE.ColumnNotExist, { ColumnName: column_name }) :
                    new LogHelper(ERROR_TYPE.EnableSearchOff, { ColumnName: column_name });

            this.onErrorOccured(error, true);
        }
    };

    protected makeQryInCaseSensitive(qry) {
        var results = [],
            column_value,
            key_value;
        for (var column in qry) {
            column_value = qry[column];
            if (typeof column_value === 'object') {
                for (var key in column_value) {
                    key_value = column_value[key];
                    switch (key) {
                        case QUERY_OPTION.In:
                            results = results.concat(this.getAllCombinationOfWord(key_value, true));
                            break;
                        case QUERY_OPTION.Like:
                            break;
                        default:
                            results = results.concat(this.getAllCombinationOfWord(key_value));
                    }
                }
                qry[column][QUERY_OPTION.In] = results;
            }
            else {
                results = results.concat(this.getAllCombinationOfWord(column_value));
                qry[column] = {};
                qry[column][QUERY_OPTION.In] = results;
            }
        }
        return qry;
    }
}