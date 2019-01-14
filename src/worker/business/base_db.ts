import { IdbHelper } from "./idb_helper";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus } from "../interfaces";
import { DataBase } from "../model/database";
import { Util } from "../util";
export class BaseDb {
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

    protected getDbList(callback: (dbList: string[]) => void) {
        IdbHelper.getDbList(callback);
    }

    protected setDbList(value) {
        return IdbHelper.setDbList(value);
    }

    protected isNullOrEmpty(value) {
        return Util.isNullOrEmpty(value);
    }
}