import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus, IDataBase } from "../interfaces";
import { DataBase } from "../model/database";
export declare class IdbHelper {
    static onDbDroppedByBrowser: () => void;
    static transaction: IDBTransaction;
    static isDbDeletedByBrowser: boolean;
    static dbConnection: IDBDatabase;
    static activeDb: DataBase;
    static activeDbVersion: number;
    static dbStatus: IDbStatus;
    static callDbDroppedByBrowser(deleteMetaData?: boolean): void;
    static createTransaction(tableNames: string[], callBack: () => void, mode?: any): void;
    static setDbList(list: string[]): Promise<{}>;
    static updateDbStatus(status: CONNECTION_STATUS, err?: ERROR_TYPE): void;
    static getDbList(callback: (dbList: string[]) => void): void;
    static getDbVersion(dbName: string, callback: (version: number) => void): void;
    static getDbSchema(dbName: string, callback: (schema: IDataBase) => void): void;
}
