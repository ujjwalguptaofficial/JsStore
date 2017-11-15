module JsStore {

    /**
    * checks whether db exist or not
    * 
    * @param {DbInfo} dbInfo 
    * @param {Function} callback 
    * @param {Function} errCallBack 
    */
    export var isDbExist = function (dbInfo: DbInfo, callback: Function, errCallBack: Function = null) {
        var UsePromise = callback ? false : true;
        if (Status.ConStatus != ConnectionStatus.UnableToStart) {
            var DbName;
            if (UsePromise) {
                return new Promise(function (resolve, reject) {
                    if (typeof dbInfo == 'string') {
                        getDbVersion(dbInfo, function (dbVersion) {
                            resolve(Boolean(dbVersion));
                        });
                    }
                    else {
                        getDbVersion(dbInfo.DbName, function (dbVersion) {
                            resolve(dbInfo.Table.Version <= dbVersion)
                        });
                    }
                })
            }
            else {
                if (typeof dbInfo == 'string') {
                    getDbVersion(dbInfo, function (dbVersion) {
                        callback(Boolean(dbVersion));
                    });
                }
                else {
                    getDbVersion(dbInfo.DbName, function (dbVersion) {
                        callback(dbInfo.Table.Version <= dbVersion)
                    });
                }
            }
        }
        else {
            var Error = <IError>{
                Name: Status.LastError,
                Message: ''
            };
            switch (Error.Name) {
                case ErrorType.IndexedDbBlocked:
                    Error.Message = "IndexedDB is blocked"; break;
                case ErrorType.IndexedDbUndefined:
                    Error.Message = "IndexedDB is not supported"; break;
            }
            if (UsePromise) {
                return new Promise(function (resolve, reject) {
                    reject(Error);
                });
            }
            else if (errCallBack) {
                errCallBack(Error);
            }
        }
    }

    /**
    * get Db Version
    * 
    * @param {string} dbName 
    * @param {Function} callback 
    */
    export var getDbVersion = function (dbName: string, callback: Function) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback(Number(dbVersion));
        });
    }

    /**
    * get Database Schema
    * 
    * @param {string} dbName 
    * @param {Function} callback 
    */
    export var getDbSchema = function (dbName: string, callback: Function) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                callback(result);
            });
        }
    }

    /**
    * check value null or not
    * 
    * @param {any} value 
    * @returns 
    */
    export var isNull = function (value) {
        if (value == null) {
            return true;
        } else {
            switch (typeof value) {
                case 'string': return value.length == 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    }

    /**
    * Enable log
    * 
    */
    export var enableLog = function () {
        EnableLog = true;
        if (WorkerInstance) {
            WorkerInstance.postMessage(<IWebWorkerRequest>{
                Name: 'change_log_status',
                Query: {
                    logging: EnableLog
                }
            });
        }
    }

    /**
    * disable log
    * 
    */
    export var disableLog = function () {
        EnableLog = false;
        if (WorkerInstance) {
            WorkerInstance.postMessage(<IWebWorkerRequest>{
                Name: 'change_log_status',
                Query: {
                    logging: EnableLog
                }
            });
        }
    }

}