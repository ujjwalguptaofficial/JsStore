import { Utils } from "./utils_logic";
import { prcoessExecutionOfCode } from "./helpers";
import { IWebWorkerRequest, IError, ISelect, IInsert, IDelete } from "./interfaces";
import { table_name } from "./common_logic";

namespace KeyStore {

    /**
     * Initialize KeyStore
     * 
     */
    export var init = function () {
        Utils.setDbType();
        if (indexedDB) {
            prcoessExecutionOfCode({
                Name: 'create_db',
                Query: null
            } as IWebWorkerRequest);
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
    export var get = function (key: string, onSuccess: (result) => void, onError: (err: IError) => void = null) {
        var query = {
            From: table_name,
            Where: {
                Key: key
            }
        } as ISelect;
        prcoessExecutionOfCode({
            Name: 'get',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        } as IWebWorkerRequest);
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
    export var set = function (key, value, onSuccess?: (result) => void, onError?: (err: IError) => void) {
        var query = {
            Set: {
                Key: key,
                Value: value
            },
            TableName: table_name,
        } as IInsert;
        prcoessExecutionOfCode({
            Name: 'set',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        } as IWebWorkerRequest);
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
    export var remove = function (
        key: string, onSuccess: (result) => void = null, onError: (err: IError) => void = null
    ) {
        var query = {
            From: table_name,
            Where: {
                Key: key
            }
        } as IDelete;
        prcoessExecutionOfCode({
            Name: 'remove',
            OnError: onError,
            OnSuccess: onSuccess,
            Query: query
        } as IWebWorkerRequest);
        return this;
    };
}
