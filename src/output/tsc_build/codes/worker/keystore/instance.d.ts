import { IError } from "./interfaces";
/**
 * Initialize KeyStore
 *
 */
export declare const init: () => void;
/**
 * return the value by key
 *
 * @param {string} key
 * @param {(result) => void} onSuccess
 * @param {(err: IError) => void} [onError=null]
 * @returns
 */
export declare const get: (key: string, onSuccess: (result: any) => void, onError?: (err: IError) => void) => any;
/**
 * insert or update value
 *
 * @param {any} key
 * @param {any} value
 * @param {(result) => void} [onSuccess]
 * @param {(err: IError) => void} [onError]
 * @returns
 */
export declare const set: (key: any, value: any, onSuccess?: (result: any) => void, onError?: (err: IError) => void) => any;
/**
 * delete value
 *
 * @param {string} key
 * @param {(result) => void} [onSuccess=null]
 * @param {(err: IError) => void} [onError=null]
 * @returns
 */
export declare const remove: (key: string, onSuccess?: (result: any) => void, onError?: (err: IError) => void) => any;
