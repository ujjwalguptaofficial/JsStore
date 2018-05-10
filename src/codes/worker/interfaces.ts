import { ERROR_TYPE, CONNECTION_STATUS, API } from "./enums";

export interface IError {
    type: ERROR_TYPE;
    message: string;
}

export interface IWebWorkerRequest {
    name: API;
    query: string | object;
    onSuccess: (results) => void;
    onError: (err: IError) => void;
}

export interface IWebWorkerResult {
    errorOccured: boolean;
    errorDetails: object;
    returnedValue: number | string | object[];
    throwError: boolean;
}

export interface IDbStatus {
    conStatus: CONNECTION_STATUS;
    lastError: ERROR_TYPE;
}

export interface IDbInfo {
    dbName: string;
    table: {
        name: string,
        version: number
    };
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
}

export interface ISelect {
    from: string | object;
    where?;
    skip?: number;
    limit?: number;
    order?: IOrder;
    groupBy?: string | string[];
    aggregate?: IAggregate;
    ignoreCase?: boolean;
    distinct?: boolean;
}

export interface IOrder {
    by: string; // Column name
    type: string;
}

export interface ICount {
    from: any;
    ignoreCase?: boolean;
    where?;
}

export interface IRemove {
    from: string;
    ignoreCase?: boolean;
    where?;
}

export interface IUpdate {
    in: string;
    ignoreCase?: boolean;
    set: object;
    where?;
}

export interface IInsert {
    into: string;
    values: object[];
    return?: boolean;
    skipDataCheck?: boolean;
}

export interface ICondition {
    column: string;
    value: string;
    op: string;
}

export interface ITableJoin {
    column: string;
    table: string;
    where?: object;
    order?: IOrder;
    joinType?: string;
    nextJoin?: INextJoin;
}

export interface ISelectJoin {
    from: IJoin; // IJoin
    count?: boolean;
    skip?: number;
    limit?: number;
}

export interface IJoin {
    table1: ITableJoin;
    join: string; // inner,left,right,outer
    table2: ITableJoin;
}

export interface INextJoin {
    table: string;
    column: string;
}

export interface IAggregate {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
}

export interface ITranscationQry {
    tableNames: string[];
    logic: string;
    data: object;
    abortOnError?: boolean;
}

export interface ISet {
    key: string;
    value: any;
}