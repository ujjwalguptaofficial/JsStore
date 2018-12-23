import { Utils } from "./utils_logic";
import { QueryExecutor } from './query_executor';
import { IQueryRequest, IError, IInsert } from "./interfaces";

/**
 * Initialize KeyStore
 * 
 */
export const init = () => {
    Utils.setDbType();
    if (indexedDB) {
        QueryExecutor.prcoessQuery({
            Name: 'create_db',
            Query: null
        } as IQueryRequest);
    }
};

/**
 * return the value by key
 * 
 * @param {string} key 
 * @param {(result) => void} onSuccess 
 * @param {(err: IError) => void} [onError=null] 
 * @returns 
 */
export const get = (key: string, onSuccess: (result) => void, onError: (err: IError) => void = null) => {
    QueryExecutor.prcoessQuery({
        Name: 'get',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    });
    return this;
};

/**
 * insert or update value
 * 
 * @param {any} key 
 * @param {any} value 
 * @param {(result) => void} [onSuccess] 
 * @param {(err: IError) => void} [onError] 
 * @returns 
 */
export const set = (key, value, onSuccess?: (result) => void, onError?: (err: IError) => void) => {
    const query = {
        Key: key,
        Value: value
    } as IInsert;
    QueryExecutor.prcoessQuery({
        Name: 'set',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: query
    } as IQueryRequest);
    return this;
};

/**
 * delete value
 * 
 * @param {string} key 
 * @param {(result) => void} [onSuccess=null] 
 * @param {(err: IError) => void} [onError=null] 
 * @returns 
 */
export const remove = (key: string, onSuccess: (result) => void = null, onError: (err: IError) => void = null) => {
    QueryExecutor.prcoessQuery({
        Name: 'remove',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    } as IQueryRequest);
    return this;
};
