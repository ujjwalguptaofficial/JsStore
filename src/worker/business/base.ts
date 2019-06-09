import { BaseHelper } from "./base_helper";
import { IError } from "../interfaces";
import { WhereChecker } from "./where_checker";
import { LogHelper } from "../log_helper";
import { ERROR_TYPE, OCCURENCE, DATA_TYPE } from "../enums";
import { Column } from "../model/index";
import { QUERY_OPTION } from "../enums";
import { Util } from "../util";

export abstract class Base extends BaseHelper {
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
    skipRecord;
    limitRecord;

    // abstract executeRegexLogic(column: string, exp: RegExp): void;
    // abstract executeInLogic(column: string, value: any[]): void;
    // abstract executeWhereLogic(column: string, value, op, dir?): void;
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
            if (process.env.NODE_ENV === 'dev') {
                error.logError();
            }
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

    protected getColumnInfo(columnName: string, tableName: string) {
        return this.getTable(tableName).columns.find(column => column.name === columnName);
    }

    private getRegexFromLikeExpression_(likeExpression: string) {
        const filterValues = likeExpression.split('%');
        let filterValue: string;
        let occurence: OCCURENCE;
        if (filterValues[1]) {
            filterValue = filterValues[1];
            occurence = filterValues.length > 2 ? OCCURENCE.Any : OCCURENCE.Last;
        }
        else {
            filterValue = filterValues[0];
            occurence = OCCURENCE.First;
        }
        switch (occurence) {
            case OCCURENCE.First:
                return new RegExp(`^${filterValue}`, 'i');
            case OCCURENCE.Last:
                return new RegExp(`${filterValue}$`, 'i');
            default:
                return new RegExp(`${filterValue}`, 'i');
        }
    }

    protected goToWhereLogic() {
        const columnName = this.getObjectFirstKey(this.query.where);
        if (this.query.ignoreCase === true) {
            this.query.where = this.makeQryInCaseSensitive(this.query.where);
        }
        if (this.objectStore.indexNames.contains(columnName)) {
            const value = this.query.where[columnName];
            if (typeof value === 'object') {
                const checkFlag = Boolean(
                    Object.keys(value).length > 1 ||
                    Object.keys(this.query.where).length > 1
                );
                this.whereCheckerInstance = new WhereChecker(this.query.where, checkFlag);
                const key = this.getObjectFirstKey(value);
                switch (key) {
                    case QUERY_OPTION.Like: {
                        const regexVal = this.getRegexFromLikeExpression_(value[QUERY_OPTION.Like]);
                        (this as any).executeRegexLogic(columnName, regexVal);
                    } break;
                    case QUERY_OPTION.Regex:
                        (this as any).executeRegexLogic(columnName, value[QUERY_OPTION.Regex]);
                        break;
                    case QUERY_OPTION.In:
                        (this as any).executeInLogic(columnName, value[QUERY_OPTION.In]);
                        break;
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        (this as any).executeWhereLogic(columnName, value, key, "next");
                        break;
                    case QUERY_OPTION.Aggregate: break;
                    default: (this as any).executeWhereLogic(columnName, value, null, "next");
                }
            }
            else {
                const checkFlag = Boolean(Object.keys(this.query.where).length > 1);
                this.whereCheckerInstance = new WhereChecker(this.query.where, checkFlag);
                (this as any).executeWhereLogic(columnName, value, null, "next");
            }
        }
        else {
            const column: Column = this.getColumnInfo(columnName, this.tableName);
            const error = column == null ?
                new LogHelper(ERROR_TYPE.ColumnNotExist, { ColumnName: columnName }) :
                new LogHelper(ERROR_TYPE.EnableSearchOff, { ColumnName: columnName });

            this.onErrorOccured(error, true);
        }
    }

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

    protected removeSpace(value: string) {
        return Util.removeSpace(value);
    }
}