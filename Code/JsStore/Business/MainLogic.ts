namespace JsStore {
    export namespace Business {
        export var
            on_db_dropped_by_browser: () => void,
            is_db_deleted_by_browser: boolean,
            db_connection: IDBDatabase,
            active_db: DataBase,
            db_transaction: IDBTransaction = null,
            callDbDroppedByBrowser = function (deleteMetaData?: boolean) {
                if (db_status.ConStatus === Connection_Status.Connected) {
                    is_db_deleted_by_browser = true;
                    if (deleteMetaData === true) {
                        var drop_db_object = new DropDb(on_db_dropped_by_browser, null);
                        drop_db_object.deleteMetaData();
                    }
                }
            },
            createTransaction = function (tableNames, callBack: () => void, mode?) {
                if (db_transaction === null) {
                    mode = mode ? mode : "readwrite";
                    db_transaction = db_connection.transaction(tableNames, mode);
                    db_transaction.oncomplete = function () {
                        db_transaction = null;
                        callBack();
                    };
                    (db_transaction as any).ontimeout = function () {
                        db_transaction = null;
                        console.error('transaction timed out');
                    };
                }
            };

        export class Main {
            _onSuccess: (result) => void;

            constructor(onSuccess = null) {
                this._onSuccess = onSuccess;
            }

            public checkConnectionAndExecuteLogic(request: IWebWorkerRequest) {
                log('checking connection and executing request:' + request.Name);
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this.executeLogic(request);
                        break;
                    case 'change_log_status':
                        this.changeLogStatus(request.Query['logging']); break;
                    case 'set_config':
                        this.setConfig(request.Query); break;
                    default:
                        switch (db_status.ConStatus) {
                            case Connection_Status.Connected: {
                                this.executeLogic(request);
                            } break;
                            case Connection_Status.Closed: {
                                if (is_db_deleted_by_browser === true) {
                                    this.createDb(null, function () {
                                        is_db_deleted_by_browser = false;
                                        this.checkConnectionAndExecuteLogic(request);
                                    }.bind(this), request.OnError);
                                }
                                else {
                                    this.openDb(active_db._name, function () {
                                        this.checkConnectionAndExecuteLogic(request);
                                    }.bind(this), request.OnError);
                                }
                            } break;
                        }
                }
            }

            private changeLogStatus(enableLog) {
                enable_log = enableLog;
            }

            private setConfig(config: IConfig) {
                for (var prop in config) {
                    switch (prop) {
                        case 'EnableLog': this.changeLogStatus(config[prop]); break;
                        case 'FileName': file_name = config[prop]; break;
                        case 'OnDbDroppedByBrowser': eval("on_db_dropped_by_browser=" + config.OnDbDroppedByBrowser);
                            break;
                        default:
                            var err = new Error(Error_Type.InvalidConfig, { Config: prop });
                            err.logError();
                    }
                }
            }

            private returnResult(result) {
                if (this._onSuccess) {
                    this._onSuccess(result);
                }
                else {
                    (self as any).postMessage(result);
                }
            }

            private executeLogic(request: IWebWorkerRequest) {
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
                    case 'remove': this.remove(request.Query, onSuccess, onError);
                        break;
                    case 'open_db':
                        if (is_db_deleted_by_browser === true) {
                            this.createDb(null, function () {
                                is_db_deleted_by_browser = false;
                                onSuccess();
                            }.bind(this), onError);
                        }
                        else {
                            this.openDb(request.Query, onSuccess, onError);
                        }
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
                    case 'transaction': this.transaction(request.Query, onSuccess, onError);
                        break;
                    case 'export_json': this.exportJson(request.Query, onSuccess, onError);
                        break;
                    default: console.error('The Api:-' + request.Name + ' does not support.');
                }
            }

            private transaction(qry: ITranscationQry, onSuccess, onError) {
                var transaction_obj = new Transaction(qry, onSuccess, onError);
                transaction_obj.execute();
            }

            private openDb(dbName, onSuccess: () => void, onError: (err: IError) => void) {
                getDbVersion(dbName, function (dbVersion) {
                    if (dbVersion !== 0) {
                        getDbSchema(dbName, function (result) {
                            active_db = result;
                            var open_db_object = new OpenDb(dbVersion, onSuccess, onError);
                        });
                    }
                    else {
                        var err = new Error(Error_Type.DbNotExist, { DbName: dbName });
                        err.logError();
                        onError(err.get());
                    }
                });
            }

            private closeDb() {
                if (db_status.ConStatus === Connection_Status.Connected) {
                    db_status.ConStatus = Connection_Status.ClosedByJsStore;
                    db_connection.close();
                }
            }

            private dropDb(onSuccess: () => void, onError: (err: IError) => void) {
                this.closeDb();
                var drop_db_object = new DropDb(onSuccess, onError);
                drop_db_object.deleteDb();
            }

            private update(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
                var update_db_object = new Update.Instance(query, onSuccess, onError);
                update_db_object.execute();
            }

            private insert(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                var insert_object = new Business.Insert.Instance(query, onSuccess, onError);
                insert_object.execute();
            }

            private bulkInsert(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                var bulk_insert_object = new BulkInsert(query, onSuccess, onError);
                bulk_insert_object.execute();
            }

            private remove(query: IRemove, onSuccess: () => void, onError: (err: IError) => void) {
                var delete_object = new Remove.Instance(query, onSuccess, onError);
                delete_object.execute();
            }

            private select(query, onSuccess: (result) => void, onError: (err: IError) => void) {
                if (typeof query.From === 'object') {
                    var select_join_object = new Select.Join(query as ISelectJoin, onSuccess, onError);
                }
                else {
                    var select_instance = new Select.Instance(query, onSuccess, onError);
                    select_instance.execute();
                }
            }

            private count(query, onSuccess: () => void, onError: (err: IError) => void) {
                if (typeof query.From === 'object') {
                    query['Count'] = true;
                    var select_join_object = new Select.Join(query, onSuccess, onError);
                }
                else {
                    var count_object = new Count.Instance(query, onSuccess, onError);
                    count_object.execute();
                }
            }

            private createDb(
                dataBase: IDataBaseOption, onSuccess: () => void, onError: (err: IError) => void
            ) {
                var processCreateDb = function () {
                    // save dbSchema in keystore
                    KeyStore.set("JsStore_" + active_db._name + "_Schema", active_db);
                    // create meta data
                    var db_helper = new Model.DbHelper(active_db);
                    db_helper.createMetaData(function (tablesMetaData: Model.TableHelper[]) {
                        var create_db_object = new CreateDb(tablesMetaData, onSuccess, onError);
                    });
                };
                if (dataBase == null) {
                    processCreateDb();
                }
                else {
                    this.closeDb();
                    getDbVersion(dataBase.Name, function (version) {
                        db_version = version ? version : 1;
                        active_db = new Model.DataBase(dataBase);
                        processCreateDb();
                    });
                }

            }

            private clear(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
                var clear_object = new Clear(tableName, onSuccess, onError);
                clear_object.execute();
            }

            private exportJson(query: ISelect, onSuccess: (url: string) => void, onError: (err: IError) => void) {
                this.select(query, function (results) {
                    var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                        type: "text/json"
                    }));
                    onSuccess(url);
                }, function (err) {
                    onError(err);
                });
            }
        }
    }
}
