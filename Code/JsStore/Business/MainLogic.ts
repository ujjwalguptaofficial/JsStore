
namespace JsStore {
    export namespace Business {
        export var db_connection: IDBDatabase,
            active_db: DataBase;

        export class Main {
            _onSuccess: () => void;

            constructor(onSuccess = null) {
                this._onSuccess = onSuccess;
            }

            public checkConnectionAndExecuteLogic = function (request: IWebWorkerRequest) {
                log('checking connection and executing request:' + request.Name);
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this.executeLogic(request);
                        break;
                    case 'change_log_status':
                        this.changeLogStatus(request);
                    default:
                        switch (status.ConStatus) {
                            case Connection_Status.Connected: {
                                this.executeLogic(request);
                            } break;
                            case Connection_Status.Closed: {
                                this.openDb(active_db._name, function () {
                                    this.checkConnectionAndExecuteLogic(request);
                                }.bind(this));
                            } break;
                        }
                }
            };

            private changeLogStatus = function (request: IWebWorkerRequest) {
                if (request.Query['logging'] === true) {
                    enable_log = true;
                }
                else {
                    enable_log = false;
                }
            };

            private returnResult = function (result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
                else {
                    (self as any).postMessage(result);
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
                            ErrorDetails: err,
                            ErrorOccured: true
                        } as IWebWorkerResult);
                    }.bind(this);

                switch (request.Name) {
                    case 'select':
                        this.select(request.Query, onSuccess, onError);
                        break;
                    case 'insert': this.insert(request.Query, onSuccess, onError);
                        break;
                    case 'update': this.update(request.Query, onSuccess, onError);
                        break;
                    case 'delete': this.delete(request.Query, onSuccess, onError);
                        break;
                    case 'open_db': this.openDb(request.Query, onSuccess, onError);
                        break;
                    case 'create_db': this.createDb(request.Query, onSuccess, onError);
                        break;
                    case 'clear': this.clear(request.Query, onSuccess, onError);
                        break;
                    case 'drop_db': this.dropDb(onSuccess, onError);
                        break;
                    case 'count': this.count(request.Query, onSuccess, onError);
                        break;
                    case 'bulk_insert': this.bulkInsert(request.Query, onSuccess, onError);
                        break;
                    case 'export_json': this.exportJson(request.Query, onSuccess, onError);
                        break;
                    default: console.error('The Api:-' + request.Name + 'does not support');
                }
            };

            private openDb = function (dbName, onSuccess: () => void, onError: (err: IError) => void) {
                // KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
                getDbVersion(dbName, function (dbVersion) {
                    if (dbVersion != null) {
                        // KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                        getDbSchema(dbName, function (result) {
                            active_db = result;
                            var open_db_object = new OpenDb(dbVersion, onSuccess, onError);
                        });
                    }
                    else {
                        var error = new Error(Error_Type.DbNotExist, { DbName: dbName });
                        error.throw();
                    }
                });
            };

            private closeDb = function () {
                if (status.ConStatus === Connection_Status.Connected) {
                    db_connection.close();
                }
            };

            private dropDb = function (onSuccess: () => void, onError: (err: IError) => void) {
                var drop_db_object = new DropDb(active_db._name, onSuccess, onError);
            };

            private update = function (query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
                var update_db_object = new Update.Instance(query, onSuccess, onError);
            };

            private insert = function (query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                if (!Array.isArray(query.Values)) {
                    throwError("Value should be array :- supplied value is not array");
                }
                else {
                    var insert_object = new Insert(query, onSuccess, onError);
                }
            };

            private bulkInsert = function (query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                if (!Array.isArray(query.Values)) {
                    throwError("Value should be array :- supplied value is not array");
                }
                else {
                    var bulk_insert_object = new BulkInsert(query, onSuccess, onError);
                }
            };

            private delete = function (query: IDelete, onSuccess: () => void, onError: (err: IError) => void) {
                var delete_object = new Delete.Instance(query, onSuccess, onError);
            };

            private select = function (query, onSuccess: () => void, onError: (err: IError) => void) {
                if (typeof query.From === 'object') {
                    var select_join_object = new Select.Join(query as ISelectJoin, onSuccess, onError);
                }
                else {
                    var select_object = new Select.Instance(query, onSuccess, onError);
                }
            };

            private count = function (query, onSuccess: () => void, onError: (err: IError) => void) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    var select_join_object = new Select.Join(query, onSuccess, onError);
                }
                else {
                    var count_object = new Count.Instance(query, onSuccess, onError);
                }
            };

            private createDb = function (
                dataBase: IDataBaseOption, onSuccess: () => void, onError: (err: IError) => void
            ) {
                this.closeDb();
                KeyStore.get("JsStore_" + dataBase.Name + "_Db_Version", function (version) {
                    db_version = version ? version : 1;
                    active_db = new Model.DataBase(dataBase);
                    var createDbInternal = function () {
                        setTimeout(function () {
                            var last_table = (active_db._tables[active_db._tables.length - 1]);
                            KeyStore.get("JsStore_" + active_db._name + "_" + last_table._name + "_Version",
                                function (tableVersion) {
                                    if (tableVersion === last_table._version) {
                                        var create_db_object = new CreateDb(db_version, onSuccess, onError);
                                    }
                                    else {
                                        createDbInternal();
                                    }
                                });
                        }, 200);
                    };
                    createDbInternal();
                });

            };

            private clear = function (tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
                var clear_object = new Clear(tableName, onSuccess, onError);
            };

            private exportJson = function (
                query: ISelect, onSuccess: (url: string) => void, onError: (err: IError) => void) {
                this.select(query, function (results) {
                    var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                        type: "text/json"
                    }));
                    onSuccess(url);
                }, function (err) {
                    onError(err);
                });
            };
        }
    }
}
