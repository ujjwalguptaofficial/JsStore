import DataBase = JsStorage.Model.DataBase;
import IDataBase = JsStorage.Model.IDataBase;
module JsStorage {
    export enum ConnectionStatus {
        Connected = 1,
        Closed = 2,
        NotStarted = 3
    }
    export interface JsStorageStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export class Main {
        DbType: DBType;
        IndexDbObj: Business.IndexDb.MainLogic;
        WebSqlObj: Business.WebSqlLogic;
        Status: JsStorageStatus = <JsStorageStatus>{
            ConStatus: ConnectionStatus.NotStarted,
            LastError: ""
        };
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
        openDb(onSuccess: Function, onError: Function) {
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
                this.IndexDbObj.closeDb(this);
            }
            else {

            }
        }

        dropDb(name: string, onSuccess: Function, onError: Function) {
            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.dropDb(name.toLowerCase(), onSuccess, onError);
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
            query.From = query.From.toLowerCase();
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
                query.From = query.From.toLowerCase();
                if (this.DbType == DBType.IndexedDb) {
                    this.IndexDbObj.select(query, onSuccess, onError);
                }
                else {

                }
            }
            else if (this.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 200);
            }
            else if (this.Status.ConStatus == ConnectionStatus.Closed) {

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
            if (!Array.isArray(query.Values)) {
                throw "Value should be array :- supplied value is not array";
            }
            else if (query.Values.length > 0) {
                query.Into = query.Into.toLowerCase();
                if (this.DbType == DBType.IndexedDb) {
                    this.IndexDbObj.insert(query.Into, query.Values, onSuccess, onError);
                }
                else {

                }
            }
            else {
                if (onError != null) {
                    onError(Business.UtilityLogic.getError(ErrorType.NoValueSupplied, true, null));
                }
            }
        }

        update(query: IUpdate, onSuccess: Function, onError: Function) {

            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.update(query, onSuccess, onError);
            }
            else {

            }
        }

        delete(query: IDelete, onSuccess: Function, onError: Function) {
            if (this.DbType == DBType.IndexedDb) {
                this.IndexDbObj.delete(query, onSuccess, onError);
            }
            else {

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
