import { IDBUtil } from "@worker/idbutil";
import { InsertQuery, SelectQuery, ERROR_TYPE, UpdateQuery } from "@/common";
import { LogHelper, getError, promiseReject, getErrorFromException } from "@worker/utils";
import { DbMeta } from "@worker/model";

export class Base {
    db: DbMeta;
    util: IDBUtil;
    query: InsertQuery | SelectQuery | UpdateQuery;

    rowAffected = 0;
    isTxQuery = false;
    objectStore: IDBObjectStore;
    tableName: string;

    protected results: any[] = [];
    // get tableName() {
    //     return (this.query as SelectQuery).from || (this.query as InsertQuery).into
    // }

    table(name?: string) {
        const tableName = name || this.tableName;
        return this.db.tables.find(q => q.name === tableName)
    }

    primaryKey(tableName?: string) {
        return this.table(tableName).primaryKey;
    }


    protected getColumnInfo(columnName: string, tableName?: string) {
        return this.table(tableName).columns.find(column => column.name === columnName);
    }



    onException(ex: DOMException, type?) {
        console.error(ex);
        this.util.abortTransaction();
        return promiseReject(
            getErrorFromException(ex, type)
        );
    }
}