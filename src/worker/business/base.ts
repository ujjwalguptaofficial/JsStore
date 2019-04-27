import { BaseHelper } from "./base_helper";
import { IError } from "../interfaces";
import { WhereChecker } from "./where_checker";
import { LogHelper } from "../log_helper";
import { ERROR_TYPE, OCCURENCE, DATA_TYPE } from "../enums";
import { Column } from "../model/index";
import { QUERY_OPTION } from "../enums";

export class Base extends BaseHelper {
    error: IError;
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
    skipRecord;
    limitRecord;

    protected onErrorOccured(e, customError = false) {
        if (customError) {
            e.logError();
            this.error = (e as LogHelper).get();
        }
        else {
            let error;
            if (e.name) {
                error = new LogHelper((e.name));
                error.message = e.message;
            }
            else {
                error = new LogHelper((e as any).target.error.name);
                error.message = (e as any).target.error.message;
            }
            error.logError();
            this.error = error.get();
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
        return this.getTable(this.tableName).columns.find(column => column.name === columnName);
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
                        this.executeLikeLogic(columnName, filterValue, occurence);
                    } break;
                    case QUERY_OPTION.Regex:
                        this.executeRegexLogic(columnName, value[QUERY_OPTION.Regex]);
                        break;
                    case QUERY_OPTION.In:
                        this.executeInLogic(columnName, value[QUERY_OPTION.In]);
                        break;
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        this.executeWhereLogic(columnName, value, key, "next");
                        break;
                    case QUERY_OPTION.Aggregate: break;
                    default: this.executeWhereLogic(columnName, value, null, "next");
                }
            }
            else {
                this.checkFlag = Boolean(Object.keys(this.query.where).length > 1);
                if (this.checkFlag === true) {
                    this.whereCheckerInstance = new WhereChecker(this.query.where);
                }
                this.executeWhereLogic(columnName, value, null, "next");
            }
        }
        else {
            const column: Column = this.getColumnInfo(columnName);
            const error = column == null ?
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

            switch (this.getType(columnValue)) {
                case DATA_TYPE.String:
                    results = results.concat(this.getAllCombinationOfWord(columnValue));
                    qry[column] = {};
                    qry[column][QUERY_OPTION.In] = results;
                    break;
                case DATA_TYPE.Object:
                    for (const key in columnValue) {
                        keyValue = columnValue[key];
                        if (this.isString(keyValue)) {
                            switch (key) {
                                case QUERY_OPTION.In:
                                    results = results.concat(this.getAllCombinationOfWord(keyValue, true));
                                    break;
                                case QUERY_OPTION.Like:
                                case QUERY_OPTION.Regex:
                                    break;
                                default:
                                    results = results.concat(this.getAllCombinationOfWord(keyValue));
                            }
                        }
                    }
                    qry[column][QUERY_OPTION.In] = results;
                    break;
            }
        }
        return qry;
    }
}