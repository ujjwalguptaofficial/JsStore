import IndexDbModel = JsStore.IndexDb.Model;
import IndexDbBusiness = JsStore.IndexDb.Business;
module JsStore {

    export class Instance {
        IndexDbObj: IndexDbBusiness.MainLogic;

        constructor() {
            UtilityLogic.setDbType();
        }

        /**
         * creates DataBase
         * 
         * @param {IDataBase} dataBase 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @returns 
         * 
         * @memberOf Main
         */
        createDb(dataBase: IDataBase, onSuccess: Function, onError: Function= null) {
            var Db = new IndexDbModel.DataBase(dataBase),
                DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
            this.IndexDbObj = new IndexDbBusiness.MainLogic(Db);
            this.IndexDbObj.createDb(this, DbVersion, onSuccess, onError);
            return this;
        }

        /**
         * open DataBase Connection
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
         * close Database connection
         * 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        closeDb(onSuccess: Function, onError: Function= null) {
            this.IndexDbObj.closeDb();
        }

        /**
         * drop dataBase
         * 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @memberof Instance
         */
        dropDb(onSuccess: Function, onError: Function= null) {
            this.IndexDbObj.dropDb(onSuccess, onError);
        }

        /**
         * select data from table
         * 
         * @param {IQuery} query 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * 
         * @memberOf Main
         */
        select(query: ISelect, onSuccess: Function, onError: Function = null) {
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
         * get no of result from table
         * 
         * @param {ICount} query 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        count(query: ICount, onSuccess: Function, onError: Function = null) {
            if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Connected) {
                this.IndexDbObj.count(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.count(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == ConnectionStatus.Closed) {
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
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        insert(query: IInsert, onSuccess: Function, onError: Function = null) {

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

        /**
         * update data into table
         * 
         * @param {IUpdate} query 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        update(query: IUpdate, onSuccess: Function, onError: Function = null) {
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

        /**
         * delete data from table
         * 
         * @param {IDelete} query 
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @memberof Instance
         */
        delete(query: IDelete, onSuccess: Function, onError: Function= null) {
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
