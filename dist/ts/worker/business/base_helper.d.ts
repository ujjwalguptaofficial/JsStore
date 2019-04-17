import { OCCURENCE } from "../enums";
import { DataBase } from "../model/index";
export declare class BaseHelper {
    compSymbol: OCCURENCE;
    compValue: any;
    compValueLength: number;
    protected readonly activeDb: DataBase;
    protected readonly dbConnection: IDBDatabase;
    protected getObjectFirstKey(value: object): string;
    protected isNull(value: any): boolean;
    protected getType(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | import("../enums").DATA_TYPE.Array | import("../enums").DATA_TYPE.Null | import("../enums").DATA_TYPE.DateTime;
    protected isObject(value: any): boolean;
    protected isString(value: any): boolean;
    protected isArray(value: any): boolean;
    protected readonly transaction: IDBTransaction;
    protected createTransaction(tableNames: string[], callBack: () => void, mode?: any): void;
    protected filterOnOccurence(value: any): boolean;
    protected isTableExist(tableName: string): boolean;
    protected getTable(tableName: string): import("../model/table").Table;
    protected getKeyRange(value: any, op?: any): IDBKeyRange;
    protected getPrimaryKey(tableName: any): string;
    protected getKeyPath(tableName: any): string;
    protected getAllCombinationOfWord(word: string, isArray?: boolean): any[];
    private getCombination_;
}
