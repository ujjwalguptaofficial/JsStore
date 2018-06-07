import * as JsStore from '../export';
import { CONNECTION_STATUS } from './enums';
import { QueryExecutor } from './query_executor';

export class Utils {
    /**
     * determine and set the DataBase Type
     * 
     * 
     * @memberOf UtilityLogic
     */
    static setDbType() {
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
            JsStore.IdbHelper.dbStatus = {
                conStatus: JsStore.CONNECTION_STATUS.UnableToStart,
                lastError: JsStore.ERROR_TYPE.IndexedDbUndefined
            };
        }
    }

    static updateDbStatus(status: CONNECTION_STATUS, err?: JsStore.ERROR_TYPE) {
        if (err === undefined) {
            QueryExecutor.dbStatus.conStatus = status;
        }
        else {
            QueryExecutor.dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    }
}
