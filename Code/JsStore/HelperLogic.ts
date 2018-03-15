namespace JsStore {

    /**
     * checks whether db exist or not
     * 
     * @param {(IDbInfo | string)} dbInfo 
     * @param {(isExist: boolean) => void} callback 
     * @param {(err: IError) => void} [errCallBack] 
     * @returns 
     */
    export var isDbExist = function (
        dbInfo: IDbInfo | string,
        callback: (isExist: boolean) => void,
        errCallBack?: (err: IError) => void
    ) {
        var use_promise = callback ? false : true;
        if (db_status.ConStatus !== Connection_Status.UnableToStart) {
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
                _message: null,
                _type: db_status.LastError,
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
                if (result) {
                    if (result._name) {
                        callback(result);
                    }
                    else {
                        var db_schema = new Model.DataBase(result);
                        KeyStore.set("JsStore_" + dbName + "_Schema", db_schema);
                        callback(db_schema);
                    }
                }
                else {
                    callback(result);
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
        Utils.changeLogStatus();
    };

    /**
     * disable log
     * 
     */
    export var disableLog = function () {
        enable_log = false;
        Utils.changeLogStatus();
    };

    /**
     * set the configuration
     * 
     * @param {IConfig} config 
     */
    export var setConfig = function (config: IConfig) {
        if (config.OnDbDroppedByBrowser) {
            config.OnDbDroppedByBrowser = config.OnDbDroppedByBrowser.toString();
        }
        if (worker_instance) {
            worker_instance.postMessage({
                Name: 'set_config',
                Query: config
            } as IWebWorkerRequest);
        }
    };

    /**
     * get data type of supplied value
     * 
     * @param {any} value 
     * @returns 
     */
    export var getType = function (value) {
        if (value === null) {
            return Data_Type.Null;
        }
        var type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return Data_Type.Array;
                }
            default:
                return type;
        }
    };

    /**
     * get database list
     * 
     * @param {(dbList: string[]) => void} callback 
     */
    export var getDbList = function (callback: (dbList: string[]) => void) {
        if (callback === undefined) {
            return new Promise(function (resolve, reject) {
                KeyStore.get('database_list', function (result) {
                    if (result == null) {
                        result = [];
                    }
                    resolve(result);
                }, function (err) {
                    reject(err);
                });
            });
        }
        else {
            KeyStore.get('database_list', function (result) {
                if (result == null) {
                    result = [];
                }
                callback(result);
            });
        }
    };
}