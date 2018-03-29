import { IdbHelper } from "./business/idb_helper";
import { LogHelper } from "./log_helper";
import { Connection_Status, Error_Type, Data_Type } from "./enums";
import { Config } from "./config";
import { OpenDb } from "./business/open_db";
import { DropDb } from "./business/drop_db";
import * as KeyStore from "./keystore/index";
import { DbHelper } from "./model/db_helper";
import { CreateDb } from "./business/create_db";
import { DataBase } from "./model/database";
import * as Select from './business/select/index';
import * as Count from './business/count/index';
import * as Insert from './business/insert/index';
import * as Remove from './business/remove/index';
import * as Update from './business/update/index';
import { Util } from "./util";
import { Clear } from "./business/clear";
import { BulkInsert } from "./business/bulk_insert";
var QueryExecutor = /** @class */ (function () {
    function QueryExecutor() {
    }
    QueryExecutor.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        LogHelper.log('checking connection and executing request:' + request.Name);
        switch (request.Name) {
            case 'create_db':
            case 'is_db_exist':
            case 'get_db_version':
            case 'get_db_list':
            case 'get_db_schema':
            case 'open_db':
                this.executeLogic(request);
                break;
            case 'change_log_status':
                this.changeLogStatus(request.Query['logging']);
                break;
            default:
                switch (IdbHelper._dbStatus.ConStatus) {
                    case Connection_Status.Connected:
                        {
                            this.executeLogic(request);
                        }
                        break;
                    case Connection_Status.Closed:
                        {
                            if (IdbHelper._isDbDeletedByBrowser === true) {
                                this.createDb(null, function () {
                                    IdbHelper._isDbDeletedByBrowser = false;
                                    this.checkConnectionAndExecuteLogic(request);
                                }.bind(this), request.OnError);
                            }
                            else {
                                this.openDb(IdbHelper._activeDb._name, function () {
                                    _this.checkConnectionAndExecuteLogic(request);
                                }, request.OnError);
                            }
                        }
                        break;
                }
        }
    };
    QueryExecutor.prototype.changeLogStatus = function (enableLog) {
        Config._isLogEnabled = enableLog;
    };
    QueryExecutor.prototype.returnResult = function (result) {
        self.postMessage(result);
    };
    QueryExecutor.prototype.executeLogic = function (request) {
        var _this = this;
        var onSuccess = function (results) {
            _this.returnResult({
                ReturnedValue: results
            });
        };
        var onError = function (err) {
            _this.returnResult({
                ErrorDetails: err,
                ErrorOccured: true
            });
        };
        switch (request.Name) {
            case 'select':
                this.select(request.Query, onSuccess, onError);
                break;
            case 'insert':
                this.insert(request.Query, onSuccess, onError);
                break;
            case 'update':
                this.update(request.Query, onSuccess, onError);
                break;
            case 'remove':
                this.remove(request.Query, onSuccess, onError);
                break;
            case 'is_db_exist':
                this.isDbExist(request.Query, onSuccess, onError);
                break;
            case 'get_db_version':
                IdbHelper.getDbVersion(request.Query, onSuccess);
                break;
            case 'get_db_list':
                IdbHelper.getDbList(onSuccess);
                break;
            case 'get_db_schema':
                IdbHelper.getDbSchema(request.Query, onSuccess);
                break;
            case 'open_db':
                if (IdbHelper._isDbDeletedByBrowser === true) {
                    this.createDb(null, function () {
                        IdbHelper._isDbDeletedByBrowser = false;
                        onSuccess();
                    }, onError);
                }
                else {
                    this.openDb(request.Query, onSuccess, onError);
                }
                break;
            case 'create_db':
                this.createDb(request.Query, onSuccess, onError);
                break;
            case 'clear':
                this.clear(request.Query, onSuccess, onError);
                break;
            case 'drop_db':
                this.dropDb(onSuccess, onError);
                break;
            case 'count':
                this.count(request.Query, onSuccess, onError);
                break;
            case 'bulk_insert':
                this.bulkInsert(request.Query, onSuccess, onError);
                break;
            case 'export_json':
                this.exportJson(request.Query, onSuccess, onError);
                break;
            default: console.error('The Api:-' + request.Name + ' does not support.');
        }
    };
    QueryExecutor.prototype.openDb = function (dbName, onSuccess, onError) {
        IdbHelper.getDbVersion(dbName, function (dbVersion) {
            if (dbVersion !== 0) {
                IdbHelper._dbVersion = dbVersion;
                IdbHelper.getDbSchema(dbName, function (result) {
                    IdbHelper._activeDb = result;
                    var open_db_object = new OpenDb(onSuccess, onError);
                    open_db_object.execute();
                });
            }
            else {
                var err = new LogHelper(Error_Type.DbNotExist, { DbName: dbName });
                err.logError();
                onError(err.get());
            }
        });
    };
    QueryExecutor.prototype.closeDb = function () {
        if (IdbHelper._dbStatus.ConStatus === Connection_Status.Connected) {
            IdbHelper._dbStatus.ConStatus = Connection_Status.ClosedByJsStore;
            IdbHelper._dbConnection.close();
        }
    };
    QueryExecutor.prototype.dropDb = function (onSuccess, onError) {
        this.closeDb();
        var drop_db_object = new DropDb(onSuccess, onError);
        drop_db_object.deleteDb();
    };
    QueryExecutor.prototype.update = function (query, onSuccess, onError) {
        var update_db_object = new Update.Instance(query, onSuccess, onError);
        update_db_object.execute();
    };
    QueryExecutor.prototype.insert = function (query, onSuccess, onError) {
        var insert_object = new Insert.Instance(query, onSuccess, onError);
        insert_object.execute();
    };
    QueryExecutor.prototype.bulkInsert = function (query, onSuccess, onError) {
        var bulk_insert_object = new BulkInsert(query, onSuccess, onError);
        bulk_insert_object.execute();
    };
    QueryExecutor.prototype.remove = function (query, onSuccess, onError) {
        var delete_object = new Remove.Instance(query, onSuccess, onError);
        delete_object.execute();
    };
    QueryExecutor.prototype.select = function (query, onSuccess, onError) {
        if (typeof query.From === 'object') {
            var select_join_object = new Select.Join(query, onSuccess, onError);
        }
        else {
            var select_instance = new Select.Instance(query, onSuccess, onError);
            select_instance.execute();
        }
    };
    QueryExecutor.prototype.count = function (query, onSuccess, onError) {
        if (typeof query.From === 'object') {
            query['Count'] = true;
            var select_join_object = new Select.Join(query, onSuccess, onError);
        }
        else {
            var count_object = new Count.Instance(query, onSuccess, onError);
            count_object.execute();
        }
    };
    QueryExecutor.prototype.createDb = function (dataBase, onSuccess, onError) {
        var processCreateDb = function () {
            // save dbSchema in keystore
            KeyStore.set("JsStore_" + IdbHelper._activeDb._name + "_Schema", IdbHelper._activeDb);
            // create meta data
            var db_helper = new DbHelper(IdbHelper._activeDb);
            db_helper.createMetaData(function (tablesMetaData) {
                var create_db_object = new CreateDb(tablesMetaData, onSuccess, onError);
            });
        };
        if (dataBase == null) {
            processCreateDb();
        }
        else {
            this.closeDb();
            IdbHelper.getDbVersion(dataBase.Name, function (version) {
                IdbHelper._dbVersion = version ? version : 1;
                IdbHelper._activeDb = new DataBase(dataBase);
                processCreateDb();
            });
        }
    };
    QueryExecutor.prototype.clear = function (tableName, onSuccess, onError) {
        var clear_object = new Clear(tableName, onSuccess, onError);
        clear_object.execute();
    };
    QueryExecutor.prototype.exportJson = function (query, onSuccess, onError) {
        this.select(query, function (results) {
            var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                type: "text/json"
            }));
            onSuccess(url);
        }, function (err) {
            onError(err);
        });
    };
    QueryExecutor.prototype.isDbExist = function (dbInfo, onSuccess, onError) {
        if (IdbHelper._dbStatus.ConStatus !== Connection_Status.UnableToStart) {
            if (Util.getType(dbInfo) === Data_Type.String) {
                IdbHelper.getDbVersion(dbInfo, function (dbVersion) {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                IdbHelper.getDbVersion(dbInfo.DbName, function (dbVersion) {
                    onSuccess(dbInfo.Table.Version <= dbVersion);
                });
            }
        }
        else {
            var error = {
                _message: null,
                _type: IdbHelper._dbStatus.LastError,
            };
            switch (error._type) {
                case Error_Type.IndexedDbBlocked:
                    error._message = "IndexedDB is blocked";
                    break;
                case Error_Type.IndexedDbUndefined:
                    error._message = "IndexedDB is not supported";
                    break;
            }
            onError(error);
        }
    };
    return QueryExecutor;
}());
export { QueryExecutor };
//# sourceMappingURL=query_executor.js.map