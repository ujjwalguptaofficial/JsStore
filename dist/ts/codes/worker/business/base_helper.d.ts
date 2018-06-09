import { OCCURENCE, DATA_TYPE } from "../enums";
import { Table } from "../model/table";
import { DataBase } from "../model/database";
export declare class BaseHelper {
    compSymbol: OCCURENCE;
    compValue: any;
    compValueLength: number;
    protected readonly activeDb: DataBase;
    protected readonly dbConnection: IDBDatabase;
    protected getObjectFirstKey(value: object): string;
    protected isNull(value: any): boolean;
    protected getType(value: any): "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" | DATA_TYPE.Array | DATA_TYPE.Null | DATA_TYPE.DateTime;
    protected isObject(value: any): boolean;
    protected isString(value: any): boolean;
    protected readonly transaction: IDBTransaction;
    protected createTransaction(tableNames: string[], callBack: () => void, mode?: any): void;
    protected filterOnOccurence(value: any): boolean;
    protected isTableExist(tableName: string): boolean;
    protected getTable(tableName: string): Table;
    protected getKeyRange(value: any, op: any): IDBKeyRange;
    protected getPrimaryKey(tableName: any): string;
    protected getKeyPath(tableName: any): string;
    protected getAllCombinationOfWord(word: string, isArray?: boolean): any[];
    private getCombination_(word);
}
