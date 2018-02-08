namespace KeyStore {
    export namespace Business {
        export var db_connection,
            is_db_deleted_by_browser: boolean = false,
            db_status: IDbStatus = {
                ConStatus: Connection_Status.NotStarted,
                LastError: ""
            },
            callDbDroppedByBrowser = function () {
                if (db_status.ConStatus === Connection_Status.Connected) {
                    is_db_deleted_by_browser = true;
                }
            };

        export class Main {
            _onSuccess: (result) => void;
            constructor(onSuccess = null) {
                this._onSuccess = onSuccess;
            }

            public set(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                var obj_insert = new Set(query, onSuccess, onError);
            }

            public remove(query: IDelete, onSuccess: (result) => void, onError: (err: IError) => void) {
                var obj_delete = new Remove(query, onSuccess, onError);
            }

            public get(query: ISelect, onSuccess: (result) => void, onError: (err: IError) => void) {
                var get_object = new Get(query, onSuccess, onError);
            }

            public createDb(tableName, onSuccess: () => void, onError: (err: IError) => void) {
                var db_name = "KeyStore";
                var init_db_object = new InitDb(db_name, tableName, onSuccess, onError);
            }

            public checkConnectionAndExecuteLogic(request: IWebWorkerRequest) {
                if (request.Name === 'create_db' || request.Name === 'open_db') {
                    this.executeLogic(request);
                }
                else {
                    switch (db_status.ConStatus) {
                        case Connection_Status.Connected: this.executeLogic(request); break;
                        case Connection_Status.NotStarted:
                            setTimeout(function () {
                                this.checkConnectionAndExecuteLogic(request);
                            }.bind(this), 100); break;
                        case Connection_Status.Closed:
                            if (is_db_deleted_by_browser) {
                                this.createDb(table_name, function () {
                                    this.checkConnectionAndExecuteLogic(request);
                                }.bind(this), function (err) {
                                    console.error(err);
                                });
                            }
                    }
                }
            }

            private returnResult(result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
            }

            private executeLogic = function (request: IWebWorkerRequest) {
                var onSuccess = function (results) {
                    this.returnResult({
                        ReturnedValue: results
                    } as IWebWorkerResult);
                }.bind(this),
                    onError = function (err) {
                        this.returnResult({
                            ErrorDetails: err,
                            ErrorOccured: true
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
