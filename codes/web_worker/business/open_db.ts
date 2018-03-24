import { IdbHelper } from "./idb_helper";
import { IError } from "../interfaces";
import { Connection_Status, Error_Type } from "../enums";
import { LogHelper } from "../log_helper";
import { Table } from "../model/table";

export class OpenDb {
    _dbName: string;
    _onSuccess: () => void;
    _onError: (err: IError) => void;

    constructor(dbVersion, onSuccess: () => void, onError: (err: IError) => void) {
        this._dbName = IdbHelper._activeDb._name;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    execute() {
        if (this._dbName.length > 0) {
            var db_request = indexedDB.open(this._dbName, IdbHelper._dbVersion);

            db_request.onerror = (event) => {
                if (this._onError != null) {
                    this._onError((event as any).target.error);
                }
            };

            db_request.onsuccess = (event) => {
                IdbHelper._dbStatus.ConStatus = Connection_Status.Connected;
                IdbHelper._dbConnection = db_request.result;
                (IdbHelper._dbConnection as any).onclose = (e) => {
                    IdbHelper.callDbDroppedByBrowser();
                    IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                };

                IdbHelper._dbConnection.onversionchange = (e) => {
                    if (e.newVersion === null) { // An attempt is made to delete the db
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            (e.target as any).close(); // Manually close our connection to the db
                            IdbHelper.callDbDroppedByBrowser(true);
                            IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                        }
                    }
                };

                IdbHelper._dbConnection.onerror = (e) => {
                    IdbHelper._dbStatus.LastError = ("Error occured in connection :" + (e.target as any).result) as any;
                };

                IdbHelper._dbConnection.onabort = (e) => {
                    IdbHelper._dbStatus.ConStatus = Connection_Status.Closed;
                    IdbHelper._dbStatus.LastError = Error_Type.ConnectionAborted;
                };
                if (this._onSuccess != null) {
                    this._onSuccess();
                }
                this.setPrimaryKey();
            };
        }
        else {
            var error = new LogHelper(Error_Type.UndefinedDbName);
            error.throw();
        }
    }

    private setPrimaryKey() {
        IdbHelper._activeDb._tables.forEach((table: Table, index) => {
            table._columns.every(item => {
                IdbHelper._activeDb._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                return !item._primaryKey;
            });
        });
    }
}