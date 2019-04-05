import { IdbHelper } from "./business/index";
import { CONNECTION_STATUS, ERROR_TYPE, API } from "./enums";
import { QueryExecutor } from "./index";
import { IDataBase } from "./interfaces";
import { WebWorkerRequest, SelectQuery, WebWorkerResult } from "./types";
import { promise } from "./business/helpers/promise";

const onResultEvaluated = function (result: WebWorkerResult) {
    const finishedRequest: WebWorkerRequest = requestQueue.shift();
    if (finishedRequest) {
        if (result.errorOccured) {
            finishedRequest.onError(result.errorDetails as any);
        } else {
            finishedRequest.onSuccess(result.returnedValue);
        }
        isQueryExecuting = false;
        sendQueryForExecution();
    }
};

let isQueryExecuting = false;

const sendQueryForExecution = function () {
    if (isQueryExecuting === false) {
        isQueryExecuting = true;
        executor.checkConnectionAndExecuteLogic(requestQueue[0]);
    }
};

const executor = new QueryExecutor(onResultEvaluated);

const execute = function (request: WebWorkerRequest) {
    requestQueue.push(request);
    sendQueryForExecution();
};

const requestQueue: WebWorkerRequest[] = [];

const tableName = "LocalStore";
const columnName = "Key";
export class KeyStoreHelper {

    static init() {
        setDbType();
        const db = {
            name: "KeyStore",
            tables: [{
                name: tableName,
                columns: [{
                    name: columnName,
                    primaryKey: true,
                    unique: true
                }]
            }]
        } as IDataBase;
        return promise(function (res, rej) {
            execute({
                name: API.InitDb,
                query: db,
                onSuccess: res,
                onError: rej
            });
        });

    }

    static get(key: string) {
        return promise(function (res, rej) {
            execute({
                name: API.Select,
                query: {
                    from: tableName,
                    where: {
                        [columnName]: key
                    }
                } as SelectQuery,
                onSuccess: res,
                onError: rej
            });
        });

    }
}

const setDbType = function () {
    if (!indexedDB) {
        indexedDB = (self as any).mozIndexedDB ||
            (self as any).webkitIndexedDB || (self as any).msIndexedDB;
    }
    if (indexedDB) {
        IDBTransaction = IDBTransaction ||
            (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
        (self as any).IDBKeyRange = (self as any).IDBKeyRange ||
            (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange;
    }
    else {
        IdbHelper.dbStatus = {
            conStatus: CONNECTION_STATUS.UnableToStart,
            lastError: ERROR_TYPE.IndexedDbUndefined
        };
    }
};