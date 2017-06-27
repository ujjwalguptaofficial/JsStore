import IndexDbModel = JsStore.IndexDb.Model;
import IndexDbBusiness = JsStore.IndexDb.Business;
module JsStore {

    export class Instance {
        IndexDbObj: IndexDbBusiness.MainLogic;

        constructor() {
            UtilityLogic.setDbType();
            //IndexDb.KeyStoreObj = new KeyStore();
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
        createDb(dataBase: IndexDbModel.IDataBase, onSuccess: Function, onError: Function) {

            var Db = new IndexDbModel.DataBase(dataBase)
            this.IndexDbObj = new IndexDbBusiness.MainLogic(Db);
            var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
            this.IndexDbObj.createDb(this, onSuccess, onError);
            //Business.IndexDb.Db = Db;
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
            this.IndexDbObj.openDb(this, onSuccess, onError);
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
            this.IndexDbObj.closeDb();
        }

        dropDb(onSuccess: Function, onError: Function) {
            this.IndexDbObj.dropDb(onSuccess, onError);
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
            if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Connected) {
                this.IndexDbObj.select(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Closed) {
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

            if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Connected) {
                var IsReturn = query.Return ? query.Return : false;
                this.IndexDbObj.insert(query.Into, query.Values, IsReturn, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.insert(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.insert(query, onSuccess, onError);
                })

            }
        }

        update(query: IUpdate, onSuccess: Function, onError: Function) {
            if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Connected) {
                this.IndexDbObj.update(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.update(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.update(query, onSuccess, onError);
                })

            }

        }

        delete(query: IDelete, onSuccess: Function, onError: Function) {
            if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Connected) {
                this.IndexDbObj.delete(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.delete(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.delete(query, onSuccess, onError);
                })

            }
        }


    }
}
