module JsStore {
    export enum ErrorType {
        UndefinedColumn,
        UndefinedValue,
        UndefinedColumnName,
        UndefinedColumnValue,
        NotArray,
        NoValueSupplied,
        ColumnNotExist,
        InvalidOp,
        NullValue,
        BadDataType,
        NextJoinNotExist,
        TableNotExist
    }

    export interface ISelect {
        From: any,
        Where: any,
        WhereIn: Array<IWhereIn>,
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
        WhereIn: Array<IWhereIn>,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IDelete {
        From: string,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IWhereIn {
        Column: string,
        Value: {
            Low: any,
            High: any
        },
        Op
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
        WhereIn: Array<IWhereIn>,
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

    export var Status: JsStoreStatus = <JsStoreStatus>{
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };



}