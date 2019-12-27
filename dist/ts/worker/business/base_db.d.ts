import { CONNECTION_STATUS, ERROR_TYPE, IError } from "../../common/index";
export declare class BaseDb {
    onError: (err: IError) => void;
    protected readonly dbName: string;
    protected dbStatus: import("../../common/interfaces").IDbStatus;
    protected dbConnection: any;
    protected updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE): void;
    protected onDbDroppedByBrowser(deleteMetaData?: boolean): void;
    protected readonly dbVersion: number;
    protected readonly activeDb: import("../model/database").DataBase;
    protected getDbList(): Promise<string[]>;
    protected setDbList(value: any): Promise<{}>;
    protected onDbClose(event: any): void;
    protected onDbVersionChange(e: IDBVersionChangeEvent): void;
    protected onDbConError(e: any): void;
}
