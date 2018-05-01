export declare class IdbHelper {
    static _dbConnection: any;
    static _isDbDeletedByBrowser: boolean;
    static _transaction: IDBTransaction;
    static callDbDroppedByBrowser(): void;
    static createTransaction(tableNames: any, callBack: () => void, mode?: any): void;
}
