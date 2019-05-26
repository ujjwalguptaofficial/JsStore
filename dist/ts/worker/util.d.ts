import { DATA_TYPE } from "./enums";
import { Table } from "./model/index";
export declare class Util {
    static isNull(value: any): boolean;
    static isNullOrEmpty(value: any): boolean;
    static isString(value: any): boolean;
    static isArray(value: any): boolean;
    static isObject(value: any): boolean;
    static getObjectFirstKey(value: any): string;
    /**
     *  get data type of supplied value
     *
     * @static
     * @param {any} value
     * @returns
     * @memberof Util
     */
    static getType(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | DATA_TYPE.Array | DATA_TYPE.Null | DATA_TYPE.DateTime;
    static getAutoIncrementValues(table: Table): Promise<{
        [columnName: string]: number;
    }>;
    static setAutoIncrementValue(table: Table, autoIncrementValue: object): Promise<{}[]>;
    static removeSpace(value: string): string;
}
