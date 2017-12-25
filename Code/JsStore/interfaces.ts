namespace JsStore {
    export interface IDbInfo {
        DbName: string;
        Table: {
            Name: string,
            Version: number
        };
    }

    export interface IDataBaseOption {
        Name: string;
        Tables: ITableOption[];
    }

    export interface ITableOption {
        Name: string;
        Columns: IColumnOption[];
        Version: number;
    }

    export interface IColumnOption {
        Name: string;
        AutoIncrement: boolean;
        PrimaryKey: boolean;
        Unique: boolean;
        NotNull: boolean;
        DataType: string;
        Default: any;
        MultiEntry: boolean;
    }

    export interface ISelect {
        From: any;
        Where: any;
        Skip: number;
        Limit: number;
        OnSuccess: (results: any[]) => void;
        OnError: (error: IError) => void;
        Order: IOrder;
        GroupBy: any;
        Aggregate: {
            Max: any,
            Min: any,
            Count: any,
            Sum: any,
            Avg: any
        };
        IgnoreCase: boolean;
        Distinct: boolean;
    }

    export interface IOrder {
        By: string; // Column name
        Type: string;
    }

    export interface ICount {
        From: any;
        IgnoreCase: boolean;
        Where: any;
        OnSuccess: (noOfRecord: number) => void;
        OnError: (error: IError) => void;
    }

    export interface IDelete {
        From: string;
        IgnoreCase: boolean;
        Where: any;
        OnSuccess: (rowsDeleted: number) => void;
        OnError: (error: IError) => void;
    }

    export interface IUpdate {
        In: string;
        IgnoreCase: boolean;
        Set: any;
        Where: any;
        OnSuccess: (rowsUpdated: number) => void;
        OnError: (error: IError) => void;
    }

    export interface IInsert {
        Into: string;
        Values: any[];
        Return: boolean;
        OnSuccess: (rowsInserted: number) => void;
        OnError: (error: IError) => void;
        SkipDataCheck: boolean;
    }

    export interface ICondition {
        Column: string;
        Value: string;
        Op: string;
    }

    export interface ITableJoin {
        Column: string;
        Table: string;
        Where: any;
        Order: IOrder;
        JoinType: string;
        NextJoin: INextJoin;
    }

    export interface ISelectJoin {
        From: IJoin; // IJoin
        Count: boolean;
        Skip: number;
        Limit: number;
        OnSuccess: (results) => void;
        OnError: (err: IError) => void;
    }

    export interface IJoin {
        Table1: ITableJoin;
        Join: string; // inner,left,right,outer
        Table2: ITableJoin;
    }

    export interface INextJoin {
        Table: string;
        Column: string;
    }

    export interface IJsStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
    }

    export interface IWebWorkerRequest {
        Name: string;
        Query: any;
        OnSuccess: (results) => void;
        OnError: (err: IError) => void;
    }

    export interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }

    export interface IError {
        Name: string;
        Message: string;
    }

    export interface IAggregate {
        Max: any[];
        Min: any[];
        Sum: any[];
        Count: any[];
        Avg: any[];
    }
}