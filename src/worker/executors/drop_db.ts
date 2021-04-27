import { DbMeta } from "@worker/model";
import { LogHelper, promiseReject, getError } from "@worker/utils";
import { ERROR_TYPE, promise } from "@/common";
import { MetaHelper } from "../meta_helper";
import { IDBUtil } from "../idb_util";

export class DropDb {

    util: IDBUtil;
    constructor(_, util: IDBUtil) {
        this.util = util;
    }

    execute(db: DbMeta) {
        return promise((res, rej) => {
            const dropDbRequest = indexedDB.deleteDatabase(db.name);
            dropDbRequest.onblocked = () => {
                const err = new LogHelper(ERROR_TYPE.DbBlocked);
                return rej(
                    getError(err)
                );
            };
            dropDbRequest.onerror = (e) => {
                return rej(
                    getError(e)
                )
            };
            dropDbRequest.onsuccess = () => {
                MetaHelper.remove(MetaHelper.dbSchema, this.util);
                res();
            };
        })
    }
}
