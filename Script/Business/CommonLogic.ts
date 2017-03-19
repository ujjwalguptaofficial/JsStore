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
        ColumnNotExist
    }

    export interface ISelect {
        From: string,
        Where: Array<ICondition>
    }

    export interface IDelete {
        Table: string,
        Where: Array<ICondition>
    }

    export interface IUpdate {
        Table: string,

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
        Values: Array<IValue>
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

}