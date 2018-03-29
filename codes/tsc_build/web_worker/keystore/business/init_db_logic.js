import * as JsStore from '../../index';
import { Connection_Status } from "../enums";
import { Utils } from "../utils_logic";
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";
export var temp_datas;
var InitDb = /** @class */ (function () {
    function InitDb(dbName, onSuccess, onError) {
        var db_request = self.indexedDB.open(dbName, 1);
        IdbHelper._isDbDeletedByBrowser = false;
        db_request.onerror = function (event) {
            if (event.target.error.name === 'InvalidStateError') {
                JsStore.IdbHelper._dbStatus = {
                    ConStatus: JsStore.Connection_Status.UnableToStart,
                    LastError: JsStore.Error_Type.IndexedDbBlocked,
                };
            }
            if (onError != null) {
                onError(event.target.error);
            }
        };
        db_request.onsuccess = function (event) {
            QueryExecutor._dbStatus.ConStatus = Connection_Status.Connected;
            IdbHelper._dbConnection = db_request.result;
            IdbHelper._dbConnection.onclose = function () {
                IdbHelper.callDbDroppedByBrowser();
                Utils.updateDbStatus(Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
            };
            IdbHelper._dbConnection.onversionchange = function (e) {
                if (e.newVersion === null) {
                    e.target.close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser();
                    Utils.updateDbStatus(Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                }
            };
            IdbHelper._dbConnection.onerror = function (e) {
                QueryExecutor._dbStatus.LastError = "Error occured in connection :" + e.target.result;
            };
            IdbHelper._dbConnection.onabort = function (e) {
                QueryExecutor._dbStatus = {
                    ConStatus: Connection_Status.Closed,
                    LastError: "Connection aborted"
                };
            };
            if (onSuccess != null) {
                onSuccess();
            }
        };
        db_request.onupgradeneeded = function (event) {
            var db = event.target.result, column = "Key";
            db.createObjectStore(QueryExecutor._tableName, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
    return InitDb;
}());
export { InitDb };
//# sourceMappingURL=init_db_logic.js.map