import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus, IError } from "../interfaces";
import { DataBase } from "../model/database";
export declare class BaseDb {
    onSuccess: (listOfTablesCreated?: string[]) => void;
    onError: (err: IError) => void;
    protected readonly dbName: string;
    protected dbStatus: IDbStatus;
    protected dbConnection: any;
    protected updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE): void;
    protected onDbDroppedByBrowser(deleteMetaData?: boolean): void;
    protected readonly dbVersion: number;
    protected readonly activeDb: DataBase;
    protected getDbList(): Promise<string[]>;
    protected setDbList(value: any): Promise<{}>;
    protected isNullOrEmpty(value: any): boolean;
    protected onDbClose(event: any): void;
    protected onDbVersionChange(e: IDBVersionChangeEvent): void;
    protected onDbConError(e: any): void;
}
