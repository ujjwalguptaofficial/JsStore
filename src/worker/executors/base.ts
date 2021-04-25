import { IDBUtil } from "@worker/idb_util";
import { InsertQuery, SelectQuery, QUERY_OPTION, ERROR_TYPE } from "@/common";
import { LogHelper, getObjectFirstKey, getDataType, getLength, getError } from "@worker/utils";
import { DbMeta } from "@worker/model";
import { getRegexFromLikeExpression } from "@worker/utils";
import { WhereChecker } from "@worker/executors/where_checker";

export class Base {
    db: DbMeta;
    util: IDBUtil;
    query: InsertQuery | SelectQuery;
    onSuccess: (result: any) => void;
    onError: (err: LogHelper) => void;
    rowAffected = 0;
    isTxQuery = false;
    objectStore: IDBObjectStore;
    whereCheckerInstance: WhereChecker;

    protected results: any[] = [];
    get tableName() {
        return (this.query as SelectQuery).from || (this.query as InsertQuery).into
    }

    table(name?: string) {
        const tableName = name || this.tableName;
        return this.db.tables.find(q => q.name === tableName)
    }

    get primaryKey() {
        return this.table().primaryKey;
    }

    protected goToWhereLogic() {
        const query = this.query as SelectQuery;
        const firstColumn = getObjectFirstKey(query.where);
        if (this.objectStore.indexNames.contains(firstColumn)) {
            const value = query.where[firstColumn];
            if (getDataType(value) === 'object') {
                const checkFlag = getLength(value) > 1 ||
                    getLength(query.where) > 1

                this.whereCheckerInstance = new WhereChecker(query.where, checkFlag);
                const key = getObjectFirstKey(value);
                this.whereCheckerInstance.remove([firstColumn, key]);
                switch (key) {
                    case QUERY_OPTION.Like: {
                        const regexVal = getRegexFromLikeExpression(value[QUERY_OPTION.Like]);
                        return (this as any).executeRegexLogic(firstColumn, regexVal);
                    }
                    case QUERY_OPTION.Regex:
                        return (this as any).executeRegexLogic(firstColumn, value[QUERY_OPTION.Regex]);
                    case QUERY_OPTION.In:
                        return (this as any).executeInLogic(
                            firstColumn, value[QUERY_OPTION.In]
                        );
                    case QUERY_OPTION.Between:
                    case QUERY_OPTION.GreaterThan:
                    case QUERY_OPTION.LessThan:
                    case QUERY_OPTION.GreaterThanEqualTo:
                    case QUERY_OPTION.LessThanEqualTo:
                        return (this as any).executeWhereLogic(firstColumn, value, key, "next");
                    case QUERY_OPTION.Aggregate: break;
                    default:
                        return (this as any).executeWhereLogic(firstColumn, value, null, "next");
                }
            }
            else {
                const checkFlag = getLength(query.where) > 1;
                this.whereCheckerInstance = new WhereChecker(query.where, checkFlag);
                this.whereCheckerInstance.remove([firstColumn]);
                return (this as any).executeWhereLogic(firstColumn, value, null, "next");
            }
        }
        else {
            const column = this.getColumnInfo(firstColumn);
            const error = column == null ?
                new LogHelper(ERROR_TYPE.ColumnNotExist, { column: firstColumn }) :
                new LogHelper(ERROR_TYPE.EnableSearchOff, { column: firstColumn });
            return Promise.reject(
                getError(error, true)
            );
        }
    }

    protected getColumnInfo(columnName: string, tableName?: string) {
        return this.table(tableName).columns.find(column => column.name === columnName);
    }
}