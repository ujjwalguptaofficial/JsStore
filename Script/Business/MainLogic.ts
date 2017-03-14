import Table = JsStorage.Model.Table;
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
        Status: JsStorageStatus = <JsStorageStatus>{
            ConStatus: ConnectionStatus.NotStarted,
            LastError: ""
        }
        constructor() {
            this.setDbType();
        }

        createDb(dataBase: IDataBase, onSuccess: Function, onError: Function) {
            if (DbType == DBType.IndexedDb) {
                var Db = new DataBase(dataBase)
                IndexDbObj = new Business.IndexDbLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                IndexDbObj.openDataBase(DbVersion, this, onSuccess, onError);
            }
            else {
                WebSqlObj = new Business.WebSqlLogic();
            }
            return this;
        }

        openDataBase(onSuccess: Function, onError: Function) {

        }

        closeDataBase(onSuccess: Function, onError: Function) {

        }

        get(query: IQuery, onSuccess: Function, onError: Function) {
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
                if (DbType == DBType.IndexedDb) {
                    IndexDbObj.get(query, onSuccess, onError);
                }
                else {

                }
            }
            else if (this.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.get(query, onSuccess, onError);
                }, 200);
            }
            else if (this.Status.ConStatus == ConnectionStatus.Closed) {

            }
        }

        add(table: string, value, onSuccess: Function, onError: Function) {
            if (DbType == DBType.IndexedDb) {
                IndexDbObj.add(table, value, onSuccess, onError);
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
                DbType = DBType.IndexedDb;
                (window as any).IDBTransaction = (window as any).IDBTransaction || (window as any).webkitIDBTransaction || (window as any).msIDBTransaction;
                (window as any).IDBKeyRange = (window as any).IDBKeyRange || (window as any).webkitIDBKeyRange || (window as any).msIDBKeyRange
            }
            else if ((window as any).openDatabase) {
                DbType = DBType.WebSql;
            }
            else {
                throw 'Browser does not support Db Implementation';
            }
        }

    }
}
