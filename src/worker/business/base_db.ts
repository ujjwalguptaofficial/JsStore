import { IdbHelper } from "./idb_helper";
import { CONNECTION_STATUS, ERROR_TYPE, IError } from "../../common/index";
export class BaseDb {

    onError: (err: IError) => void;
    protected get dbName() {
        return IdbHelper.activeDb.name;
    }

    protected get dbStatus() {
        return IdbHelper.dbStatus;
    }

    protected set dbStatus(value) {
        IdbHelper.dbStatus = value;
    }


    protected set dbConnection(value) {
        IdbHelper.dbConnection = value;
    }

    protected get dbConnection() {
        return IdbHelper.dbConnection;
    }

    protected updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE) {
        IdbHelper.updateDbStatus(status, err);
    }

    protected onDbDroppedByBrowser(deleteMetaData?: boolean) {
        IdbHelper.callDbDroppedByBrowser(deleteMetaData);
    }

    protected get dbVersion() {
        return parseInt(IdbHelper.activeDbVersion as any);
    }

    protected get activeDb() {
        return IdbHelper.activeDb;
    }

    protected getDbList() {
        return IdbHelper.getDbList();
    }

    protected setDbList(value) {
        return IdbHelper.setDbList(value);
    }


    protected onDbClose(event) {
        this.onDbDroppedByBrowser();
        this.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
    }

    protected onDbVersionChange(e: IDBVersionChangeEvent) {
        if (e.newVersion === null) { // An attempt is made to delete the db
            (e.target as any).close(); // Manually close our connection to the db
            this.onDbDroppedByBrowser(true);
            this.updateDbStatus(CONNECTION_STATUS.Closed, ERROR_TYPE.ConnectionClosed);
        }
    }

    protected onDbConError(e) {
        IdbHelper.dbStatus.lastError = ("Error occured in connection :" + (e.target as any).result) as any;
    }
}