import { DATA_TYPE } from "./enums";
export declare class Util {
    static isNull(value: any): boolean;
    static getObjectFirstKey(value: any): string;
    /**
     *  get data type of supplied value
     *
     * @static
     * @param {any} value
     * @returns
     * @memberof Util
     */
    static getType(value: any): "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" | DATA_TYPE.Array | DATA_TYPE.Null | DATA_TYPE.DateTime;
}
