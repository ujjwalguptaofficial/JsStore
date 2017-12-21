namespace JsStore {
    /**
     * checks whether db exist or not
     * 
     * @param {DbInfo} dbInfo 
     * @param {() => void} [callback=null] 
     * @param {() => void} [errCallBack=null] 
     * @returns 
     */
    var isDbExist = function (
        dbInfo: IDbInfo,
        callback: (isExist: boolean) => void = null,
        errCallBack: (err: IError) => void = null
    ) {
        var use_promise = callback ? false : true;
        if (status.ConStatus !== ConnectionStatus.UnableToStart) {
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    if (typeof dbInfo === 'string') {
                        getDbVersion(dbInfo, function (dbVersion) {
                            resolve(Boolean(dbVersion));
                        });
                    }
                    else {
                        getDbVersion(dbInfo.DbName, function (dbVersion) {
                            resolve(dbInfo.Table.Version <= dbVersion)
                        });
                    }
                });
            }
            else {
                if (typeof dbInfo === 'string') {
                    getDbVersion.call(this, dbInfo, function (dbVersion) {
                        callback.call(this, Boolean(dbVersion));
                    });
                }
                else {
                    getDbVersion.call(this, dbInfo.DbName, function (dbVersion) {
                        callback.call(this, dbInfo.Table.Version <= dbVersion)
                    });
                }
            }
        }
        else {
            var error = {
                Name: status.LastError,
                Message: ''
            } as IError;
            switch (error.Name) {
                case ErrorType.IndexedDbBlocked:
                    error.Message = "IndexedDB is blocked"; break;
                case ErrorType.IndexedDbUndefined:
                    error.Message = "IndexedDB is not supported"; break;
            }
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    reject(error);
                });
            }
            else if (errCallBack) {
                errCallBack(error);
            }
        }
    };

    /**
     * get Db Version
     * 
     * @param {string} dbName 
     * @param {(version: number) => void} callback 
     */
    var getDbVersion = function (dbName: string, callback: (version: number) => void) {
        var that = this;
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback.call(that, Number(dbVersion));
        });
    };

    /**
     * get Database Schema
     * 
     * @param {string} dbName 
     * @param {(any) => void} callback 
     */
    var getDbSchema = function (dbName: string, callback: (any) => void) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                callback(result);
            });
        }
    };

    /**
     * check for null value
     * 
     * @param {any} value 
     * @returns 
     */
    var isNull = function (value) {
        if (value == null) {
            return true;
        } else {
            switch (typeof value) {
                case 'string': return value.length === 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    };

    /**
     * Enable log
     * 
     */
    var enableLog = function () {
        enable_log = true;
        if (worker_instance) {
            worker_instance.postMessage({
                Name: 'change_log_status',
                Query: {
                    logging: enable_log
                }
            } as IWebWorkerRequest);
        }
    };

    /**
     * disable log
     * 
     */
    var disableLog = function () {
        enable_log = false;
        if (worker_instance) {
            worker_instance.postMessage({
                Name: 'change_log_status',
                Query: {
                    logging: enable_log
                }
            } as IWebWorkerRequest);
        }
    };

}