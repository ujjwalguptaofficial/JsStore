module JsStorage {

    export enum DBType {
        IndexedDb,
        WebSql
    };

    export interface ISelect {
        Table: string,
        Where: Array<ICondition>
    }

    export interface IDelete {
        Table: string,
        Where: Array<ICondition>
    }

    export interface IUpdate {
        Table: string,
        Set: Array<IValue>,
        Where: Array<ICondition>
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

    export interface IError {
        Name: string,
        Value: string
    }

}