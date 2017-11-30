module JsStore {
    export interface DbInfo {
        DbName: string,
        Table: {
            Name: string,
            Version: number
        }
    }

    export interface ISelect {
        From: any,
        Where: any,
        Skip: number,
        Limit: number,
        OnSuccess: Function,
        OnError: Function,
        Order: IOrder,
        GroupBy: any,
        Aggregate: {
            Max: any,
            Min: any,
            Count: any,
            Sum: any,
            Avg: any
        },
        IgnoreCase: boolean,
        Distinct: boolean
    }

    export interface IOrder {
        By: string, // Column name
        Type: string
    }

    export interface ICount {
        From: any,
        IgnoreCase: boolean,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IDelete {
        From: string,
        IgnoreCase: boolean,
        Where: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IUpdate {
        In: string,
        IgnoreCase: boolean,
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
        OnError: Function,
        SkipDataCheck
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

    export interface IError {
        Name: string,
        Message: string
    }

    export interface IAggregate {
        Max: Array<any>,
        Min: Array<any>,
        Sum: Array<any>,
        Count: Array<any>,
        Avg: Array<any>
    }


}