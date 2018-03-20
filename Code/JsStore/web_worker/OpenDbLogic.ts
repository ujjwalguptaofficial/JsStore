import { active_db, db_connection, callDbDroppedByBrowser } from "./MainLogic";
import { Table } from "../Model/Table";
import { Error_Type, IError, ErrorHelper } from "../error_helper";
import { db_status } from "../CommonLogic";
import { Connection_Status } from "../enums";
import { Utils } from "../UtilsLogic";

export class OpenDb {
    constructor(dbVersion, onSuccess: () => void, onError: (err: IError) => void) {
        if (active_db._name.length > 0) {
            var db_request = indexedDB.open(active_db._name, dbVersion);

            db_request.onerror = function (event) {
                if (onError != null) {
                    onError((event as any).target.error);
                }
            };

            db_request.onsuccess = function (event) {
                db_status.ConStatus = Connection_Status.Connected;
                db_connection = db_request.result;
                (db_connection as any).onclose = function (e) {
                    callDbDroppedByBrowser();
                    Utils.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                };

                db_connection.onversionchange = function (e) {
                    if (e.newVersion === null) { // An attempt is made to delete the db
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            (e.target as any).close(); // Manually close our connection to the db
                            callDbDroppedByBrowser(true);
                            Utils.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                        }
                    }
                };

                db_connection.onerror = function (e) {
                    db_status.LastError = ("ErrorHelper occured in connection :" + (e.target as any).result) as any;
                };

                db_connection.onabort = function (e) {
                    db_status.ConStatus = Connection_Status.Closed;
                    db_status.LastError = Error_Type.ConnectionAborted;
                };
                if (onSuccess != null) {
                    onSuccess();
                }
                this.setPrimaryKey();
            }.bind(this);
        }
        else {
            var error = new ErrorHelper(Error_Type.UndefinedDbName);
            error.throw();
        }
    }

    private setPrimaryKey = function () {
        active_db._tables.forEach(function (table: Table, index) {
            table._columns.every(function (item) {
                active_db._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                return !item._primaryKey;
            });
        });
    };
}