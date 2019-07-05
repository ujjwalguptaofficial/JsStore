import { Table } from "./model/index";
export declare class Util {
    static isNullOrEmpty(value: any): boolean;
    static isString(value: any): boolean;
    static isArray(value: any): boolean;
    static getObjectFirstKey(value: any): string;
    static getAutoIncrementValues(table: Table): Promise<{
        [columnName: string]: number;
    }>;
    static setAutoIncrementValue(table: Table, autoIncrementValue: object): Promise<{}[]>;
    static removeSpace(value: string): string;
}
