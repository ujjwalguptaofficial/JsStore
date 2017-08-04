import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
module JsStore {

    export class Instance {
        IndexDbObj: Business.MainLogic;

        constructor() {
            UtilityLogic.setDbType();
        }

        /**
         * creates DataBase
         * 
         * @param {IDataBase} dataBase 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @returns 
         * 
         * @memberOf Main
         */
        createDb(dataBase: Model.IDataBase, onSuccess: Function, onError: Function = null) {
            var Db = new DataBase(dataBase),
                DbVersion = Number(localStorage.getItem('JsStore_' + dataBase.Name + '_Db_Version'));
            this.IndexDbObj = new Business.MainLogic(Db);
            this.IndexDbObj.createDb(this, DbVersion, onSuccess, onError);
            return this;
        }

        /**
         * open DataBase Connection
         * 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * 
         * @memberOf Main
         */
        openDb(onSuccess: Function = null, onError: Function = null) {
            this.IndexDbObj.openDb(this, onSuccess, onError);
        }

        /**
         * close Database connection
         * 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * 
         * @memberOf Main
         */
        closeDb(onSuccess: Function, onError: Function = null) {
            this.IndexDbObj.closeDb();
        }

        /**
         * drop dataBase
         * 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        dropDb(onSuccess: Function, onError: Function = null) {
            this.IndexDbObj.dropDb(onSuccess, onError);
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
        select(query: ISelect, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess,
                    OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.select(query, OnSuccess, OnError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.select(query, onSuccess, onError);
                })

            }
        }

        /**
         * get no of result from table
         * 
         * @param {ICount} query 
         * @param {Function} [onSuccess=null]  
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        count(query: ICount, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess,
                    OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.count(query, OnSuccess, OnError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.count(query, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.count(query, onSuccess, onError);
                })

            }
        }


        /**
         * insert data into table
         * 
         * @param {IInsert} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        insert(query: IInsert, onSuccess: Function = null, onError: Function = null) {

            if (Status.ConStatus == ConnectionStatus.Connected) {
                var IsReturn = query.Return ? query.Return : false,
                    OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess,
                    OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.insert(query.Into, query.Values, IsReturn, OnSuccess, OnError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.insert(query, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.insert(query, onSuccess, onError);
                })

            }
        }

        /**
         * update data into table
         * 
         * @param {IUpdate} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        update(query: IUpdate, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess,
                    OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.update(query, OnSuccess, OnError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.update(query, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.update(query, onSuccess, onError);
                })

            }

        }

        /**
         * delete data from table
         * 
         * @param {IDelete} query 
         * @param {Function} [onSuccess=null] 
         * @param {Function} onError 
         * @memberof Instance
         */
        delete(query: IDelete, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess,
                    OnError = query.OnError ? query.OnError : onError;
                this.IndexDbObj.delete(query, OnSuccess, OnError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.delete(query, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.delete(query, onSuccess, onError);
                })

            }
        }

        clear(tableName: string, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                this.IndexDbObj.clear(tableName, onSuccess, onSuccess);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.clear(tableName, onSuccess, onSuccess);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.clear(tableName, onSuccess, onSuccess);
                })
            }
        }
    }
}
