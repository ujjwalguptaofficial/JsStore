import { IdbHelper } from "./business/idb_helper";
import { LogHelper } from "./log_helper";
import {
    ITranscationQry, IError, IUpdate,
    IInsert, IRemove, IDataBase, ISelect, ISelectJoin, IDbInfo, ITable
} from "./interfaces";
import { CONNECTION_STATUS, ERROR_TYPE, DATA_TYPE } from "./enums";
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
import { IWebWorkerResult, IWebWorkerRequest } from "./interfaces";

export class QueryExecutor {

    checkConnectionAndExecuteLogic(request: IWebWorkerRequest) {
        LogHelper.log('checking connection and executing request:' + request.name);
        switch (request.name) {
            case 'create_db':
            case 'is_db_exist':
            case 'get_db_version':
            case 'get_db_list':
            case 'get_db_schema':
            case 'open_db':
                this.executeLogic_(request);
                break;
            case 'change_log_status':
                this.changeLogStatus_(request.query['logging']); break;
            default:
                switch (this.dbStatus_.conStatus) {
                    case CONNECTION_STATUS.Connected: {
                        this.executeLogic_(request);
                    } break;
                    case CONNECTION_STATUS.Closed: {
                        if (this.isDbDeletedByBrowser_ === true) {
                            this.createDb_(null, () => {
                                this.isDbDeletedByBrowser_ = false;
                                this.checkConnectionAndExecuteLogic(request);
                            }, request.onError);
                        }
                        else {
                            this.openDb_(this.activeDb_.name, () => {
                                this.checkConnectionAndExecuteLogic(request);
                            }, request.onError);
                        }
                    } break;
                    default:
                        break;
                }
        }
    }

    private changeLogStatus_(enableLog) {
        Config._isLogEnabled = enableLog;
    }

    private returnResult_(result) {
        (self as DedicatedWorkerGlobalScope).postMessage(result);
    }

    private executeLogic_(request: IWebWorkerRequest) {
        const onSuccess = (results?) => {
            this.returnResult_({
                returnedValue: results
            } as IWebWorkerResult);
        };
        const onError = (err) => {
            this.returnResult_({
                errorDetails: err,
                errorOccured: true
            } as IWebWorkerResult);
        };

        switch (request.name) {
            case 'select':
                this.select_(request.query, onSuccess, onError);
                break;
            case 'insert': this.insert_(request.query as IInsert, onSuccess, onError);
                break;
            case 'update': this.update_(request.query as IUpdate, onSuccess, onError);
                break;
            case 'remove': this.remove_(request.query as IRemove, onSuccess, onError);
                break;
            case 'is_db_exist': this.isDbExist_(request.query, onSuccess, onError);
                break;
            case 'get_db_version':
                this.getDbVersion_(request.query as string, onSuccess);
                break;
            case 'get_db_list':
                this.getDbList_(onSuccess);
                break;
            case 'get_db_schema':
                this.getDbSchema_(request.query as string, onSuccess);
                break;
            case 'open_db':
                if (this.isDbDeletedByBrowser_ === true) {
                    this.createDb_(null, () => {
                        this.isDbDeletedByBrowser_ = false;
                        onSuccess();
                    }, onError);
                }
                else {
                    this.openDb_(request.query, onSuccess, onError);
                }
                break;
            case 'create_db': this.createDb_(request.query as IDataBase, onSuccess, onError);
                break;
            case 'clear': this.clear_(request.query as string, onSuccess, onError);
                break;
            case 'drop_db': this.dropDb_(onSuccess, onError);
                break;
            case 'count': this.count_(request.query, onSuccess, onError);
                break;
            case 'bulk_insert': this.bulkInsert_(request.query as IInsert, onSuccess, onError);
                break;
            case 'export_json': this.exportJson_(request.query as ISelect, onSuccess, onError);
                break;
            default: console.error('The Api:-' + request.name + ' does not support.');
        }
    }

    private getDbSchema_(dbName: string, callback: (schema: DataBase) => void) {
        IdbHelper.getDbSchema(dbName, callback);
    }

    private get isDbDeletedByBrowser_() {
        return IdbHelper.isDbDeletedByBrowser;
    }

    private set isDbDeletedByBrowser_(value) {
        IdbHelper.isDbDeletedByBrowser = value;
    }

    private getDbList_(callback: (dbList: string[]) => void) {
        IdbHelper.getDbList(callback);
    }

    private get activeDb_() {
        return IdbHelper.activeDb;
    }

    private set activeDb_(value) {
        IdbHelper.activeDb = value;
    }

