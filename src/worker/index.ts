import { QueryManager } from "@/worker/query_manager";
import { isWorker } from "./constants";
export * from "./query_manager";

export const initialize = () => {
    const isIdbSupported = setCrossBrowserIndexedDb();
    if (isWorker) {
        const manager = new QueryManager();
        (self as any).onmessage = function (e) {
            manager.run(e.data);
            // new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
        };
    }
    return isIdbSupported;
};

const setCrossBrowserIndexedDb = () => {
    try {
        if (!indexedDB) {
            indexedDB = (self as any).mozIndexedDB ||
                (self as any).webkitIndexedDB || (self as any).msIndexedDB;
        }
        if (indexedDB) {
            IDBTransaction = IDBTransaction ||
                (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
            (self as any).IDBKeyRange = (self as any).IDBKeyRange ||
                (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange;
        }
        else {
            return false;
        }
    } catch (ex) {
        return false;
    }
    return true;
};

if (isWorker) {
    initialize();
}
