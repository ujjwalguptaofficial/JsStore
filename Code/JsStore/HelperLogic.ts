namespace JsStore {
    /**
     * checks whether db exist or not
     * 
     * @param {DbInfo} dbInfo 
     * @param {() => void} [callback=null] 
     * @param {() => void} [errCallBack=null] 
     * @returns 
     */
    export var isDbExist = function (
        dbInfo: IDbInfo,
        callback: (isExist: boolean) => void = null,
        errCallBack: (err: IError) => void = null
    ) {
        var use_promise = callback ? false : true;
        if (status.ConStatus !== Connection_Status.UnableToStart) {
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    if (typeof dbInfo === 'string') {
                        getDbVersion(dbInfo, function (dbVersion) {
                            resolve(Boolean(dbVersion));
                        });
                    }
                    else {
                        getDbVersion(dbInfo.DbName, function (dbVersion) {
                            resolve(dbInfo.Table.Version <= dbVersion);
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
                        callback.call(this, dbInfo.Table.Version <= dbVersion);
                    });
                }
            }
        }
        else {
            var error = {
                _type: status.LastError,
                _message: null
            } as IError;
            switch (error._type) {
                case Error_Type.IndexedDbBlocked:
                    error._message = "IndexedDB is blocked"; break;
                case Error_Type.IndexedDbUndefined:
                    error._message = "IndexedDB is not supported"; break;
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
    export var getDbVersion = function (dbName: string, callback: (version: number) => void) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback.call(this, Number(dbVersion));
        }.bind(this));
    };

    /**
     * get Database Schema
     * 
     * @param {string} dbName 
     * @param {(any) => void} callback 
     */
    export var getDbSchema = function (dbName: string, callback: (any) => void) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                if (result._name) {
                    callback(result);
                }
                else {
                    var db_schema = new Model.DataBase(result);
                    KeyStore.set("JsStore_" + dbName + "_Schema", db_schema);
                    callback(db_schema);
                }
            });
        }
    };

    /**
     * check for null value
     * 
     * @param {any} value 
     * @returns 
     */
    export var isNull = function (value) {
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
    export var enableLog = function () {
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
    export var disableLog = function () {
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

    /**
     * get the jsstore version
     * 
     * @returns {number} 
     */
    var getVersion = function (): number {
        var version = parseFloat('1.3.3');
        return version;
    };

}