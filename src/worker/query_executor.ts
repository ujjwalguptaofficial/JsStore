import { IdbHelper, OpenDb, DropDb, CreateDb, Clear, BulkInsert, QueryHelper } from "./business/index";
import * as Select from './business/select/index';
import * as Count from './business/count/index';
import * as Insert from './business/insert/index';
import * as Remove from './business/remove/index';
import * as Update from './business/update/index';
import * as Transaction from "./business/transaction/index";
import { LogHelper } from "./log_helper";
import {
    TranscationQuery, UpdateQuery,
    InsertQuery, RemoveQuery, SelectQuery, SelectJoinQuery, CountQuery, SetQuery
} from "./types";
import { CONNECTION_STATUS, ERROR_TYPE, DATA_TYPE, API } from "./enums";
import { Config } from "./config";
import { KeyStore } from "./keystore/index";
import { TableHelper, DbHelper, DataBase } from "./model/index";
import { Util } from "./util";
import { WebWorkerResult, WebWorkerRequest } from "./types";
import { IDataBase, IError } from "./interfaces";

export class QueryExecutor {
    static isTransactionQuery = false;
    onQueryFinished: (result: any) => void;

    constructor(fn?: (result: any) => void) {
        this.onQueryFinished = fn;
        QueryHelper.autoIncrementValues = {};
    }

