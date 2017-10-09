
module JsStore {
    export module Business {
        export var DbConnection,
            ActiveDataBase: DataBase;


        export class Main {
            OnSuccess: Function;
            constructor(onSuccess = null) {
                this.OnSuccess = onSuccess;
            }

            public checkConnectionAndExecuteLogic = function (request: IWebWorkerRequest) {
                if (EnableLog) {
                    console.log('checking connection and executing request:' + request.Name);
                }
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this.executeLogic(request);
                        break;
                    case 'change_log_status':
                        this.changeLogStatus(request);
                    default:
                        switch (Status.ConStatus) {
                            case ConnectionStatus.Connected: {
                                this.executeLogic(request);
                            }; break;
                            case ConnectionStatus.Closed: {
                                var That = this;
                                this.openDb(ActiveDataBase.Name, function () {
                                    That.checkConnectionAndExecuteLogic(request);
                                });
                            }; break;
                        }
                }
            }

            private changeLogStatus = function (request) {
                if (request.Query['logging'] === true) {
                    EnableLog = true;
                }
                else {
                    EnableLog = false;
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
                    case 'update': this.update(request.Query, OnSuccess, OnError);
                        break;
                    case 'delete': this.delete(request.Query, OnSuccess, OnError);
                        break;
                    case 'create_db': this.createDb(request.Query, OnSuccess, OnError);
                        break;
                    case 'clear': this.clear(request.Query, OnSuccess, OnError);
                        break;
                    case 'drop_db': this.dropDb(OnSuccess, OnError);
                        break;
                    case 'count': this.count(request.Query, OnSuccess, OnError);
                        break;
                    case 'open_db': this.openDb(request.Query, OnSuccess, OnError);
                        break;
                }
            }

            openDb = function (dbName, onSuccess: Function, onError: Function) {
                KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
                    if (dbVersion != null) {
                        KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                            ActiveDataBase = result;
                            new OpenDb(dbVersion, onSuccess, onError);
                        });
                    }
                    else {
                        var Error = Utils.getError(ErrorType.DbNotExist, { DbName: dbName });
                        throw Error;
                    }
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
                new Update.Instance(query, onSuccess, onError);
            }

            public insert = function (query: IInsert, onSuccess: Function, onError: Function) {
                if (!Array.isArray(query.Values)) {
                    throwError("Value should be array :- supplied value is not array");
                }
                else {
                    new Insert(query, onSuccess, onError);
                }
            }

            public delete = function (query: IDelete, onSuccess: Function, onError: Function) {
                new Delete.Instance(query, onSuccess, onError);
            }

            public select = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    new Select.Join(<ISelectJoin>query, onSuccess, onError);
                }
                else {
                    new Select.Instance(query, onSuccess, onError);
                }
            }

            public count = function (query, onSuccess: Function, onError: Function) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    new Select.Join(query, onSuccess, onError);
                }
                else {
                    new Count.Instance(query, onSuccess, onError);
                }
            }

            public createDb = function (dataBase: Model.IDataBase, onSuccess: Function, onError: Function) {
                var That = this;
                KeyStore.get("JsStore_" + dataBase.Name + "_Db_Version", function (version) {
                    DbVersion = version;
                    ActiveDataBase = new Model.DataBase(dataBase);
                    var createDbInternal = function () {
                        setTimeout(function () {
                            var LastTable = (<Model.ITable>ActiveDataBase.Tables[ActiveDataBase.Tables.length - 1]);
                            KeyStore.get("JsStore_" + ActiveDataBase.Name + "_" + LastTable.Name + "_Version", function (version) {
                                if (version == LastTable.Version) {
                                    new CreateDb(DbVersion, onSuccess, onError)
                                }
                                else {
                                    createDbInternal();
                                }
                            });
                        }, 200);
                    }
                    createDbInternal();
                });

            }

            public clear = function (tableName: string, onSuccess: Function, onError: Function) {
                new Clear(tableName, onSuccess, onError);
            }
        }
    }
}
