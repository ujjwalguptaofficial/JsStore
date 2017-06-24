module JsStorage {

    export enum DBType {
        IndexedDb,
        WebSql
    };

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
        Limit: number
    }

    export interface IDelete {
        From: string,
        Where: any
    }

    export interface IWhereIn {
        Column: string,
        Value,
        Start,
        Op,
        End
    }

    export interface IUpdate {
        In: string,

        /**
         * A Json Object containing the update values
         * 
         * @type {*}
         * @memberOf IUpdate
         */
        Set: any,
        Where: any
    }

    export interface IInsert {
        Into: string,
        Values: Array<IValue>,
        Return: boolean
    }

    export interface IValue {
        Column: string,
        Value: string
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
        JoinType: string,
        NextJoin: INextJoin
    }

    export interface ISelectJoin {
        From: IJoin, //IJoin
    }

    export interface IJoin {
        Table1: ITableJoin,
        Join: string, //inner,left,right,outer
        Table2: ITableJoin,
        NextJoin: INextJoin
    }

    export interface INextJoin {
        Table: string,
        Column: string
    }

    export enum ConnectionStatus {
        Connected = 1,
        Closed = 2,
        NotStarted = 3
    }
    export interface JsStorageStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export var Status: JsStorageStatus = <JsStorageStatus>{
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };
}