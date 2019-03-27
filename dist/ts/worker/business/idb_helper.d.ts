import { CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { IDbStatus } from "../interfaces";
import { DataBase } from "../model/database";
import { Table } from "../model/table";
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
    static getDbList(): Promise<string[]>;
    static getDbVersion(dbName: string): Promise<number>;
    static getDbSchema(dbName: string): Promise<DataBase>;
    static getTable(tableName: string): Table;
}
