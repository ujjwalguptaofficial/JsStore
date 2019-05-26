import { API } from "./enums";
import { IError } from "./interfaces";
export declare type WebWorkerRequest = {
    name: API;
    query: any;
    onSuccess: (results: any) => void;
    onError: (err: IError) => void;
};
export declare type WebWorkerResult = {
    errorOccured: boolean;
    errorDetails: object;
    returnedValue: number | string | object[];
    throwError: boolean;
};
export declare type DbInfo = {
    dbName: string;
    table: {
        name: string;
        version: number;
    };
};
export declare type JoinQuery = {
    type: string;
    with: string;
    on: string;
    where?: object;
    order?: OrderQuery;
    as?: {
        [originalColumnName: string]: [string];
    };
};
export declare type SelectQuery = {
    from: string;
    join?: JoinQuery | JoinQuery[];
    where?: any;
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[];
    aggregate?: AggregateOption;
    ignoreCase?: boolean;
    distinct?: boolean;
};
export declare type OrderQuery = {
    by: string;
    type: string;
    idbSorting: boolean;
};
export declare type CountQuery = {
    from: any;
    join?: JoinQuery;
    ignoreCase?: boolean;
    where?: any;
};
export declare type RemoveQuery = {
    from: string;
    ignoreCase?: boolean;
    where?: any;
};
export declare type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: object;
    where?: any;
};
export declare type InsertQuery = {
    into: string;
    values: object[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
};
export declare type AggregateOption = {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
};
export declare type SetQuery = {
    key: string;
    value: any;
};
export declare type TranscationQuery = {
    tables: string[];
    logic: (results: any) => void;
    data: any;
};
