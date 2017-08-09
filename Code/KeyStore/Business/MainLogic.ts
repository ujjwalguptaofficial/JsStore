module KeyStore {
    export module Business {
        export var DbConnection,
            Status: KeyStoreStatus = <KeyStoreStatus>{
                ConStatus: ConnectionStatus.NotStarted,
                LastError: ""
            };
        export class Main {
            OnSuccess: Function;
            constructor(onSuccess = null) {
                this.OnSuccess = onSuccess;
            }

            public checkConnectionAndExecuteLogic = function (request: IWebWorkerRequest) {
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
                        this.createDb(TableName);
                        setTimeout(function () {
                            That.checkConnectionAndExecuteLogic(request);
                        }, 50);
                    }
                }
            }

            private returnResult = function (result) {
                if (this.OnSuccess) {
                    this.OnSuccess(result);
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
                    case 'get':
                        this.get(request.Query, OnSuccess, OnError);
                        break;
                    case 'set': this.set(request.Query, OnSuccess, OnError);
                        break;
                    case 'remove': this.remove(request.Query, OnSuccess, OnError);
                        break;
                    case 'create_db': this.createDb(request.Query, OnSuccess, OnError); break;
                }
            }

            public set = function (query: IInsert, onSuccess: Function, onError: Function) {
                var ObjInsert = new Set(query, onSuccess, onError);
            }

            public remove = function (query: IDelete, onSuccess: Function, onError: Function) {
                var ObjDelete = new Remove(query, onSuccess, onError);
            }

            public get = function (query: ISelect, onSuccess: Function, onError: Function) {
                new Get(query, onSuccess, onError);
            }

            public createDb = function (tableName, onSuccess: Function, onError: Function) {
                var DbName = "KeyStore";
                new InitDb(DbName, tableName, onSuccess, onError);
            }
        }
    }
}
