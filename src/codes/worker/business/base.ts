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
    checkFlag = false;

    protected onCursorError = (e) => {
        this.errorOccured = true;
        this.onErrorOccured(e);
    }


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
                const whereTmp = [];
                queryKeys.forEach((prop) => {
                    value = whereQuery[prop];
                    const tmpQry = {};
                    if (value[QUERY_OPTION.NotEqualTo]) {
                        tmpQry[prop] = {};
                        tmpQry[prop][QUERY_OPTION.GreaterThan] = value[QUERY_OPTION.NotEqualTo];
                        tmpQry[prop][QUERY_OPTION.Or] = {};
                        tmpQry[prop][QUERY_OPTION.Or][prop] = {};
                        tmpQry[prop][QUERY_OPTION.Or][prop][QUERY_OPTION.LessThan] = value[QUERY_OPTION.NotEqualTo];
                    }
                    else {
                        tmpQry[prop] = value;
                    }
                    whereTmp.push(tmpQry);
                });
                this.query.where = whereTmp;
            }
        }
    }

    protected goToWhereLogic = function () {
        const columnName = this.getObjectFirstKey(this.query.where);
        if (this.query.ignoreCase === true) {
            this.query.where = this.makeQryInCaseSensitive(this.query.where);
        }
        if (this.objectStore.indexNames.contains(columnName)) {
            const value = this.query.where[columnName];
            if (typeof value === 'object') {
                this.checkFlag = Boolean(
                    Object.keys(value).length > 1 ||
                    Object.keys(this.query.where).length > 1
                );
                if (this.checkFlag === true) {
                    this.whereCheckerInstance = new WhereChecker(this.query.where);
                }
                const key = this.getObjectFirstKey(value);
                switch (key) {
                    case QUERY_OPTION.Like: {
                        const filterValues = value[QUERY_OPTION.Like].split('%');
                        let filterValue: string,
                            occurence: OCCURENCE;
                        if (filterValues[1]) {
                            filterValue = filterValues[1];
                            occurence = filterValues.length > 2 ? OCCURENCE.Any : OCCURENCE.Last;
                        }
                        else {
                            filterValue = filterValues[0];
                            occurence = OCCURENCE.First;
                        }
                        if (occurence === OCCURENCE.First) {
                            this.getAllCombinationOfWord(filterValue).forEach((item) => {
                                this.executeWhereLogic(columnName,
                                    { '-': { low: item, high: item + '\uffff' } },
                                    '-');
                            });
                            delete this.query.where[columnName][QUERY_OPTION.Like];
                        }
                        else {
                            this.executeLikeLogic(columnName, filterValue, occurence);
                        }
                    } break;
                    case QUERY_OPTION.In:
                        this.executeInLogic(columnName, value[QUERY_OPTION.In]);
                        break;
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        this.executeWhereLogic(columnName, value, key);
                        break;
                    case QUERY_OPTION.Aggregate: break;
                    default: this.executeWhereLogic(columnName, value);
                }
            }
            else {
                this.checkFlag = Boolean(Object.keys(this.query.where).length > 1);
                if (this.checkFlag === true) {
                    this.whereCheckerInstance = new WhereChecker(this.query.where);
                }
                this.executeWhereLogic(columnName, value);
            }
        }
        else {
            this.errorOccured = true;
            const column: Column = this.getColumnInfo(columnName),
                error = column == null ?
                    new LogHelper(ERROR_TYPE.ColumnNotExist, { ColumnName: columnName }) :
                    new LogHelper(ERROR_TYPE.EnableSearchOff, { ColumnName: columnName });

            this.onErrorOccured(error, true);
        }
    };

    protected makeQryInCaseSensitive(qry) {
        let results = [];
        let columnValue,
            keyValue;
        for (const column in qry) {
            columnValue = qry[column];
            if (typeof columnValue === 'object') {
                for (const key in columnValue) {
                    keyValue = columnValue[key];
                    switch (key) {
                        case QUERY_OPTION.In:
                            results = results.concat(this.getAllCombinationOfWord(keyValue, true));
                            break;
                        case QUERY_OPTION.Like:
                            break;
                        default:
                            results = results.concat(this.getAllCombinationOfWord(keyValue));
                    }
                }
                qry[column][QUERY_OPTION.In] = results;
            }
            else {
                results = results.concat(this.getAllCombinationOfWord(columnValue));
                qry[column] = {};
                qry[column][QUERY_OPTION.In] = results;
            }
        }
        return qry;
    }
}