    checkConnectionAndExecuteLogic(request: WebWorkerRequest) {
        LogHelper.log('request executing:' + request.name);
        switch (request.name) {
            case API.CreateDb:
            case API.IsDbExist:
            case API.GetDbVersion:
            case API.GetDbList:
            case API.GetDbSchema:
            case API.Get:
            case API.Set:
            case API.ChangeLogStatus:
            case API.Terminate:
            case API.OpenDb:
            case API.InitKeyStore:
                this.executeLogic_(request);
                break;
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

                }
        }
    }

    private changeLogStatus_(status: boolean, onSuccess, onError) {
        Config.isLogEnabled = status;
        onSuccess();
    }

    private returnResult_(result) {
        if (Config.isRuningInWorker === true) {
            (self as any).postMessage(result);
        }
        else {
            this.onQueryFinished(result);
        }

    }

    private executeLogic_(request: WebWorkerRequest) {
        const onSuccess = (results?) => {
            this.returnResult_({
                returnedValue: results
            } as WebWorkerResult);
        };
        const onError = (err) => {
            this.returnResult_({
                errorDetails: err,
                errorOccured: true
            } as WebWorkerResult);
        };

        QueryExecutor.isTransactionQuery = request.name === API.Transaction;
        switch (request.name) {
            case API.Select:
                this.select_(request.query as SelectQuery, onSuccess, onError);
                break;
            case API.Insert: this.insert_(request.query as InsertQuery, onSuccess, onError);
                break;
            case API.Update: this.update_(request.query as UpdateQuery, onSuccess, onError);
                break;
            case API.Remove: this.remove_(request.query as RemoveQuery, onSuccess, onError);
                break;
            case API.IsDbExist: this.isDbExist_(request.query, onSuccess, onError);
                break;
            case API.GetDbVersion:
                this.getDbVersion_(request.query as string).then(onSuccess).catch(onError);
                break;
            case API.GetDbList:
                this.getDbList_().then(onSuccess).catch(onError);
                break;
            case API.GetDbSchema:
                this.getDbSchema_(request.query as string).then(onSuccess).catch(onError);
                break;
            case API.OpenDb:
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
            case API.CreateDb: this.createDb_(request.query as IDataBase, onSuccess, onError);
                break;
            case API.Clear: this.clear_(request.query as string, onSuccess, onError);
                break;
            case API.DropDb: this.dropDb_(onSuccess, onError);
                break;
            case API.Count: this.count_(request.query as CountQuery, onSuccess, onError);
                break;
            case API.BulkInsert: this.bulkInsert_(request.query as InsertQuery, onSuccess, onError);
                break;
            case API.Get: this.get_(request.query as string).then(onSuccess).catch(onError);
                break;
            case API.Set: this.set_(request.query as SetQuery).then(onSuccess).catch(onError);
                break;
            case API.ChangeLogStatus:
                this.changeLogStatus_(request.query as boolean, onSuccess, onError);
                break;
            case API.Transaction:
                this.transaction_(request.query, onSuccess, onError);
                break;
            case API.CloseDb:
            case API.Terminate:
                this.terminate_(onSuccess, onError);
                break;
            case API.InitKeyStore:
                this.initKeyStore_(onSuccess);
                break;
            default:
                console.error('The Api:-' + request.name + ' does not support.');
        }
    }

    private initKeyStore_(onSuccess) {
        KeyStore.init();
        onSuccess();
    }

    private getDbSchema_(dbName: string) {
        return IdbHelper.getDbSchema(dbName);
    }

    private terminate_(onSuccess: () => void, onError: (err: IError) => void) {
        KeyStore.close().then(() => {
            this.closeDb_();
            onSuccess();
        });
    }

    private get isDbDeletedByBrowser_() {
        return IdbHelper.isDbDeletedByBrowser;
    }

    private set isDbDeletedByBrowser_(value) {
        IdbHelper.isDbDeletedByBrowser = value;
    }

    private getDbList_() {
        return IdbHelper.getDbList();
    }

    private get activeDb_() {
        return IdbHelper.activeDb;
    }

    private set activeDb_(value) {
        IdbHelper.activeDb = value;
    }

    private openDb_(dbName, onSuccess: () => void, onError: (err: IError) => void) {
        this.getDbVersion_(dbName).then(dbVersion => {
            if (dbVersion !== 0) {
                this.activeDbVersion_ = dbVersion;
                this.getDbSchema_(dbName).then(result => {
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
        }).catch(onError);

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

    private update_(query: UpdateQuery, onSuccess: () => void, onError: (err: IError) => void) {
        const queryHelper = new QueryHelper(API.Update, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            const updateDbInstance = new Update.Instance(query, onSuccess, onError);
            updateDbInstance.execute();
        }
        else {
            onError(
                queryHelper.error
            );
        }
    }

    private insert_(query: InsertQuery, onSuccess: () => void, onError: (err: IError) => void) {
        const queryHelper = new QueryHelper(API.Insert, query);
        queryHelper.checkAndModify().then(function () {
            query = queryHelper.query;
            const insertInstance = new Insert.Instance(query, onSuccess, onError);
            insertInstance.execute();
        }).catch(onError);
    }

    private bulkInsert_(query: InsertQuery, onSuccess: () => void, onError: (err: IError) => void) {
        const queryHelper = new QueryHelper(API.BulkInsert, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            const bulkInsertInstance = new BulkInsert(query, onSuccess, onError);
            bulkInsertInstance.execute();
        }
        else {
            onError(
                queryHelper.error
            );
        }

    }

    private remove_(query: RemoveQuery, onSuccess: () => void, onError: (err: IError) => void) {
        const queryHelper = new QueryHelper(API.Remove, query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            const deleteObject = new Remove.Instance(query, onSuccess, onError);
            deleteObject.execute();
        }
        else {
            onError(
                queryHelper.error
            );
        }
    }

    private select_(query: SelectQuery, onSuccess: (result) => void, onError: (err: IError) => void) {
        if (typeof query.from === 'object') {
            const selectJoinInstance = new Select.Join(query as SelectJoinQuery, onSuccess, onError);
        }
        else {
            const queryHelper = new QueryHelper(API.Select, query);
            queryHelper.checkAndModify();
            if (queryHelper.error == null) {
                const selectInstance = new Select.Instance(query, onSuccess, onError);
                selectInstance.execute();
            }
            else {
                onError(
                    queryHelper.error
                );
            }
        }
    }


    private count_(query: CountQuery, onSuccess: () => void, onError: (err: IError) => void) {
        if (typeof query.from === 'object') {
            query['count'] = true;
            const selectJoinInstance = new Select.Join(query as SelectJoinQuery, onSuccess, onError);
        }
        else {
            const queryHelper = new QueryHelper(API.Count, query);
            queryHelper.checkAndModify();
            if (queryHelper.error == null) {
                const countInstance = new Count.Instance(query, onSuccess, onError);
                countInstance.execute();
            }
            else {
                onError(
                    queryHelper.error
                );
            }
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
            dbHelper.createMetaData().then(function (tablesMetaData: TableHelper[]) {
                const createDbInstance = new CreateDb(onSuccess, onError);
                createDbInstance.execute(tablesMetaData);
            });
        };
        if (dataBase == null) {
            processCreateDb();
        }
        else {
            this.closeDb_();
            this.getDbVersion_(dataBase.name).then(version => {
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

    private getDbVersion_(dbName: string) {
        return IdbHelper.getDbVersion(dbName);
    }

    private get dbStatus_() {
        return IdbHelper.dbStatus;
    }

    private clear_(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
        const clearInstance = new Clear(tableName, onSuccess, onError);
        clearInstance.execute();
    }


    private getType_(value) {
        return Util.getType(value);
    }

    private isDbExist_(dbInfo, onSuccess: (isExist: boolean) => void, onError: (err: IError) => void) {
        if (this.dbStatus_.conStatus !== CONNECTION_STATUS.UnableToStart) {
            if (this.getType_(dbInfo) === DATA_TYPE.String) {
                this.getDbVersion_(dbInfo).then(function (dbVersion) {
                    onSuccess(Boolean(dbVersion));
                });
            }
            else {
                this.getDbVersion_(dbInfo.dbName).then(function (dbVersion) {
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

    private get_(key: string) {
        return KeyStore.get(key);
    }

    private set_(query: SetQuery) {
        return KeyStore.set(query.key, query.value);
    }

    private transaction_(qry: TranscationQuery, onSuccess: (value) => void, onError: (err: IError) => void) {
        const transaction = new Transaction.Instance(qry, onSuccess, onError);
        transaction.execute();
    }
}