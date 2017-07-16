
module JsStore {
    export module Business {
        export var DbConnection,
            ActiveDataBase: DataBase;

        export class MainLogic {
            constructor(dataBase: DataBase) {
                ActiveDataBase = dataBase
            }

            openDb = function (objMain: Instance, onSuccess: Function, onError: Function) {
                new OpenDbLogic(objMain, onSuccess, onError);
            }

            public closeDb = function () {
                if (Status.ConStatus == ConnectionStatus.Connected) {
                    DbConnection.close();
                }
            }

            public dropDb = function (onSuccess: Function, onError: Function) {
                new DropDbLogic(ActiveDataBase.Name, onSuccess, onError);
            }

            public update = function (query: IUpdate, onSuccess: Function, onError: Function) {
                new UpdateLogic(query, onSuccess, onError);
            }

            public insert = function (tableName: string, values, isReturn, onSuccess: Function, onError: Function) {
                if (!Array.isArray(values)) {
                    throw "Value should be array :- supplied value is not array";
                }
                else if (values.length > 0) {
                    var ObjInsert = new InsertLogic(tableName, values, isReturn, onSuccess, onError);
                }
                else {
                    if (onError != null) {
                        onError(UtilityLogic.getError(ErrorType.NoValueSupplied, true, null));
                    }
                }
            }

            public delete = function (query: IDelete, onSuccess: Function, onError: Function) {
                new DeleteLogic(query, onSuccess, onError);
            }

            public select = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    new SelectJoinLogic(<ISelectJoin>query, onSuccess, onError);
                }
                else {
                    new SelectLogic(query, onSuccess, onError);
                }
            }

            public count = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    new SelectJoinLogic(query, onSuccess, onError);
                }
                else {
                    new CountLogic(query, onSuccess, onError);
                }
            }

            public createDb = function (objMain: Instance, dbVersion, onSuccess: Function, onError: Function) {
                new CreateDbLogic(objMain, dbVersion, onSuccess, onError);
            }

            public clear = function (tableName: string, onSuccess: Function, onError: Function) {
                new ClearLogic(tableName, onSuccess, onError);
            }
        }
    }
}
