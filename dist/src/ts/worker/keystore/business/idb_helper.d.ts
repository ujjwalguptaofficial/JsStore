import { IDbStatus } from '../interfaces';
export declare class IdbHelper {
    static dbConnection: IDBDatabase;
    static isDbDeletedByBrowser: boolean;
    static transaction: IDBTransaction;
    static dbStatus: IDbStatus;
    static callDbDroppedByBrowser(): void;
    static createTransaction(tableNames: any, callBack: () => void, mode?: any): void;
}
