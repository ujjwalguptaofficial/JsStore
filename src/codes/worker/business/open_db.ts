import { IdbHelper } from "./idb_helper";
import { IError } from "../interfaces";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { LogHelper } from "../log_helper";
import { Table } from "../model/table";

export class OpenDb {
    private dbName_: string;
    private onSuccess_: () => void;
    private onError_: (err: IError) => void;

    constructor(onSuccess: () => void, onError: (err: IError) => void) {
        this.dbName_ = IdbHelper.activeDb.name;
        this.onSuccess_ = onSuccess;
        this.onError_ = onError;
    }

    private get dbStatus_() {
        return IdbHelper.dbStatus;
    }

    private set dbConnection_(value) {
        IdbHelper.dbConnection = value;
    }

    private get dbConnection_() {
        return IdbHelper.dbConnection;
    }

    private updateDbStatus_(status: CONNECTION_STATUS, err?: ERROR_TYPE) {
        IdbHelper.updateDbStatus(status, err);
    }

    private onDbDroppedByBrowser_(deleteMetaData?: boolean) {
        IdbHelper.callDbDroppedByBrowser(deleteMetaData);
    }

    execute() {
        if (this.dbName_.length > 0) {
            const dbRequest = indexedDB.open(this.dbName_, IdbHelper.activeDbVersion);

            dbRequest.onerror = (event: any) => {
                if (this.onError_ != null) {
                    this.onError_(event.target.error);
                }
            };

            dbRequest.onsuccess = (event) => {
                this.dbStatus_.conStatus = CONNECTION_STATUS.Connected;
                this.dbConnection_ = dbRequest.result;
                (this.dbConnection_ as any).onclose = (e) => {
                    this.onDbDroppedByBrowser_();
                    this.updateDbStatus_(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                };

                this.dbConnection_.onversionchange = (e: IDBVersionChangeEvent) => {
                    if (e.newVersion === null) { // An attempt is made to delete the db
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            (e.target as any).close(); // Manually close our connection to the db
                            this.onDbDroppedByBrowser_(true);
                            this.updateDbStatus_(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                        }
                    }
                };

                IdbHelper.dbConnection.onerror = (e) => {
                    IdbHelper.dbStatus.lastError = ("Error occured in connection :" + (e.target as any).result) as any;
                };

                IdbHelper.dbConnection.onabort = (e) => {
                    IdbHelper.dbStatus = {
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

    private get activeDb_() {
        return IdbHelper.activeDb;
    }

    private setPrimaryKey_() {
        this.activeDb_.tables.forEach((table, index) => {
            table.columns.every(item => {
                IdbHelper.activeDb.tables[index].primaryKey = item.primaryKey ? item.name : "";
                return !item.primaryKey;
            });
        });
    }
}