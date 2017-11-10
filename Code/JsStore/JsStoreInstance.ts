import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare var Promise: any;

module JsStore {
    export class Instance extends CodeExecutionHelper {
        constructor(dbName = null) {
            super();
            if (WorkerStatus == WebWorkerStatus.Registered) {
                WorkerInstance.terminate();
            }
            else if (WorkerStatus == WebWorkerStatus.NotStarted) {
                KeyStore.init();
            }
            this.createWorker();
            if (dbName) {
                this.openDb(dbName);
            }
        }


        /**
         * open database
         * 
         * @param {string} dbName 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @returns 
         * @memberof Instance
         */
        openDb = function (dbName: string, onSuccess: Function = null, onError: Function = null) {
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'open_db',
                Query: dbName,
                OnSuccess: onSuccess,
                OnError: onError,
            });
        }

        /**
         * creates DataBase
         * 
         * @param {Model.IDataBase} dataBase 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @returns 
         * @memberof Instance
         */
        createDb = function (dataBase: Model.IDataBase, onSuccess: Function = null, onError: Function = null) {
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'create_db',
                OnSuccess: onSuccess,
                OnError: onError,
                Query: dataBase
            });
        }


        /**
         * drop dataBase
         * 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        dropDb = function (onSuccess: Function, onError: Function = null) {
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'drop_db',
                OnSuccess: onSuccess,
                OnError: onError
            });
        }

        /**
         * select data from table
         * 
         * @param {IQuery} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * 
         * @memberOf Main
         */
        select = function (query: ISelect, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onSuccess = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'select',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onSuccess
            });
        }

        /**
         * get no of result from table
         * 
         * @param {ICount} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        count = function (query: ICount, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'count',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            });
        }


        /**
         * insert data into table
         * 
         * @param {IInsert} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        insert = function (query: IInsert, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'insert',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            });
        }

        /**
         * update data into table
         * 
         * @param {IUpdate} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        update = function (query: IUpdate, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'update',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            });
        }

        /**
         * delete data from table
         * 
         * @param {IDelete} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} onError 
         * @memberof Instance
         */
        delete = function (query: IDelete, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'delete',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            });
        }

        /**
         * delete all data from table
         * 
         * @param {string} tableName 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        clear = function (tableName: string, onSuccess: Function = null, onError: Function = null) {
            return this.prcoessExecutionOfCode(<IWebWorkerRequest>{
                Name: 'clear',
                Query: tableName,
                OnSuccess: onSuccess,
                OnError: onerror
            });
        }

        /**
         * insert bulk amount of data
         * 
         * @param {IInsert} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @returns 
         * @memberof Instance
         */
        bulkInsert = function (query: IInsert, onSuccess: Function = null, onError: Function = null) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            return this.pushApi(<IWebWorkerRequest>{
                Name: 'bulk_insert',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            });
        }

        /**
         * export the result in json file
         * 
         * @param {ISelect} qry 
         * @memberof Instance
         */
        exportJson = function (query: ISelect) {
            var OnSuccess = function (url) {
                var Link = document.createElement("a");
                Link.href = url;
                Link.download = query.From + ".json";
                Link.click();
                if (OnSuccessCallBack) {
                    OnSuccessCallBack();
                }
            },
                OnError = query['OnError'],
                OnSuccessCallBack = query['OnSuccess'];
            query['OnSuccess'] = query['OnError'] = undefined;
            this.pushApi(<IWebWorkerRequest>{
                Name: 'export_json',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            }, OnSuccess);

        }
    }
}
