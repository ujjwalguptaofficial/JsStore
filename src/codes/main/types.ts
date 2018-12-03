import { IError } from "./interfaces";
import { API } from "./enums";

export type OrderQuery = {
    by: string; // Column name
    type: string;

    /**
     * whether to do sorting by indexeddb or by jsstore
     * default - true
     * @type {boolean}
     */
    idbSorting: boolean
};

export type SelectQuery = {
    from: any;
    where?: any;
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[];
    aggregate?: AggregateOption;
    ignoreCase?: boolean;
    distinct?: boolean;
};

export type AggregateOption = {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
};

export type WebWorkerRequest = {
    name: API;
    query: any;
    onSuccess?: (results) => void;
    onError?: (err: IError) => void;
};

export type DbInfo = {
    dbName: string;
    table: {
        name: string,
        version: number
    };
};

export type CountQuery = {
    from: any;
    ignoreCase?: boolean;
    where?: any;
};

export type RemoveQuery = {
    from: string;
    ignoreCase?: boolean;
    where?: any;
};

export type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: any;
    where?: any;
};

export type InsertQuery = {
    into: string;
    values: any[];
    return?: boolean;
    skipDataCheck?: boolean;
};

export type TableJoinQuery = {
    column: string;
    table: string;
    where?: any;
    order?: OrderQuery;
    joinType?: string;
    nextJoin?: NextJoinQuery;
};

export type SelectJoinQuery = {
    from: JoinQuery; // IJoin
    count?: boolean;
    skip?: number;
    limit?: number;
};

export type JoinQuery = {
    table1: TableJoinQuery;
    join: string; // inner,left,right,outer
    table2: TableJoinQuery;
};

export type NextJoinQuery = {
    table: string;
    column: string;
};

export type WebWorkerResult = {
    errorOccured: boolean;
    errorDetails: any;
    returnedValue: any;
    throwError: boolean;
};

export type TranscationQuery = {
    tables: string[];
    logic: (results: any) => void;
    data: any;
};

export type SqlWebResult = {
    api: string;
    data: any;
};