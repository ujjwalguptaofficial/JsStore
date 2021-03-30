import { BaseHelper } from "./base_helper";
import { IError, ERROR_TYPE, OCCURENCE, DATA_TYPE, QUERY_OPTION } from "../../common/index";
import { WhereChecker } from "./where_checker";
import { LogHelper } from "../log_helper";
import { Column } from "../model/index";
import { getDataType, getObjectFirstKey, getRegexFromLikeExpression, getLength } from "../utils/index";

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
            if (process.env.NODE_ENV === 'dev') {
                error.logError();
            }
            this.error = error.get();
        }
    }

    protected onExceptionOccured(ex: DOMException) {
        console.error(ex);
        this.onError({
            message: ex.message,
            type: ERROR_TYPE.InvalidQuery
        });
    }

    protected getColumnInfo(columnName: string, tableName: string) {
        return this.getTable(tableName).columns.find(column => column.name === columnName);
    }

    protected goToWhereLogic() {
        const firstColumn = getObjectFirstKey(this.query.where);
        if (this.objectStore.indexNames.contains(firstColumn)) {
            const value = this.query.where[firstColumn];
            if (getDataType(value) === 'object') {
                const checkFlag = getLength(value) > 1 ||
                    getLength(this.query.where) > 1

                this.whereCheckerInstance = new WhereChecker(this.query.where, checkFlag);
                const key = getObjectFirstKey(value);
                this.whereCheckerInstance.remove([firstColumn, key]);
                switch (key) {
                    case QUERY_OPTION.Like: {
                        const regexVal = getRegexFromLikeExpression(value[QUERY_OPTION.Like]);
                        (this as any).executeRegexLogic(firstColumn, regexVal);
                    } break;
                    case QUERY_OPTION.Regex:
                        (this as any).executeRegexLogic(firstColumn, value[QUERY_OPTION.Regex]);
                        break;
                    case QUERY_OPTION.In:
                        (this as any).executeInLogic(
                            firstColumn, value[QUERY_OPTION.In]
                        );
                        break;
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        (this as any).executeWhereLogic(firstColumn, value, key, "next");
                        break;
                    case QUERY_OPTION.Aggregate: break;
                    default: (this as any).executeWhereLogic(firstColumn, value, null, "next");
                }
            }
            else {
                const checkFlag = getLength(this.query.where) > 1;
                this.whereCheckerInstance = new WhereChecker(this.query.where, checkFlag);
                this.whereCheckerInstance.remove([firstColumn]);
                (this as any).executeWhereLogic(firstColumn, value, null, "next");
            }
        }
        else {
            const column: Column = this.getColumnInfo(firstColumn, this.tableName);
            const error = column == null ?
                new LogHelper(ERROR_TYPE.ColumnNotExist, { column: firstColumn }) :
                new LogHelper(ERROR_TYPE.EnableSearchOff, { column: firstColumn });

            this.onErrorOccured(error, true);
        }
    }
}