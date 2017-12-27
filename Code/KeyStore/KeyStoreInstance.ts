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
                Query: table_name
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
            Query: query,
            OnSuccess: onSuccess,
            OnError: onError
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
            TableName: table_name,
            Set: {
                Key: key,
                Value: value
            }
        } as IInsert;
        prcoessExecutionOfCode({
            Name: 'set',
            Query: query,
            OnSuccess: onSuccess,
            OnError: onError
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
            Query: query,
            OnSuccess: onSuccess,
            OnError: onError
        } as IWebWorkerRequest);
        return this;
    };
}
