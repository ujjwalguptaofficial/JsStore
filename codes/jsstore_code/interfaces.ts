import { Error_Type } from "./enums";

export interface IError {
    _type: Error_Type;
    _message: string;
}

export interface IWebWorkerRequest {
    Name: string;
    Query: any;
    OnSuccess?: (results) => void;
    OnError?: (err: IError) => void;
}

export interface IDbInfo {
    DbName: string;
    Table: {
        Name: string,
        Version: number
    };
}

export interface IDataBaseOption {
    Name: string;
    Tables: ITableOption[];
}

export interface ITableOption {
    Name: string;
    Columns: IColumnOption[];
    Version?: number;
}

export interface IColumnOption {
    Name: string;
    PrimaryKey?: boolean;
    AutoIncrement?: boolean;
    Unique?: boolean;
    NotNull?: boolean;
    DataType?: string;
    Default?: any;
    MultiEntry?: boolean;
    EnableSearch?: boolean;
}

export interface ISelect {
    from: any;
    where?: any;
    skip?: number;
    limit?: number;
    order?: IOrder;
    groupBy?: any;
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
    max?: any[];
    min?: any[];
    sum?: any[];
    count?: any[];
    avg?: any[];
}

export interface IWebWorkerResult {
    ErrorOccured: boolean;
    ErrorDetails: any;
    ReturnedValue: any;
    ThrowError: boolean;
}