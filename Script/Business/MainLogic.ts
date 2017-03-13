import Table = JsStorage.Model.Table;
import DataBase = JsStorage.Model.DataBase;
import IDataBase = JsStorage.Model.IDataBase;
module JsStorage {
    export class Main {

        constructor() {
            this.setDbType();
        }

        createDb(dataBase: IDataBase, callBack: Function) {
            if (DbType == DBType.IndexedDb) {
                var Db = new DataBase(dataBase)
                IndexDbObj = new Business.IndexDbLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                IndexDbObj.openDataBase(DbVersion, callBack, this);
            }
            else {
                WebSqlObj = new Business.WebSqlLogic();
            }
            //return this;
        }

        get(query: IQuery, callBack: Function) {
            if (DbType == DBType.IndexedDb) {
                IndexDbObj.get(query, callBack);
            }
            else {

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
