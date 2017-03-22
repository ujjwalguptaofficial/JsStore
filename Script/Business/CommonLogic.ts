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
        Where: any,
        WhereIn: any,
        FromMany
    }

    export interface IDelete {
        From: string,
        Where: any
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