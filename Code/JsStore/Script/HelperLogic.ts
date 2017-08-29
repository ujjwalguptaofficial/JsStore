module JsStore {
    /**
    * checks whether db exist or not
    * 
    * @param {string} dbName 
    * @param {Function} callback 
    */
    export var isDbExist = function (dbInfo: DbInfo, callback: Function) {
        var DbName;
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
    }

    /**
    * disable log
    * 
    */
    export var disableLog = function () {
        EnableLog = false;
    }

}