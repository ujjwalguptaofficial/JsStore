import { IDBUtil } from "@/worker/idbutil";
import { promise } from "@/common";

export class MetaHelper {
    static tableName = "JsStore_Meta";
    static autoIncrementKey(tableName: string, columnName: string) {
        return `JsStore_${tableName}_${columnName}_Value`;
    }
    static dbSchema = `JsStore_DbSchema`;

    static set(key, value, util: IDBUtil) {
        if (!util.tx) {
            util.createTransaction([MetaHelper.tableName]);
        }
        const store = util.objectStore(MetaHelper.tableName);

        return promise((res, rej) => {
            const req = store.put({
                key, value
            });
            req.onsuccess = () => {
                res();
            };
            req.onerror = rej;
        });
    }

    static get(key, util: IDBUtil) {
        if (!util.tx) {
            util.createTransaction([MetaHelper.tableName]);
        }
        const store = util.objectStore(MetaHelper.tableName);

        return promise((res, rej) => {
            const req = store.get(
                util.keyRange(key)
            );
            req.onsuccess = () => {
                const result = req.result;
                res(result && result.value);
            };
            req.onerror = rej;
        });
    }

    static remove(key, util: IDBUtil) {
        if (!util.tx) {
            util.createTransaction([MetaHelper.tableName]);
        }
        const store = util.objectStore(MetaHelper.tableName);

        return promise((res, rej) => {
            const req = store.delete(
                util.keyRange(key)
            );
            req.onsuccess = res;
            req.onerror = rej;
        });
    }
}