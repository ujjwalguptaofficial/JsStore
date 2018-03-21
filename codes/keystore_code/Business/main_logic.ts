import { db_status } from "../common_logic";
import { Connection_Status } from "../enums";
import { IInsert, IError, IDelete, ISelect, IWebWorkerRequest, IWebWorkerResult } from "../interfaces";
import { Remove } from "./remove_logic";
import { Set } from "./set_logic";
import { InitDb } from "./init_db_logic";
import { Get } from "./get_logic";

export var db_connection,
    is_db_deleted_by_browser: boolean,
    db_transaction: IDBTransaction = null,
    callDbDroppedByBrowser = function () {
        is_db_deleted_by_browser = db_status.ConStatus === Connection_Status.Connected ? true : false;
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

    public set(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        var obj_insert = new Set(query, onSuccess, onError);
        obj_insert.execute();
    }

    public remove(query: IDelete, onSuccess: (result) => void, onError: (err: IError) => void) {
        var obj_delete = new Remove(query, onSuccess, onError);
        obj_delete.execute();
    }

    public get(query: ISelect, onSuccess: (result) => void, onError: (err: IError) => void) {
        var get_object = new Get(query, onSuccess, onError);
        get_object.execute();
    }

    public createDb(onSuccess: () => void, onError: (err: IError) => void) {
        var db_name = "KeyStore";
        var init_db_object = new InitDb(db_name, onSuccess, onError);
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
                        this.createDb(function () {
                            is_db_deleted_by_browser = false;
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
            case 'create_db': this.createDb(onSuccess, onError); break;
        }
    };
}