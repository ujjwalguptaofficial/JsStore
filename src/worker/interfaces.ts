import { ERROR_TYPE, CONNECTION_STATUS } from "./enums";

export interface IError {
    type: ERROR_TYPE;
    message: string;
}

export interface IDbStatus {
    conStatus: CONNECTION_STATUS;
    lastError?: ERROR_TYPE;
}


export interface IDataBase {
    name: string;
    tables: ITable[];
}

export interface ITable {
    name: string;
    columns: IColumn[];
    version?: number;
}

export interface IColumn {
    name: string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    unique?: boolean;
    notNull?: boolean;
    dataType?: string;
    default?;
    multiEntry?: boolean;
    enableSearch?: boolean;

    keyPath?: string[];
}