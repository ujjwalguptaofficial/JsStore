import { QueryExecutor } from "./query_executor";
import { Config } from "./config";
import { IdbHelper } from "./business/index";
import { CONNECTION_STATUS, ERROR_TYPE } from "./enums";
export const initialize = function () {
    if (typeof (self as any).alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined') {
        Config.isRuningInWorker = true;
        (self as any).onmessage = function (e) {
            new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
        };
    }
};

const onIdbNotSupproted = () => {
    IdbHelper.dbStatus = {
        conStatus: CONNECTION_STATUS.UnableToStart,
        lastError: ERROR_TYPE.IndexedDbNotSupported
    };
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
            onIdbNotSupproted();
        }
    } catch (ex) {
        onIdbNotSupproted();
    }
};

setCrossBrowserIndexedDb();
initialize();
