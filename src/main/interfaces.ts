import { ERROR_TYPE } from "./enums";
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
        [columnName: string]: string[]
    };
    version?: number;
}

export interface IColumn {
    name: string;
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