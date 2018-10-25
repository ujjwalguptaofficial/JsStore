import { ERROR_TYPE, API } from "./enums";
export interface IError {
    type: ERROR_TYPE;
    message: string;
}
export interface IWebWorkerRequest {
    name: API;
    query: any;
    onSuccess?: (results: any) => void;
    onError?: (err: IError) => void;
}
export interface IDbInfo {
    dbName: string;
    table: {
        name: string;
        version: number;
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
    default?: any;
    multiEntry?: boolean;
    enableSearch?: boolean;
    keyPath?: string[];
}
export interface ISelect {
    from: any;
    where?: any;
    skip?: number;
    limit?: number;
    order?: IOrder;
    groupBy?: string | string[];
    aggregate?: IAggregate;
    ignoreCase?: boolean;
    distinct?: boolean;
}
export interface IOrder {
    by: string;
    type: string;
}
export interface ICount {
    from: any;
    ignoreCase?: boolean;
    where?: any;
}
export interface IRemove {
    from: string;
    ignoreCase?: boolean;
    where?: any;
}
export interface IUpdate {
    in: string;
    ignoreCase?: boolean;
    set: any;
    where?: any;
}
export interface IInsert {
    into: string;
    values: any[];
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
    where?: any;
    order?: IOrder;
    joinType?: string;
    nextJoin?: INextJoin;
}
export interface ISelectJoin {
    from: IJoin;
    count?: boolean;
    skip?: number;
    limit?: number;
}
export interface IJoin {
    table1: ITableJoin;
    join: string;
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
export interface IWebWorkerResult {
    errorOccured: boolean;
    errorDetails: any;
    returnedValue: any;
    throwError: boolean;
}
export interface ITranscationQry {
    tables: string[];
    logic: (results: any) => void;
    data: any;
}
export interface ISqlWeb {
    parseSql: (sql: string | object) => ISqlWebResult;
}
interface ISqlWebResult {
    api: string;
    data: any;
}
export {};
