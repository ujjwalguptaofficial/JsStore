import * as JsStore from '../JsStore/jsstore';
namespace KeyStore {
    export interface IError {
        Name: string;
        Value: string;
    }
    export class Utils {
        /**
         * determine and set the DataBase Type
         * 
         * 
         * @memberOf UtilityLogic
         */
        static setDbType() {
            (self as any).indexedDB = self.indexedDB || (self as any).mozIndexedDB ||
                (self as any).webkitIndexedDB || (self as any).msIndexedDB;
            if (indexedDB) {
                (self as any).IDBTransaction = (self as any).IDBTransaction ||
                    (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
                (self as any).IDBKeyRange = (self as any).IDBKeyRange ||
                    (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange;
            }
            else if (!self.alert) {
                console.log('worked failed');
                (self as any).postMessage('message:WorkerFailed');
            }
            else {
                JsStore.db_status = {
                    ConStatus: JsStore.Connection_Status.UnableToStart,
                    LastError: JsStore.Error_Type.IndexedDbUndefined
                };
            }
        }

        static updateDbStatus(status: Connection_Status, err?: JsStore.Error_Type) {
            if (err === undefined) {
                db_status.ConStatus = status;
            }
            else {
                db_status = {
                    ConStatus: status,
                    LastError: err
                };
            }
        }
    }
}
