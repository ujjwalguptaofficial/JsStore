module JsStorage {

    export enum DBType {
        IndexedDb,
        WebSql
    };

    export interface TableSchema {
        Name: string,
        Version: number
    }

    export interface ColumnSchema {
        Name: string,
        AutoIncrement: boolean,
        Primarykey: boolean
    }
    export interface IQuery {
        ColumnName: string,
        Value: string
    }

    export var DbType: DBType,
        IndexDbObj: Business.IndexDbLogic,
        WebSqlObj: Business.WebSqlLogic;



}