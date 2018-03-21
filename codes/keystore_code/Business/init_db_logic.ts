import { is_db_deleted_by_browser, db_connection, callDbDroppedByBrowser } from "./main_logic";
import { IError } from "../interfaces";
import * as JsStore from '../../JsStore/jsstore';
import { db_status, table_name } from "../common_logic";
import { Connection_Status } from "../enums";
import { Utils } from "../utils_logic";

export var temp_datas;
export class InitDb {
    constructor(dbName: string, onSuccess: () => void, onError: (err: IError) => void) {
        var db_request = self.indexedDB.open(dbName, 1);
        is_db_deleted_by_browser = false;
        db_request.onerror = function (event) {
            if ((event as any).target.error.name === 'InvalidStateError') {
                JsStore.db_status = {
                    ConStatus: JsStore.Connection_Status.UnableToStart,
                    LastError: JsStore.Error_Type.IndexedDbBlocked,
                };
            }
            if (onError != null) {
                onError((event as any).target.error);
            }
        };

        db_request.onsuccess = function (event) {
            db_status.ConStatus = Connection_Status.Connected;
            db_connection = db_request.result;
            db_connection.onclose = function () {
                callDbDroppedByBrowser();
                Utils.updateDbStatus(Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
            };

            db_connection.onversionchange = function (e) {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    callDbDroppedByBrowser();
                    Utils.updateDbStatus(Connection_Status.Closed, JsStore.Error_Type.ConnectionClosed);
                }
            };

            db_connection.onerror = function (e) {
                db_status.LastError = "Error occured in connection :" + e.target.result;
            };

            db_connection.onabort = function (e) {
                db_status.ConStatus = Connection_Status.Closed;
                db_status.LastError = "Connection aborted";
            };

            if (onSuccess != null) {
                onSuccess();
            }
        };

        db_request.onupgradeneeded = function (event: any) {
            var db = event.target.result,
                column = "Key";
            db.createObjectStore(table_name, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
}