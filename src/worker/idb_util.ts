import { IDB_MODE, QUERY_OPTION, promise } from "@/common";

export class IDBUtil {
    con: IDBDatabase;

    constructor(connection: IDBDatabase) {
        this.con = connection;
    }

    createTransaction(tables: string[], mode = IDB_MODE.ReadWrite) {
        const tx = this.con.transaction(tables, mode);
        return promise((res, rej) => {
            tx.oncomplete = res;
            tx.onabort = res;
            tx.onerror = rej;
        })
    }

    getKeyRange(value, op?) {
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
}