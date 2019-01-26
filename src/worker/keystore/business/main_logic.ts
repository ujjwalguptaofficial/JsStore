import { QueryExecutor } from '../query_executor';
import { CONNECTION_STATUS } from "../enums";
import { IInsert, IError, IQueryRequest, IQueryResult } from "../interfaces";
import { Remove } from "./remove_logic";
import { Set } from "./set_logic";
import { InitDb } from "./init_db_logic";
import { Get } from "./get_logic";
import { IdbHelper } from './idb_helper';

export class Main {
    onQueryFinished: (result) => void;
    constructor(onQueryFinished = null) {
        this.onQueryFinished = onQueryFinished;
    }

    set(query: IInsert, onSuccess: (result) => void, onError: (err: IError) => void) {
        const insertInstance = new Set(query, onSuccess, onError);
        insertInstance.execute();
    }

    remove(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        const deleteInstance = new Remove(key, onSuccess, onError);
        deleteInstance.execute();
    }

    get(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        const getInstance = new Get(key, onSuccess, onError);
        getInstance.execute();
    }

    createDb(onSuccess: () => void, onError: (err: IError) => void) {
        const dbName = "KeyStore";
        const initDbInstance = new InitDb(dbName, onSuccess, onError);
    }

    closeDb(onSuccess: () => void, onError: (err: IError) => void) {
        if (IdbHelper.dbStatus.conStatus === CONNECTION_STATUS.Connected) {
            IdbHelper.dbStatus.conStatus = CONNECTION_STATUS.Closed;
            IdbHelper.dbConnection.close();
        }
        onSuccess();
    }

    checkConnectionAndExecuteLogic(request: IQueryRequest) {
        if (request.name === 'create_db' || request.name === 'open_db') {
            this.executeLogic(request);
        }
        else {
            switch (IdbHelper.dbStatus.conStatus) {
                case CONNECTION_STATUS.Connected: this.executeLogic(request); break;
                case CONNECTION_STATUS.NotStarted:
                    setTimeout(() => {
                        this.checkConnectionAndExecuteLogic(request);
                    }, 100); break;
                case CONNECTION_STATUS.Closed:
                    if (IdbHelper.isDbDeletedByBrowser) {
                        this.createDb(() => {
                            IdbHelper.isDbDeletedByBrowser = false;
                            this.checkConnectionAndExecuteLogic(request);
                        }, (err) => {
                            console.error(err);
                        });
                    }
            }
        }
    }

    private returnResult(result) {
        this.onQueryFinished(result);
    }

    private executeLogic(request: IQueryRequest) {
        const onSuccess = (results?) => {
            this.returnResult({
                returnedValue: results
            } as IQueryResult);
        };
        const onError = (err) => {
            this.returnResult({
                errorDetails: err,
                errorOccured: true
            } as IQueryResult);
        };

        switch (request.name) {
            case 'get':
                this.get(request.query, onSuccess, onError);
                break;
            case 'set': this.set(request.query, onSuccess, onError);
                break;
            case 'remove': this.remove(request.query, onSuccess, onError);
                break;
            case 'create_db': this.createDb(onSuccess, onError); break;
            case 'close_db': this.closeDb(onSuccess, onError); break;
        }
    }
}