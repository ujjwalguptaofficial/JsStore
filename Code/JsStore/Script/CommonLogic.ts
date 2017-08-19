module JsStore {

    /**
    * checks whether db exist or not
    * 
    * @param {string} dbName 
    * @param {Function} callback 
    */
    export var isDbExist = function (dbName: string, callback: Function) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback(Boolean(dbVersion));
        });
    }

    /**
    * get Db Version
    * 
    * @param {string} dbName 
    * @param {Function} callback 
    */
    export var getDbVersion = function (dbName: string, callback: Function) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback(Number(dbVersion));
        });
    }

    /**
    * set Db version
    * 
    * @param {string} dbName 
    * @param {number} version 
    * @param {Function} callback 
    */
    export var setDbVersion = function (dbName: string, version: number, callback: Function) {
        KeyStore.set("JsStore_" + dbName + '_Db_Version', version, callback);
    }


    export enum ErrorType {
        UndefinedColumn = "undefined_column",
        UndefinedValue = "undefined_value",
        UndefinedColumnName = "undefined_column_name",
        UndefinedColumnValue = "undefined_column_value",
        NotArray = "not_array",
        NoValueSupplied = "no_value_supplied",
        ColumnNotExist = "column_not_exist",
        InvalidOp = "invalid_operator",
        NullValue = "null_value",
        BadDataType = "bad_data_type",
        NextJoinNotExist = "next_join_not_exist",
        TableNotExist = "table_not_exist",
        DbNotExist = "db_not_exist"
    }

    export interface ISelect {
        From: any,
        Where: any,
        Skip: number,
        Limit: number,
        OnSuccess: Function,
        OnError: Function,
        Order: IOrder
    }

    export interface IOrder {
        By: string, // Column name
        Type: string
    }

    export interface ICount {
        From: any,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IDelete {
        From: string,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }



    export interface IUpdate {
        In: string,
        Set: any,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IInsert {
        Into: string,
        Values: Array<any>,
        Return: boolean,
        OnSuccess: Function,
        OnError: Function
    }

    export interface ICondition {
        Column: string,
        Value: string,
        Op: string
    }

    export interface ITableJoin {
        Column: string,
        Table: string,
        Where: any,
        Order: IOrder
        JoinType: string,
        NextJoin: INextJoin
    }

    export interface ISelectJoin {
        From: IJoin, //IJoin
        Count: boolean,
        Skip: number,
        Limit: number,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IJoin {
        Table1: ITableJoin,
        Join: string, //inner,left,right,outer
        Table2: ITableJoin
    }

    export interface INextJoin {
        Table: string,
        Column: string
    }

    export enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_started"
    }

    export interface JsStoreStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export interface IWebWorkerRequest {
        Name: string,
        Query: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }

    export enum Occurence {
        First = 'f',
        Last = 'l',
        Any = 'a'
    };
}