import { CONNECTION_STATUS, ERROR_TYPE, IError } from "../../common/index";
export declare class BaseDb {
    onError: (err: IError) => void;
    protected get dbName(): string;
    protected get dbStatus(): import("../../common").IDbStatus;
    protected set dbStatus(value: import("../../common").IDbStatus);
    protected set dbConnection(value: IDBDatabase);
    protected get dbConnection(): IDBDatabase;
    protected updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE): void;
    protected onDbDroppedByBrowser(deleteMetaData?: boolean): void;
    protected get dbVersion(): number;
    protected get activeDb(): import("../model").DataBase;
    protected getDbList(): Promise<string[]>;
    protected setDbList(value: any): Promise<unknown>;
    protected onDbClose(event: any): void;
    protected onDbVersionChange(e: IDBVersionChangeEvent): void;
    protected onDbConError(e: any): void;
}
