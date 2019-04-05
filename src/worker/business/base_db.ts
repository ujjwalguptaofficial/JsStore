import { IdbHelper } from "./idb_helper";
import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus, IError } from "../interfaces";
import { DataBase } from "../model/database";
import { Util } from "../util";
export class BaseDb {
    onSuccess: (isDbCreated: boolean) => void;
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
}