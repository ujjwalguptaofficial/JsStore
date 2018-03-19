import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;

namespace JsStore {
    export class Instance extends CodeExecutionHelper {
        constructor(dbName?: string) {
            super();
            if (worker_status === WebWorker_Status.Registered) {
                worker_instance.terminate();
            }
            else if (worker_status === WebWorker_Status.NotStarted) {
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
        openDb(dbName: string, onSuccess?: () => void, onError?: (err: IError) => void): Promise<null> {
            return this.pushApi({
                Name: 'open_db',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: dbName
            } as IWebWorkerRequest, false);
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
        createDb(dataBase: IDataBaseOption, onSuccess?: (dbSchema: any) => void, onError?: (err: IError) => void)
            : Promise<null> {
            return this.pushApi({
                Name: 'create_db',
                OnError: onError,
                OnSuccess: onSuccess,
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
        dropDb(onSuccess?: () => void, onError?: (err: IError) => void): Promise<null> {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'drop_db',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: null
            } as IWebWorkerRequest, use_promise);
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
        select(query: ISelect, onSuccess?: (results: any[]) => void, onError?: (err: IError) => void)
            : Promise<any[]> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'select',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * perform transaction - execute multiple apis
         * 
         * @param {string[]} tableNames 
         * @param {any} txLogic 
         * @param {(results: any[]) => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        transaction(query: ITranscationQry, onSuccess?: (results: any[]) => void, onError?: (err: IError) => void)
            : Promise<null> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            query.Logic = query.Logic.toString();
            return this.pushApi({
                Name: 'transaction',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * get no of result from table
         * 
         * @param {ICount} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        count(query: ICount, onSuccess?: (noOfRecord: number) => void, onError?: (err: IError) => void)
            : Promise<number> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'count',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * insert data into table
         * 
         * @param {IInsert} query 
         * @param {(recordInserted: number) => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        insert(query: IInsert, onSuccess?: (recordInserted: number) => void, onError?: (err: IError) => void)
            : Promise<number> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'insert',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * update data into table
         * 
         * @param {IUpdate} query 
         * @param {(recordUpdated: number) => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        update(query: IUpdate, onSuccess?: (recordUpdated: number) => void, onError?: (err: IError) => void)
            : Promise<number> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'update',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        delete(query: IRemove, onSuccess?: (recordDeleted: number) => void, onError?: (err: IError) => void) {
            JsStore.logError('delete is deprecated because delete is reserved keyword in js. Please use remove api.');
        }

        /**
         * remove data from table
         * 
         * @param {IRemove} query 
         * @param {(recordDeleted: number) => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        remove(query: IRemove, onSuccess?: (recordDeleted: number) => void, onError?: (err: IError) => void)
            : Promise<number> {
            onSuccess = query.OnSuccess ? query.OnSuccess : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            query.OnSuccess = query.OnError = null;
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'remove',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * delete all data from table
         * 
         * @param {string} tableName 
         * @param {() => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        clear(tableName: string, onSuccess?: () => void, onError?: (err: IError) => void)
            : Promise<null> {
            var use_promise = onSuccess ? false : true;
            return this.pushApi({
                Name: 'clear',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: tableName
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * insert bulk amount of data
         * 
         * @param {IInsert} query 
         * @param {() => void} onSuccess 
         * @param {(err: IError) => void} onError 
         * @returns 
         * @memberof Instance
         */
        bulkInsert(query: IInsert, onSuccess?: () => void, onError?: (err: IError) => void)
            : Promise<null> {
            onSuccess = query.OnSuccess ? query.OnSuccess as any : onSuccess;
            onError = query.OnError ? query.OnError : onError;
            var use_promise = onSuccess ? false : true;
            query.OnSuccess = query.OnError = null;
            return this.pushApi({
                Name: 'bulk_insert',
                OnError: onError,
                OnSuccess: onSuccess,
                Query: query
            } as IWebWorkerRequest, use_promise);
        }

        /**
         * export the result in json file
         * 
         * @param {ISelect} qry 
         * @memberof Instance
         */
        exportJson(query: ISelect): Promise<null> {
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
                        OnError: onError,
                        OnSuccess: onSuccess,
                        Query: query
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
                    OnError: onError,
                    OnSuccess: onSuccess,
                    Query: query,
                } as IWebWorkerRequest, use_promise);
            }

        }
    }
}
