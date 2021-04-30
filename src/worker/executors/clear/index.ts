import { Base } from "@executors/base";
import { IDBUtil } from "@/worker/idbutil";
import { DbMeta } from "@/worker/model";
import { MetaHelper } from "@/worker/meta_helper";
import { promise } from "@/common";

export class Clear extends Base {
    constructor(tableName: string, util: IDBUtil) {
        super();
        this.query = tableName as any;
        this.util = util;
    }

    execute(db: DbMeta) {
        this.db = db;
        const tableName: string = this.query as any;
        this.util.createTransaction([tableName, MetaHelper.tableName]);
        const clearRequest: IDBRequest = this.util.objectStore(tableName).clear();
        try {
            return promise<void>((res, rej) => {
                clearRequest.onsuccess = (e) => {
                    const currentTable = this.table(tableName);
                    for (const columnName in currentTable.autoIncColumnValue) {
                        currentTable.autoIncColumnValue[columnName] = 0;
                    }
                    MetaHelper.set(MetaHelper.dbSchema, db, this.util).then(() => {
                        res();
                    }).catch(rej);
                };

                clearRequest.onerror = rej;
            })
        }
        catch (ex) {
            return this.onException(ex);
        }

    }
}