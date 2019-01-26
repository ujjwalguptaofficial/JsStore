import { CONNECTION_STATUS } from '../enums';
import { IDbStatus } from '../interfaces';

export class IdbHelper {
    static dbConnection: IDBDatabase;
    static isDbDeletedByBrowser: boolean;
    static transaction: IDBTransaction = null;

    static dbStatus: IDbStatus = {
        conStatus: CONNECTION_STATUS.NotStarted,
    };

    static callDbDroppedByBrowser() {
        IdbHelper.isDbDeletedByBrowser = IdbHelper.dbStatus.conStatus === CONNECTION_STATUS.Connected ? true : false;
    }

    static createTransaction(tableNames, callBack: () => void, mode?) {
        if (IdbHelper.transaction === null) {
            mode = mode ? mode : "readwrite";
            IdbHelper.transaction = IdbHelper.dbConnection.transaction(tableNames, mode);
            IdbHelper.transaction.oncomplete = () => {
                IdbHelper.transaction = null;
                callBack();
            };
            (IdbHelper.transaction as any).ontimeout = function () {
                this._transaction = null;
                console.error('transaction timed out');
            };
        }
    }
}