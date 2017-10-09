module KeyStore {
    /**
     * Initialize KeyStore
     * 
     */
    export var init = function () {
        Utils.setDbType();
        if (indexedDB) {
            prcoessExecutionOfCode(<IWebWorkerRequest>{
                Name: 'create_db',
                Query: TableName
            });
        }
    };

    /**
    * return the value by key
    * 
    * @param {string} key 
    * @param {Function} onSuccess 
    * @param {Function} [onError=null] 
    */
    export var get = function (key: string, onSuccess: Function, onError: Function = null) {
        var Query = <ISelect>{
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        prcoessExecutionOfCode(<IWebWorkerRequest>{
            Name: 'get',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };

    /**
    * insert or update value
    * 
    * @param {any} key 
    * @param {any} value 
    * @param {Function} [onSuccess=null] 
    * @param {Function} [onError=null] 
    */
    export var set = function (key, value, onSuccess: Function = null, onError: Function = null) {
        var Query = <IInsert>{
            TableName: this.TableName,
            Set: {
                Key: key,
                Value: value
            }
        }
        prcoessExecutionOfCode(<IWebWorkerRequest>{
            Name: 'set',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };

    /**
    * delete value
    * 
    * @param {string} key 
    * @param {Function} [onSuccess=null] 
    * @param {Function} [onError=null] 
    */
    export var remove = function (key: string, onSuccess: Function = null, onError: Function = null) {
        var Query = <IDelete>{
            From: this.TableName,
            Where: {
                Key: key
            }
        }
        prcoessExecutionOfCode(<IWebWorkerRequest>{
            Name: 'remove',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    }
}
