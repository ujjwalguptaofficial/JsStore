import { DataBase } from "../model/index";
export declare class BaseHelper {
    regexExpression: RegExp;
    protected get activeDb(): DataBase;
    protected get dbConnection(): IDBDatabase;
    protected get transaction(): IDBTransaction;
    protected createTransaction(tableNames: string[], callBack: () => void, mode?: any): void;
    protected regexTest(value: any): boolean;
    protected isTableExist(tableName: string): boolean;
    protected getTable(tableName: string): import("../model/table").Table;
    protected getKeyRange(value: any, op?: any): IDBKeyRange;
    protected getPrimaryKey(tableName: any): string;
    protected getKeyPath(tableName: any): string;
    protected getAllCombinationOfWord(word: string, isArray?: boolean): any[];
    private getCombination_;
}
