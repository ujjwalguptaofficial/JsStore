import { ERROR_TYPE, CONNECTION_STATUS } from "./enums";
import { SqlWebResult } from "./types";

export interface IError {
    type: ERROR_TYPE;
    message: string;
}

export interface IDataBase {
    name: string;
    tables: ITable[];
}

export interface ITable {
    name: string;
    columns: {
        [columnName: string]: IColumnOption
    };
    version?: number;
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