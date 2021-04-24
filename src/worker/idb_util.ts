import { IDB_MODE, QUERY_OPTION, promise } from "@/common";
import { MetaHelper } from "./meta_helper";

export class IDBUtil {
    con: IDBDatabase;
    transaction: IDBTransaction;

    constructor(connection: IDBDatabase) {
        this.con = connection;
    }

    createTransaction(tables: string[], mode = IDB_MODE.ReadWrite) {
        tables.push(MetaHelper.tableName);
        const tx = this.con.transaction(tables, mode);
        this.transaction = tx;
        return promise((res, rej) => {
            tx.oncomplete = res;
            tx.onabort = res;
            tx.onerror = rej;
        });
    }

    keyRange(value, op?) {
        let keyRange: IDBKeyRange;
        switch (op) {
            case QUERY_OPTION.Between: keyRange = IDBKeyRange.bound(value.low, value.high, false, false); break;
            case QUERY_OPTION.GreaterThan: keyRange = IDBKeyRange.lowerBound(value, true); break;
            case QUERY_OPTION.GreaterThanEqualTo: keyRange = IDBKeyRange.lowerBound(value); break;
            case QUERY_OPTION.LessThan: keyRange = IDBKeyRange.upperBound(value, true); break;
            case QUERY_OPTION.LessThanEqualTo: keyRange = IDBKeyRange.upperBound(value); break;
            default: keyRange = IDBKeyRange.only(value); break;
        }
        return keyRange;
    }

    objectStore(name: string) {
        return this.transaction.objectStore(name);
    }

    abortTransaction() {
        this.transaction.abort();
    }

    close() {
        this.con.close();
    }
}