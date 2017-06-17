import DataBase = JsStorage.Model.DataBase;
import IDataBase = JsStorage.Model.IDataBase;
module JsStorage {

    export class Instance {
        DbType: DBType;
        IndexDbObj: Business.IndexDb.MainLogic;
        WebSqlObj: Business.WebSqlLogic;

        constructor() {
            this.setDbType();
        }

        /**
         * 
         * 
         * @param {IDataBase} dataBase 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @returns 
         * 
         * @memberOf Main
         */
        createDb(dataBase: IDataBase, onSuccess: Function, onError: Function) {
            if (this.DbType == DBType.IndexedDb) {
                var Db = new DataBase(dataBase)
                this.IndexDbObj = new Business.IndexDb.MainLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                this.IndexDbObj.createDb(this, onSuccess, onError);
                Business.IndexDb.Db = Db;
            }
            else {
                this.WebSqlObj = new Business.WebSqlLogic();
            }
            return this;
        }

        /**
         * 
         * 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        openDb(onSuccess: Function = null, onError: Function = null) {
            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.openDb(this, onSuccess, onError);
            }
            else {

            }
        }

        /**
         * 
         * 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        closeDb(onSuccess: Function, onError: Function) {
            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.closeDb();
            }
            else {

            }
        }

        dropDb(onSuccess: Function, onError: Function) {
            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.dropDb(onSuccess, onError);
            }
            else {

            }
        }

        /**
         * 
         * 
         * @param {IQuery} query 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        select(query: ISelect, onSuccess: Function, onError: Function) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                if (this.DbType == DBType.IndexedDb) {
                    this.IndexDbObj.select(query, onSuccess, onError);
                }
                else {

                }
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
         * 
         * 
         * @param {string} table 
         * @param {any} value 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        insert(query: IInsert, onSuccess: Function, onError: Function) {

            if (Status.ConStatus == ConnectionStatus.Connected) {
                if (this.DbType == DBType.IndexedDb) {
                    var IsReturn = query.Return ? query.Return : false;
                    this.IndexDbObj.insert(query.Into, query.Values, IsReturn, onSuccess, onError);
                }
                else {

                }
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

        update(query: IUpdate, onSuccess: Function, onError: Function) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                if (this.DbType == DBType.IndexedDb) {
                    this.IndexDbObj.update(query, onSuccess, onError);
                }
                else {

                }
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

        delete(query: IDelete, onSuccess: Function, onError: Function) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                if (this.DbType == DBType.IndexedDb) {
                    this.IndexDbObj.delete(query, onSuccess, onError);
                }
                else {

                }

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

        /**
            * determine and set the DataBase Type
            * 
            * 
            * @memberOf MainLogic
            */
        private setDbType = function () {
            (window as any).indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
            if (indexedDB) {
                this.DbType = DBType.IndexedDb;
                (window as any).IDBTransaction = (window as any).IDBTransaction || (window as any).webkitIDBTransaction || (window as any).msIDBTransaction;
                (window as any).IDBKeyRange = (window as any).IDBKeyRange || (window as any).webkitIDBKeyRange || (window as any).msIDBKeyRange
            }
            else if ((window as any).openDatabase) {
                this.DbType = DBType.WebSql;
            }
            else {
                throw 'Browser does not support Db Implementation';
            }
        }


    }
}