    private openDb_(dbName, onSuccess: () => void, onError: (err: IError) => void) {
        this.getDbVersion_(dbName, (dbVersion) => {
            if (dbVersion !== 0) {
                IdbHelper.activeDbVersion = dbVersion;
                this.getDbSchema_(dbName, (result) => {
                    this.activeDb_ = result;
                    const openDbProject = new OpenDb(onSuccess, onError);
                    openDbProject.execute();
                });
            }
            else {
                const err = new LogHelper(ERROR_TYPE.DbNotExist, { DbName: dbName });
                err.logError();
                onError(err.get());
            }
        });
    }

    private closeDb_() {
        if (IdbHelper.dbStatus.conStatus === CONNECTION_STATUS.Connected) {
            IdbHelper.dbStatus.conStatus = CONNECTION_STATUS.ClosedByJsStore;
            IdbHelper.dbConnection.close();
        }
    }

    private dropDb_(onSuccess: () => void, onError: (err: IError) => void) {
        this.closeDb_();
        const dropDbInstance = new DropDb(onSuccess, onError);
        dropDbInstance.deleteDb();
    }

    private update_(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
        const updateDbInstance = new Update.Instance(query, onSuccess, onError);
        updateDbInstance.execute();
    }

    private insert_(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        const insertInstance = new Insert.Instance(query, onSuccess, onError);
        insertInstance.execute();
    }

    private bulkInsert_(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        const bulkInsertInstance = new BulkInsert(query, onSuccess, onError);
        bulkInsertInstance.execute();
    }

    private remove_(query: IRemove, onSuccess: () => void, onError: (err: IError) => void) {
        const deleteObject = new Remove.Instance(query, onSuccess, onError);
        deleteObject.execute();
    }

    private select_(query, onSuccess: (result) => void, onError: (err: IError) => void) {
        if (typeof query.From === 'object') {
            const selectJoinInstance = new Select.Join(query as ISelectJoin, onSuccess, onError);
        }
        else {
            const selectInstance = new Select.Instance(query, onSuccess, onError);
            selectInstance.execute();
        }
    }

    private count_(query, onSuccess: () => void, onError: (err: IError) => void) {
        if (typeof query.From === 'object') {
            query['Count'] = true;
            const selectJoinInstance = new Select.Join(query, onSuccess, onError);
        }
        else {
            const countInstance = new Count.Instance(query, onSuccess, onError);
            countInstance.execute();
        }
    }

    private createDb_(
        dataBase: IDataBase, onSuccess: () => void, onError: (err: IError) => void
    ) {
        const processCreateDb = () => {
            // save dbSchema in keystore
            KeyStore.set("JsStore_" + this.activeDb_.name + "_Schema", this.activeDb_);
            // create meta data
            const dbHelper = new DbHelper(IdbHelper.activeDb);
            dbHelper.createMetaData((tablesMetaData: TableHelper[]) => {
                const createDbInstance = new CreateDb(tablesMetaData, onSuccess, onError);
            });
        };
        if (dataBase == null) {
            processCreateDb();
        }
        else {
            this.closeDb_();
            this.getDbVersion_(dataBase.name, (version) => {
                this.activeDbVersion_ = version ? version : 1;
                IdbHelper.activeDb = new DataBase(dataBase);
                processCreateDb();
            });
        }
    }

    private get activeDbVersion_() {
        return IdbHelper.activeDbVersion;
    }

    private set activeDbVersion_(value) {
        IdbHelper.activeDbVersion = value;
    }

    private getDbVersion_(dbName: string, callback: (version: number) => void) {
        IdbHelper.getDbVersion(dbName, callback);
    }

    private get dbStatus_() {
        return IdbHelper.dbStatus;
    }

    private clear_(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        const clearInstance = new Clear(tableName, onSuccess, onError);
        clearInstance.execute();
    }

    private exportJson_(query: ISelect, onSuccess: (url: string) => void, onError: (err: IError) => void) {
        this.select_(query, (results) => {
            const url = URL.createObjectURL(new Blob([JSON.stringify(results)], {
                type: "text/json"
            }));
            onSuccess(url);
        }, (err) => {
            onError(err);
        });
    }

    private getType(value) {
        return Util.getType(value);
    }

    private isDbExist_(dbInfo, onSuccess: (isExist: boolean) => void, onError: (err: IError) => void) {
        if (this.dbStatus_.conStatus !== CONNECTION_STATUS.UnableToStart) {
            if (this.getType(dbInfo) === DATA_TYPE.String) {
                this.getDbVersion_(dbInfo, (dbVersion) => {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                this.getDbVersion_(dbInfo.dbName, (dbVersion) => {
                    onSuccess(dbInfo.table.version <= dbVersion);
                });
            }
        }
        else {
            const error = {
                message: null,
                type: this.dbStatus_.lastError,
            } as IError;
            switch (error.type) {
                case ERROR_TYPE.IndexedDbBlocked:
                    error.message = "IndexedDB is blocked"; break;
                case ERROR_TYPE.IndexedDbUndefined:
                    error.message = "IndexedDB is not supported"; break;
                default: break;
            }
            onError(error);
        }
    }
}