import { QueryExecutor } from '../query_executor';
import { CONNECTION_STATUS } from "../enums";
import { IInsert, IError, IQueryRequest, IQueryResult } from "../interfaces";
import { Remove } from "./remove_logic";
import { Set } from "./set_logic";
import { InitDb } from "./init_db_logic";
import { Get } from "./get_logic";
import { IdbHelper } from './idb_helper';

export class Main {
    _onSuccess: (result) => void;
    constructor(onSuccess = null) {
        this._onSuccess = onSuccess;
    }

    set(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
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

    checkConnectionAndExecuteLogic(request: IQueryRequest) {
        if (request.Name === 'create_db' || request.Name === 'open_db') {
            this.executeLogic(request);
        }
        else {
            switch (QueryExecutor.dbStatus.conStatus) {
                case CONNECTION_STATUS.Connected: this.executeLogic(request); break;
                case CONNECTION_STATUS.NotStarted:
                    setTimeout(function () {
                        this.checkConnectionAndExecuteLogic(request);
                    }.bind(this), 100); break;
                case CONNECTION_STATUS.Closed:
                    if (IdbHelper._isDbDeletedByBrowser) {
                        this.createDb(() => {
                            IdbHelper._isDbDeletedByBrowser = false;
                            this.checkConnectionAndExecuteLogic(request);
                        }, (err) => {
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

    private executeLogic(request: IQueryRequest) {
        var onSuccess = function (results) {
            this.returnResult({
                ReturnedValue: results
            } as IQueryResult);
        }.bind(this),
            onError = function (err) {
                this.returnResult({
                    ErrorDetails: err,
                    ErrorOccured: true
                } as IQueryResult);
            }.bind(this);

        switch (request.Name) {
            case 'get':
                this.get(request.Query, onSuccess, onError);
                break;
            case 'set': this.set(request.Query, onSuccess, onError);
                break;
            case 'remove': this.remove(request.Query, onSuccess, onError);
                break;
            case 'create_db': this.createDb(onSuccess, onError); break;
        }
    }
}