import { IError } from "../interfaces";
import * as JsStore from '../../index';
import { CONNECTION_STATUS } from "../enums";
import { Utils } from "../utils_logic";
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";

export var temp_datas;
export class InitDb {
    constructor(dbName: string, onSuccess: () => void, onError: (err: IError) => void) {
        var db_request = self.indexedDB.open(dbName, 1);
        IdbHelper._isDbDeletedByBrowser = false;
        db_request.onerror = (event) => {
            if ((event as any).target.error.name === 'InvalidStateError') {
                JsStore.IdbHelper.dbStatus = {
                    conStatus: JsStore.CONNECTION_STATUS.UnableToStart,
                    lastError: JsStore.ERROR_TYPE.IndexedDbBlocked,
                };
            }
            if (onError != null) {
                onError((event as any).target.error);
            }
        };

        db_request.onsuccess = (event) => {
            QueryExecutor.dbStatus.conStatus = CONNECTION_STATUS.Connected;
            IdbHelper._dbConnection = db_request.result;
            IdbHelper._dbConnection.onclose = () => {
                IdbHelper.callDbDroppedByBrowser();
                Utils.updateDbStatus(CONNECTION_STATUS.Closed, JsStore.ERROR_TYPE.ConnectionClosed);
            };

            IdbHelper._dbConnection.onversionchange = (e) => {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser();
                    Utils.updateDbStatus(CONNECTION_STATUS.Closed, JsStore.ERROR_TYPE.ConnectionClosed);
                }
            };

            IdbHelper._dbConnection.onerror = (e) => {
                QueryExecutor.dbStatus.lastError = "Error occured in connection :" + e.target.result;
            };

            IdbHelper._dbConnection.onabort = (e) => {
                QueryExecutor.dbStatus = {
                    conStatus: CONNECTION_STATUS.Closed,
                    lastError: "Connection aborted"
                };
            };

            if (onSuccess != null) {
                onSuccess();
            }
        };

        db_request.onupgradeneeded = (event: any) => {
            var db = event.target.result,
                column = "Key";
            db.createObjectStore(QueryExecutor.tableName, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
}