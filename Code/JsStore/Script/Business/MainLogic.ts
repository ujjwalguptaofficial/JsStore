
module JsStore {
    export module Business {
        export var DbConnection,
            ActiveDataBase: DataBase,
            Status: JsStoreStatus = <JsStoreStatus>{
                ConStatus: ConnectionStatus.NotStarted,
                LastError: ""
            };


        export class Main {
            OnSuccess: Function;
            constructor(onSuccess = null) {
                this.OnSuccess = onSuccess;
            }

            public checkConnectionAndExecuteLogic = function (request: IWebWorkerRequest) {
                console.log('executing logic from checkConnection:' + request.Name);
                if (request.Name == 'create_db' || request.Name == 'open_db') {
                    this.executeLogic(request);
                }
                else {
                    if (Status.ConStatus == ConnectionStatus.Connected) {
                        this.executeLogic(request);
                    }
                    else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                        var That = this;
                        setTimeout(function () {
                            That.checkConnectionAndExecuteLogic(request);
                        }, 50);
                    }
                    else if (Status.ConStatus == ConnectionStatus.Closed) {
                        var That = this;
                        this.openDb(function () {
                            That.checkConnectionAndExecuteLogic(request);
                        }, function (err) {
                            console.error(err);
                        });
                    }
                }
            }

            private returnResult = function (result) {
                if (this.OnSuccess) {
                    this.OnSuccess(result);
                }
                else {
                    (self as any).postMessage(result);
                }
            }

            private executeLogic = function (request: IWebWorkerRequest) {
                var That = this,
                    OnSuccess = function (results) {
                        That.returnResult(<IWebWorkerResult>{
                            ReturnedValue: results
                        });
                    },
                    OnError = function (err) {
                        That.returnResult(<IWebWorkerResult>{
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    }

                switch (request.Name) {
                    case 'select':
                        this.select(request.Query, OnSuccess, OnError);
                        break;
                    case 'insert': this.insert(request.Query, OnSuccess, OnError);
                        break;
                    case 'update': break;
                    case 'delete': break;
                    case 'create_db': this.createDb(request.Query, OnSuccess, OnError);
                        break;
                    case 'clear': break;
                    case 'dropDb': break;
                    case 'count': break;
                }
            }

            openDb = function (onSuccess: Function, onError: Function) {
                KeyStore.get(ActiveDataBase.Name + 'Db_Version', function (dbVersion) {
                    new OpenDb(dbVersion, onSuccess, onError);
                });
            }

            public closeDb = function () {
                if (Status.ConStatus == ConnectionStatus.Connected) {
                    DbConnection.close();
                }
            }

            public dropDb = function (onSuccess: Function, onError: Function) {
                new DropDb(ActiveDataBase.Name, onSuccess, onError);
            }

            public update = function (query: IUpdate, onSuccess: Function, onError: Function) {
                new Update(query, onSuccess, onError);
            }

            public insert = function (query: IInsert, onSuccess: Function, onError: Function) {
                if (!Array.isArray(query.Values)) {
                    throw "Value should be array :- supplied value is not array";
                }
                else if (query.Values.length > 0) {
                    new Insert(query, onSuccess, onError);
                }
                else {
                    if (onError != null) {
                        onError(Utils.getError(ErrorType.NoValueSupplied, true, null));
                    }
                }
            }

            public delete = function (query: IDelete, onSuccess: Function, onError: Function) {
                new Delete(query, onSuccess, onError);
            }

            public select = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    new SelectJoin(<ISelectJoin>query, onSuccess, onError);
                }
                else {
                    new Select(query, onSuccess, onError);
                }
            }

            public count = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    new SelectJoin(query, onSuccess, onError);
                }
                else {
                    new Count(query, onSuccess, onError);
                }
            }

            public createDb = function (dataBase, onSuccess: Function, onError: Function) {
                new DataBase(dataBase).create(onSuccess, onError);
            }

            public clear = function (tableName: string, onSuccess: Function, onError: Function) {
                new Clear(tableName, onSuccess, onError);
            }
        }
    }
}
