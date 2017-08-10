
module JsStore {
    export module Model {
        export interface IDataBase {
            Name: string;
            Tables: Array<ITable>;
        }

        export class DataBase implements IDataBase {
            Name: string;
            Tables: Array<Table> = [];

            constructor(dataBase: IDataBase) {
                var That = this;
                this.Name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Table(item, That.Name));
                })

            }

            create = function (onSuccess: Function, onError: Function) {
                console.log('create Database called');
                var That = this,
                    createDb = function () {
                        setTimeout(function () {
                            var LastTable = (<ITable>That.Tables[That.Tables.length - 1]);
                            KeyStore.get("JsStore_" + That.Name + "_" + LastTable.Name + "_Version", function (version) {
                                if (version == LastTable.Version) {
                                    KeyStore.get('JsStore_' + That.Name + '_Db_Version', function (dbVersion) {
                                        Business.ActiveDataBase = That;
                                        new Business.CreateDb(dbVersion, onSuccess, onError)
                                    });
                                }
                                else {
                                    createDb();
                                }
                            });
                        }, 100);
                    }
                createDb();
            }
        }
    }
}
