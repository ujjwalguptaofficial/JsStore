import { SelectQuery, InsertQuery, RemoveQuery } from "../types";
import { IDataBase } from "../interfaces";
import { promise, IdbHelper } from "../business/index";
import { API, CONNECTION_STATUS, ERROR_TYPE } from "../enums";
import { execute } from "./helper";

const tableName = "LocalStore";
const columnName = "Key";
const columnValue = "Value";
export class KeyStore {

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

    static get<T>(key: string) {
        return promise<T>(function (res, rej) {
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

    static set(key: string, value) {
        return promise(function (res, rej) {
            execute({
                name: API.Insert,
                query: {
                    into: tableName,
                    values: [{
                        [columnName]: key,
                        [columnValue]: value
                    }],
                    upsert: true
                } as InsertQuery,
                onSuccess: res,
                onError: rej
            });
        });
    }

    static remove(key: string) {
        return promise<number>(function (res, rej) {
            execute({
                name: API.Remove,
                query: {
                    from: tableName,
                    where: {
                        [columnName]: key
                    }
                } as RemoveQuery,
                onSuccess: res,
                onError: rej
            });
        });
    }

    static close() {
        return promise(function (res, rej) {
            execute({
                name: API.Terminate,
                query: null,
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