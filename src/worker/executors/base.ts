import { IDBUtil } from "@worker/idbutil";
import { IInsertQuery, ISelectQuery, IUpdateQuery } from "@/common";
import { promiseReject, getErrorFromException } from "@worker/utils";

export class Base {

    get db() {
        return this.util.db;
    }

    util: IDBUtil;
    query: IInsertQuery | ISelectQuery | IUpdateQuery;

    rowAffected = 0;
    isTxQuery = false;
    objectStore: IDBObjectStore;
    tableName: string;

    protected results: any[] = [];

    table(name?: string) {
        const tableName = name || this.tableName;
        const table = this.db.tables.find(q => q.name === tableName);
        if (process.env.NODE_ENV !== 'production') {
            if (!table) {
                console.warn(`No table found with name ${tableName}`);
            }
        }
        return table;
    }

    primaryKey(tableName?: string) {
        const query = this.query as ISelectQuery;
        if (!query.from && query.store && query.meta) {
            const primaryKey = query.meta.primaryKey;
            if (process.env.NODE_ENV !== 'production') {
                if (primaryKey == null) {
                    delete query.store;
                    console.warn(`no primary key found for query - ${JSON.stringify(this.query)}`);
                }
            }
            return primaryKey;
        }
        const table = this.table(tableName);
        if (process.env.NODE_ENV !== 'production') {
            if (table == null && query.store) {
                delete query.store;
                const metaValue = query.meta;
                if (!metaValue || !metaValue.primaryKey) {
                    console.warn(`no primary key found for query - ${JSON.stringify(this.query)}. Please supply primary key in meta field.`);
                }
            }
        }
        return table.primaryKey;
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
