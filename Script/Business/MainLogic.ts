import Table = JsStorage.Model.Table;
import DataBase = JsStorage.Model.DataBase;

module JsStorage {
    export class Main {

        constructor() {
            this.setDbType();
        }

        createDb(dataBase: DataBase) {
            if (DbType == DBType.IndexedDb) {
                IndexDbObj = new Business.IndexDbLogic();
                var DbVersion = Number(localStorage.getItem('JsStorage_Db_Version'));
                IndexDbObj.openDataBase(DbVersion, dataBase);
            }
            else {
                WebSqlObj = new Business.WebSqlLogic();
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
