import { IError } from "../interfaces";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { LogHelper } from "../log_helper";
import { Table } from "../model/table";
import { BaseDb } from "./base_db";

export class OpenDb extends BaseDb {
    private onSuccess_: () => void;
    private onError_: (err: IError) => void;

    constructor(onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.onSuccess_ = onSuccess;
        this.onError_ = onError;
    }


    execute() {
        if (this.dbName.length > 0) {
            const dbRequest = indexedDB.open(this.dbName, this.dbVersion);

            dbRequest.onerror = (event: any) => {
                if (this.onError_ != null) {
                    this.onError_(event.target.error);
                }
            };

            dbRequest.onsuccess = (event) => {
                this.dbStatus.conStatus = CONNECTION_STATUS.Connected;
                this.dbConnection = dbRequest.result;
                (this.dbConnection as any).onclose = (e) => {
                    this.onDbDroppedByBrowser();
                    this.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                };

                this.dbConnection.onversionchange = (e: IDBVersionChangeEvent) => {
                    if (e.newVersion === null) { // An attempt is made to delete the db
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            (e.target as any).close(); // Manually close our connection to the db
                            this.onDbDroppedByBrowser(true);
                            this.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                        }
                    }
                };

                this.dbConnection.onerror = (e) => {
                    this.dbStatus.lastError = ("Error occured in connection :" + (e.target as any).result) as any;
                };

                this.dbConnection.onabort = (e) => {
                    this.dbStatus = {
                        conStatus: CONNECTION_STATUS.Closed,
                        lastError: ERROR_TYPE.ConnectionAborted
                    };
                };
                if (this.onSuccess_ != null) {
                    this.onSuccess_();
                }
                this.setPrimaryKey_();
            };
        }
        else {
            const error = new LogHelper(ERROR_TYPE.UndefinedDbName);
            error.throw();
        }
    }

    private setPrimaryKey_() {
        this.activeDb.tables.forEach((table, index) => {
            table.columns.every(item => {
                this.activeDb.tables[index].primaryKey = item.primaryKey ? item.name : "";
                return !item.primaryKey;
            });
        });
    }
}