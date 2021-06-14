import { ERROR_TYPE, CONNECTION_STATUS } from "./enums";
import { SqlWebResult, AlterQuery } from "./types";

export interface IError {
    type: ERROR_TYPE;
    message: string;
}

export interface IDataBase {
    name: string;
    tables: ITable[];
    version?: number;
}

export type TColumns = {
    [columnName: string]: IColumnOption
};

export interface ITable {
    name: string;
    columns: TColumns;
    alter?: AlterQuery
}

export interface IColumn extends IColumnOption {
    name: string;
}

export interface IColumnOption {

    primaryKey?: boolean;
    autoIncrement?: boolean;
    unique?: boolean;
    notNull?: boolean;
    dataType?: string;
    default?: any;
    multiEntry?: boolean;
    enableSearch?: boolean;
    keyPath?: string[];
}

export interface ISqlWeb {
    parseSql: (sql: string | object) => SqlWebResult;
}

export interface IDbStatus {
    conStatus: CONNECTION_STATUS;
    lastError?: ERROR_TYPE;
}

export interface IPlugin {
    setup: (connection, params) => any | void;
}

export interface IDbInfo {
    name: string;
    version: number;
}