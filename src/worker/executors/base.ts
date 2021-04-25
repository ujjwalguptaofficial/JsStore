import { IDBUtil } from "@worker/idb_util";
import { InsertQuery, SelectQuery, ERROR_TYPE } from "@/common";
import { LogHelper, getError } from "@worker/utils";
import { DbMeta } from "@worker/model";

export class Base {
    db: DbMeta;
    util: IDBUtil;
    query: InsertQuery | SelectQuery;
    onSuccess: (result: any) => void;
    onError: (err: LogHelper) => void;
    rowAffected = 0;
    isTxQuery = false;
    objectStore: IDBObjectStore;


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


    protected getColumnInfo(columnName: string, tableName?: string) {
        return this.table(tableName).columns.find(column => column.name === columnName);
    }

    protected onExceptionOccured(ex: DOMException) {
        console.error(ex);
        return Promise.reject(
            getError({
                message: ex.message,
                type: ERROR_TYPE.InvalidQuery
            })
        );
    }


}