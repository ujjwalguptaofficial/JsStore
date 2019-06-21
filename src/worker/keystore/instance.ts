import { Utils } from "./utils_logic";
import { QueryExecutor } from './query_executor';
import { IQueryRequest, IError, IInsert } from "./interfaces";

export class KeyStore {
    /**
     * Initialize KeyStore
     * 
     */
    static init = () => {
        Utils.setCrossBrowserIndexedDb();
        if (indexedDB) {
            return QueryExecutor.prcoessQuery({
                name: 'init_db',
                query: null
            } as IQueryRequest);
        }
    };

    static close = () => {
        return QueryExecutor.prcoessQuery({
            name: 'close_db',
            query: null
        } as IQueryRequest);
    };

    /**
     * return the value by key
     * 
     * @param {string} key 
     * @param {(result) => void} onSuccess 
     * @param {(err: IError) => void} [onError=null] 
     * @returns 
     */
    static get = <T>(key: string) => {
        return QueryExecutor.prcoessQuery<T>({
            name: 'get',
            query: key
        });
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
    static set = (key, value) => {
        const query = {
            Key: key,
            Value: value
        } as IInsert;
        return QueryExecutor.prcoessQuery({
            name: 'set',
            query: query
        } as IQueryRequest);
    };

    /**
     * delete value
     * 
     * @param {string} key 
     * @param {(result) => void} [onSuccess=null] 
     * @param {(err: IError) => void} [onError=null] 
     * @returns 
     */
    static remove = (key: string) => {
        return QueryExecutor.prcoessQuery({
            name: 'remove',
            query: key
        } as IQueryRequest);
    };
}


