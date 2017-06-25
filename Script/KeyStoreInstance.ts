import KeyStores = JsStorage.Business.KeyStores;
module JsStorage {
    export interface ISet {
        Key: string,
        Value; any
    }

    export class KeyStore {
        KeyStoreObj: KeyStores.MainLogic;
        TableName: string = "Local_Storage";
        constructor() {
            JsStorage.Business.UtilityLogic.setDbType();
            var Table = <Model.ITable>{
                Name: this.TableName,
                Columns: [<Model.IColumn>{
                    Name: "Key",
                    PrimaryKey: true
                }],
                Version: 1
            }

            var keyStore_DataBase = <Model.IDataBase>{
                Name: "JsStore_KeyStore",
                Tables: [Table]
            }

            var Db = new DataBase(keyStore_DataBase);
            this.KeyStoreObj = new Business.KeyStores.MainLogic(Db);
            var DbVersion = Number(localStorage.getItem(keyStore_DataBase.Name + 'Db_Version'));
            this.KeyStoreObj.createDb();
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
            this.KeyStoreObj.openDb(this, onSuccess, onError);
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
            this.KeyStoreObj.closeDb();
        }

        get(key: string, onSuccess: Function, onError: Function) {
            if (KeyStores.Status.ConStatus == ConnectionStatus.Connected) {
                var Query = <ISelect>{
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                }
                this.KeyStoreObj.get(Query, onSuccess, onError);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.get(key, onSuccess, onError);
                }, 50);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.get(key, onSuccess, onError);
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
        set(key, value, onSuccess: Function, onError: Function) {
            if (KeyStores.Status.ConStatus == ConnectionStatus.Connected) {
                var IsReturn = false;
                var Value = <ISet>{
                    Key: key,
                    Value: value
                }
                this.KeyStoreObj.set(this.TableName, Value, IsReturn, onSuccess, onError);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.set(key, value, onSuccess, onError);
                }, 50);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.set(key, value, onSuccess, onError);
                })

            }
        }

        remove(key: string, onSuccess: Function, onError: Function) {
            if (KeyStores.Status.ConStatus == ConnectionStatus.Connected) {
                var Query = <IDelete>{
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                }
                this.KeyStoreObj.remove(Query, onSuccess, onError);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.remove(key, onSuccess, onError);
                }, 50);
            }
            else if (KeyStores.Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.remove(key, onSuccess, onError);
                })

            }
        }
    }
}
