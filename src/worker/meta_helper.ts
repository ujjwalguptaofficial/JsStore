import { IDBUtil } from "@/worker/idbutil";
import { promise } from "@/common";

export class MetaHelper {
    static tableName = "JsStore_Meta";
    static autoIncrementKey(tableName: string, columnName: string) {
        return `JsStore_${tableName}_${columnName}_Value`;
    }
    static dbSchema = `JsStore_DbSchema`;

    static getStore(util: IDBUtil) {
        if (!util.tx) {
            util.createTransaction([MetaHelper.tableName]);
        }
        return util.objectStore(MetaHelper.tableName);
    }

    static set(key, value, util: IDBUtil) {
        const store = MetaHelper.getStore(util);
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
        const store = MetaHelper.getStore(util);

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
        const store = MetaHelper.getStore(util);

        return promise((res, rej) => {
            const req = store.delete(
                util.keyRange(key)
            );
            req.onsuccess = () => {
                res();
            };
            req.onerror = rej;
        });
    }

    static has(key, util: IDBUtil) {
        const store = MetaHelper.getStore(util);

        return promise((res, rej) => {
            const req = store.count(
                util.keyRange(key)
            );
            req.onsuccess = () => {
                const result = req.result;
                res(result > 0);
            };
            req.onerror = rej;
        });
    }
}