import { QueryExecutor } from '../query_executor';
import { Connection_Status } from "../enums";
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

    public set(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        var obj_insert = new Set(query, onSuccess, onError);
        obj_insert.execute();
    }

    public remove(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        var obj_delete = new Remove(key, onSuccess, onError);
        obj_delete.execute();
    }

    public get(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        var get_object = new Get(key, onSuccess, onError);
        get_object.execute();
    }

    public createDb(onSuccess: () => void, onError: (err: IError) => void) {
        var db_name = "KeyStore";
        var init_db_object = new InitDb(db_name, onSuccess, onError);
    }

    public checkConnectionAndExecuteLogic(request: IQueryRequest) {
        if (request.Name === 'create_db' || request.Name === 'open_db') {
            this.executeLogic(request);
        }
        else {
            switch (QueryExecutor._dbStatus.ConStatus) {
                case Connection_Status.Connected: this.executeLogic(request); break;
                case Connection_Status.NotStarted:
                    setTimeout(function () {
                        this.checkConnectionAndExecuteLogic(request);
                    }.bind(this), 100); break;
                case Connection_Status.Closed:
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