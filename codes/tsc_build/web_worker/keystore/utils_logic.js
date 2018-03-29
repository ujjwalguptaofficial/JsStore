import * as JsStore from '../index';
import { QueryExecutor } from './query_executor';
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * determine and set the DataBase Type
     *
     *
     * @memberOf UtilityLogic
     */
    Utils.setDbType = function () {
        if (!indexedDB) {
            indexedDB = self.mozIndexedDB ||
                self.webkitIndexedDB || self.msIndexedDB;
        }
        if (indexedDB) {
            IDBTransaction = IDBTransaction ||
                self.webkitIDBTransaction || self.msIDBTransaction;
            self.IDBKeyRange = self.IDBKeyRange ||
                self.webkitIDBKeyRange || self.msIDBKeyRange;
        }
        else {
            JsStore.IdbHelper._dbStatus = {
                ConStatus: JsStore.Connection_Status.UnableToStart,
                LastError: JsStore.Error_Type.IndexedDbUndefined
            };
        }
    };
    Utils.updateDbStatus = function (status, err) {
        if (err === undefined) {
            QueryExecutor._dbStatus.ConStatus = status;
        }
        else {
            QueryExecutor._dbStatus = {
                ConStatus: status,
                LastError: err
            };
        }
    };
    return Utils;
}());
export { Utils };
//# sourceMappingURL=utils_logic.js.map