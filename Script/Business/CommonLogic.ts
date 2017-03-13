module JsStorage {

    export enum DBType {
        IndexedDb,
        WebSql
    };

    export interface IQuery {
        Table: string,
        Case: Condition
    }

    export interface Condition {
        Column: string,
        Value: string
    }

    export var DbType: DBType,
        IndexDbObj: Business.IndexDbLogic,
        WebSqlObj: Business.WebSqlLogic,
        IndexDbConnection;



}