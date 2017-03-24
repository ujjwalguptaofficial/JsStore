import Table = JsStorage.Model.Table;
import Column = JsStorage.Model.Column;
module JsStorage {
    export module Business {
        export module IndexDb {
            export var DbConnection,
                ActiveDataBase: DataBase;
            export class MainLogic {
                constructor(dataBase: DataBase) {
                    ActiveDataBase = dataBase
                }

                openDb = function (objMain: Main, onSuccess: Function, onError: Function) {
                    var ObjOpenDb = new OpenDbLogic(objMain, onSuccess, onError);
                }

                public closeDb = function (objMain: Main) {
                    if (objMain.Status.ConStatus == ConnectionStatus.Connected) {
                        DbConnection.close();
                    }
                }

                public dropDb = function (name: string, onSuccess: Function, onError: Function) {
                    var ObjDropDb = new DropDbLogic(name, onSuccess, onError);
                }

                public update = function (query: IUpdate, onSuccess: Function, onError: Function) {
                    var ObjUpdate = new UpdateLogic(query, onSuccess, onError);
                }

                public insert = function (tableName: string, values, onSuccess: Function, onError: Function) {
                    var ObjInsert = new InsertLogic(tableName, values, onSuccess, onError);
                }

                public delete = function (query: IDelete, onSuccess: Function, onError: Function) {
                    var ObjDelete = new DeleteLogic(query, onSuccess, onError);
                }

                public select = function (query: ISelect, onSuccess: Function, onError: Function) {
                    if (Array.isArray(query.From)) {
                        new SelectJoinLogic(query, true, onSuccess, onError);
                    }
                    else if (typeof query.From === 'object') {
                        new SelectJoinLogic(query, false, onSuccess, onError);
                    }
                    else {
                        new SelectLogic(query, onSuccess, onError);
                    }
                }

                public createDb = function (objMain: Main, onSuccess: Function, onError: Function) {
                    new CreateDbLogic(objMain, onSuccess, onError);
                }

                public clear = function (tableName: string, onSuccess: Function, onError: Function) {
                    new ClearLogic(tableName, onSuccess, onError);
                }
            }
        }

    }
}