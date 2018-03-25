import { IdbHelper } from "./business/idb_helper";
import { LogHelper } from "./log_helper";
import {
    IWebWorkerRequest, IWebWorkerResult,
    ITranscationQry, IError, IUpdate,
    IInsert, IRemove, IDataBaseOption, ISelect, ISelectJoin, IDbInfo
} from "./interfaces";
import { Connection_Status, Error_Type, Data_Type } from "./enums";
import { Config } from "./config";
import { OpenDb } from "./business/open_db";
import { DropDb } from "./business/drop_db";
import * as KeyStore from "./keystore/index";
import { DbHelper } from "./model/db_helper";
import { TableHelper } from "./model/table_helper";
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

export class QueryExecutor {

    public checkConnectionAndExecuteLogic(request: IWebWorkerRequest) {
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
                this.changeLogStatus(request.Query['logging']); break;
            default:
                switch (IdbHelper._dbStatus.ConStatus) {
                    case Connection_Status.Connected: {
                        this.executeLogic(request);
                    } break;
                    case Connection_Status.Closed: {
                        if (IdbHelper._isDbDeletedByBrowser === true) {
                            this.createDb(null, function () {
                                IdbHelper._isDbDeletedByBrowser = false;
                                this.checkConnectionAndExecuteLogic(request);
                            }.bind(this), request.OnError);
                        }
                        else {
                            this.openDb(IdbHelper._activeDb._name, () => {
                                this.checkConnectionAndExecuteLogic(request);
                            }, request.OnError);
                        }
                    } break;
                }
        }
    }

    private changeLogStatus(enableLog) {
        Config._isLogEnabled = enableLog;
    }

    private returnResult(result) {
        (self as any).postMessage(result);
    }

    private executeLogic(request: IWebWorkerRequest) {
        var onSuccess = (results?) => {
            this.returnResult({
                ReturnedValue: results
            } as IWebWorkerResult);
        };
        var onError = (err) => {
            this.returnResult({
                ErrorDetails: err,
                ErrorOccured: true
            } as IWebWorkerResult);
        };

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
            case 'is_db_exist': this.isDbExist(request.Query, onSuccess, onError);
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
                    this.createDb(null, () => {
                        IdbHelper._isDbDeletedByBrowser = false;
                        onSuccess();
                    }, onError);
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
            case 'export_json': this.exportJson(request.Query, onSuccess, onError);
                break;
            default: console.error('The Api:-' + request.Name + ' does not support.');
        }
    }

    private openDb(dbName, onSuccess: () => void, onError: (err: IError) => void) {
        IdbHelper.getDbVersion(dbName, (dbVersion) => {
            if (dbVersion !== 0) {
                IdbHelper._dbVersion = dbVersion;
                IdbHelper.getDbSchema(dbName, (result) => {
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
    }

    private closeDb() {
        if (IdbHelper._dbStatus.ConStatus === Connection_Status.Connected) {
            IdbHelper._dbStatus.ConStatus = Connection_Status.ClosedByJsStore;
            IdbHelper._dbConnection.close();
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
        var insert_object = new Insert.Instance(query, onSuccess, onError);
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
        var processCreateDb = () => {
            // save dbSchema in keystore
            KeyStore.set("JsStore_" + IdbHelper._activeDb._name + "_Schema", IdbHelper._activeDb);
            // create meta data
            var db_helper = new DbHelper(IdbHelper._activeDb);
            db_helper.createMetaData((tablesMetaData: TableHelper[]) => {
                var create_db_object = new CreateDb(tablesMetaData, onSuccess, onError);
            });
        };
        if (dataBase == null) {
            processCreateDb();
        }
        else {
            this.closeDb();
            IdbHelper.getDbVersion(dataBase.Name, (version) => {
                IdbHelper._dbVersion = version ? version : 1;
                IdbHelper._activeDb = new DataBase(dataBase);
                processCreateDb();
            });
        }
    }

    private clear(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        var clear_object = new Clear(tableName, onSuccess, onError);
        clear_object.execute();
    }

    private exportJson(query: ISelect, onSuccess: (url: string) => void, onError: (err: IError) => void) {
        this.select(query, (results) => {
            var url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                type: "text/json"
            }));
            onSuccess(url);
        }, (err) => {
            onError(err);
        });
    }

    private isDbExist(dbInfo: any, onSuccess: (isExist: boolean) => void, onError: (err: IError) => void) {
        if (IdbHelper._dbStatus.ConStatus !== Connection_Status.UnableToStart) {
            if (Util.getType(dbInfo) === Data_Type.String) {
                IdbHelper.getDbVersion(dbInfo, (dbVersion) => {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                IdbHelper.getDbVersion(dbInfo.DbName, (dbVersion) => {
                    onSuccess(dbInfo.Table.Version <= dbVersion);
                });
            }
        }
        else {
            var error = {
                _message: null,
                _type: IdbHelper._dbStatus.LastError,
            } as IError;
            switch (error._type) {
                case Error_Type.IndexedDbBlocked:
                    error._message = "IndexedDB is blocked"; break;
                case Error_Type.IndexedDbUndefined:
                    error._message = "IndexedDB is not supported"; break;
            }
            onError(error);
        }
    }
}