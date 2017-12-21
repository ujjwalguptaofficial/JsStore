import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare var Promise: any;

namespace JsStore {
    export class Instance extends CodeExecutionHelper {
        constructor(dbName = null) {
            super();
            if (worker_status === WebWorkerStatus.Registered) {
                worker_instance.terminate();
            }
            else if (worker_status === WebWorkerStatus.NotStarted) {
                KeyStore.init();
            }
            this.createWorker();
            if (dbName) {
                this.openDb(dbName, null, null);
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
        openDb = function (dbName: string, onSuccess: () => void, onError: (err: IError) => void) {
            return this.pushApi({
                Name: 'open_db',
                Query: dbName,
                OnSuccess: onSuccess,
                OnError: onError,
            } as IWebWorkerRequest, false);
        };

        /**
         * creates DataBase
         * 
         * @param {Model.IDataBase} dataBase 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @returns 
         * @memberof Instance
         */
        createDb = function (
            dataBase: Model.IDataBase, onSuccess: (dbSchema: any) => void, onError: (err: IError) => void) {
            return this.pushApi({
                Name: 'create_db',
                OnSuccess: onSuccess,
                OnError: onError,
                Query: dataBase
            } as IWebWorkerRequest, false);
        }


        /**
         * drop dataBase
         * 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        dropDb = function (onSuccess: () => void, onError: (err: IError) => void) {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'drop_db',
                Query: null,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * select data from table
         * 
         * @param {IQuery} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * 
         * @memberOf Main
         */
        select = function (query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'select',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * get no of result from table
         * 
         * @param {ICount} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        count = function (query: ICount, onSuccess: (noOfRecord: number) => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'count',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * insert data into table
         * 
         * @param {IInsert} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        insert = function
        (query: IInsert, onSuccess: (recordInserted: number) => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'insert',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * update data into table
         * 
         * @param {IUpdate} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        update = function (query: IUpdate, onSuccess: (recordUpdated: number) => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'update',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * delete data from table
         * 
         * @param {IDelete} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} onError 
         * @memberof Instance
         */
        delete = function (query: IDelete, onSuccess: (recordDeleted: number) => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'delete',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * delete all data from table
         * 
         * @param {string} tableName 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        clear = function
        (tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'clear',
                Query: tableName,
                OnSuccess: onSuccess,
                OnError: onerror
            } as IWebWorkerRequest, use_promise);
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
        bulkInsert = function (query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
            onSuccess = query.OnSuccess ? query.OnSuccess as any : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            var use_promise = onSuccess ? false : true;
            query.OnSuccess = query.OnError = null;
            return this.pushApi({
                Name: 'bulk_insert',
                Query: query,
                OnSuccess: onSuccess,
                OnError: onError
            } as IWebWorkerRequest, use_promise);
        };

        /**
         * export the result in json file
         * 
         * @param {ISelect} qry 
         * @memberof Instance
         */
        exportJson = function (query: ISelect) {
            var onSuccess = function (url) {
                var link = document.createElement("a");
                link.href = url;
                link.download = query.From + ".json";
                link.click();
                if (onSuccessCallBack) {
                    onSuccessCallBack(null);
                }
            },
                onError = query['OnError'],
                onSuccessCallBack = query['OnSuccess'];
            query['OnSuccess'] = query['OnError'] = undefined;
            var use_promise = onSuccessCallBack ? false : true;
            if (use_promise) {
                return new Promise(function (resolve, reject) {
                    this.pushApi({
                        Name: 'export_json',
                        Query: query,
                        OnSuccess: onSuccess,
                        OnError: onError
                    } as IWebWorkerRequest, use_promise).then(function (url) {
                        onSuccess(url);
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            }
            else {
                this.pushApi({
                    Name: 'export_json',
                    Query: query,
                    OnSuccess: onSuccess,
                    OnError: onError
                } as IWebWorkerRequest, use_promise);
            }

        }
    }
}
