module JsStore {

    /**
    * checks whether db exist or not
    * 
    * @param {DbInfo} dbInfo 
    * @param {Function} callback 
    * @param {Function} errCallBack 
    */
    export var isDbExist = function (dbInfo: DbInfo, callback: Function, errCallBack: Function = null) {
        if (Status.ConStatus != ConnectionStatus.UnableToStart) {
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
        else {
            if (errCallBack) {
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

    /**
    * get the results in file by file type
    * 
    * @param {*} qry 
    * @param {string} type 
    */
    export var getFile = function (qry: any, data, type: string = null) {
        var downloadJson = function (qry) {
            // var Result = [];
            // var Table = document.querySelector('#divResultSQL table tbody');
            // for (var i = 1, rowLength = Table.rows.length; i < rowLength; i++) {
            //     var Obj = {};
            //     for (var j = 0, colLength = Table.rows[i].cells.length; j < colLength; j++) {
            //         if (j == 1 || j == 4) {
            //             Obj[Table.rows[0].cells[j].innerText] = Table.rows[i].cells[j].innerText;
            //         } else {
            //             Obj[Table.rows[0].cells[j].innerText] = Number(Table.rows[i].cells[j].innerText);
            //         }
            //     }
            //     Result.push(Obj);
            // }
            // var a = document.createElement("a");
            // var file = new Blob([JSON.stringify(Result)], {
            //     type: "text/json"
            // });
            // a.href = URL.createObjectURL(file);
            // a.download = fileName + ".json";
            // a.click();        
        }
        switch (type.toLowerCase()) {
            case 'csv':
            default: downloadJson(qry);
        }
    }
}