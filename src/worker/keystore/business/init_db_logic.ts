import { IError } from "../interfaces";
import { CONNECTION_STATUS } from "../enums";
import { Utils } from "../utils_logic";
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";
import { ERROR_TYPE } from "../../enums";

export let tempDatas;
export class InitDb {
    constructor(dbName: string, onSuccess: () => void, onError: (err: IError) => void) {
        const dbRequest = self.indexedDB.open(dbName, 1);
        IdbHelper.isDbDeletedByBrowser = false;
        dbRequest.onerror = (event) => {
            if ((event as any).target.error.name === 'InvalidStateError') {
               
                onError({
                    message: "Indexeddb is blocked",
                    type: ERROR_TYPE.IndexedDbBlocked
                } as IError);
            }
            else {
                onError((event as any).target.error);
            }
        };

        dbRequest.onsuccess = (event) => {
            IdbHelper.dbStatus.conStatus = CONNECTION_STATUS.Connected;
            IdbHelper.dbConnection = dbRequest.result;
            IdbHelper.dbConnection.onclose = () => {
                IdbHelper.callDbDroppedByBrowser();
                Utils.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
            };

            IdbHelper.dbConnection.onversionchange = (e: any) => {
                if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    IdbHelper.callDbDroppedByBrowser();
                    Utils.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
                }
            };

            IdbHelper.dbConnection.onerror = (e: any) => {
                IdbHelper.dbStatus.lastError = "Error occured in connection :" + e.target.result;
            };

            IdbHelper.dbConnection.onabort = (e) => {
                IdbHelper.dbStatus = {
                    conStatus: CONNECTION_STATUS.Closed,
                    lastError: "Connection aborted"
                };
            };

            if (onSuccess != null) {
                onSuccess();
            }
        };

        dbRequest.onupgradeneeded = (event: any) => {
            const db = event.target.result,
                column = "Key";
            db.createObjectStore(QueryExecutor.tableName, {
                keyPath: column
            }).createIndex(column, column, { unique: true });
        };
    }
}