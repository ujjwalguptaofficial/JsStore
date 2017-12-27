namespace KeyStore {
    export namespace Business {
        export var db_connection,
            status: IKeyStoreStatus = {
                ConStatus: ConnectionStatus.NotStarted,
                LastError: ""
            } as IKeyStoreStatus;
        export class Main {
            _onSuccess: () => void;
            constructor(onSuccess = null) {
                this._onSuccess = onSuccess;
            }

            public set = function (query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                var obj_insert = new Set(query, onSuccess, onError);
            };

            public remove = function (query: IDelete, onSuccess: (result) => void, onError: (err: IError) => void) {
                var obj_delete = new Remove(query, onSuccess, onError);
            };

            public get = function (query: ISelect, onSuccess: (result) => void, onError: (err: IError) => void) {
                var get_object = new Get(query, onSuccess, onError);
            };

            public createDb = function (tableName, onSuccess: () => void, onError: (err: IError) => void) {
                var db_name = "KeyStore";
                var init_db_object = new InitDb(db_name, tableName, onSuccess, onError);
            };

            public checkConnectionAndExecuteLogic = function (request: IWebWorkerRequest) {
                if (request.Name === 'create_db' || request.Name === 'open_db') {
                    this.executeLogic(request);
                }
                else {
                    if (status.ConStatus === ConnectionStatus.Connected) {
                        this.executeLogic(request);
                    }
                    else if (status.ConStatus === ConnectionStatus.NotStarted) {
                        setTimeout(function () {
                            this.checkConnectionAndExecuteLogic(request);
                        }.bind(this), 100);
                    }
                    else if (status.ConStatus === ConnectionStatus.Closed) {
                        this.createDb(table_name, function () {
                            this.checkConnectionAndExecuteLogic(request);
                        }.bind(this), 100);
                    }
                }
            };

            private returnResult = function (result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
            };

            private executeLogic = function (request: IWebWorkerRequest) {
                var onSuccess = function (results) {
                    this.returnResult({
                        ReturnedValue: results
                    } as IWebWorkerResult);
                }.bind(this),
                    onError = function (err) {
                        this.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        } as IWebWorkerResult);
                    }.bind(this);

                switch (request.Name) {
                    case 'get':
                        this.get(request.Query, onSuccess, onError);
                        break;
                    case 'set': this.set(request.Query, onSuccess, onError);
                        break;
                    case 'remove': this.remove(request.Query, onSuccess, onError);
                        break;
                    case 'create_db': this.createDb(request.Query, onSuccess, onError); break;
                }
            };
        }
    }
}
