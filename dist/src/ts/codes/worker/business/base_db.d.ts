import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus } from "../interfaces";
import { DataBase } from "../model/database";
export declare class BaseDb {
    protected readonly dbName: string;
    protected dbStatus: IDbStatus;
    protected dbConnection: IDBDatabase;
    protected updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE): void;
    protected onDbDroppedByBrowser(deleteMetaData?: boolean): void;
    protected readonly dbVersion: number;
    protected readonly activeDb: DataBase;
    protected getDbList(callback: (dbList: string[]) => void): void;
    protected setDbList(value: any): Promise<{}>;
}
