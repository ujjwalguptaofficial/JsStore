import * as JsStore from '../index';
import { Connection_Status } from './enums';
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
            JsStore.IdbHelper._dbStatus = {
                ConStatus: JsStore.Connection_Status.UnableToStart,
                LastError: JsStore.Error_Type.IndexedDbUndefined
            };
        }
    }

    static updateDbStatus(status: Connection_Status, err?: JsStore.Error_Type) {
        if (err === undefined) {
            QueryExecutor._dbStatus.ConStatus = status;
        }
        else {
            QueryExecutor._dbStatus = {
                ConStatus: status,
                LastError: err
            };
        }
    }
}
