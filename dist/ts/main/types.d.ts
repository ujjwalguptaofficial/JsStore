import { IError } from "./interfaces";
import { API } from "./enums";
export declare type OrderQuery = {
    /**
     * sorting column name
     *
     * @type {string}
     */
    by: string;
    /**
     * sorting type - asc/desc
     *
     * @type {string}
     */
    type: string;
    /**
     * whether to do sorting by indexeddb or by jsstore
     * default - true
     * @type {boolean}
     */
    idbSorting?: boolean;
};
export declare type JoinQuery = {
    type?: string;
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
export declare type AggregateOption = {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
};
export declare type WebWorkerRequest = {
    name: API;
    query?: any;
    onSuccess?: (results: any) => void;
    onError?: (err: IError) => void;
};
export declare type DbInfo = {
    dbName: string;
    table: {
        name: string;
        version: number;
    };
};
export declare type CountQuery = {
    from: any;
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
    set: any;
    where?: any;
};
export declare type InsertQuery = {
    into: string;
    values: any[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
};
export declare type WebWorkerResult = {
    errorOccured: boolean;
    errorDetails: any;
    returnedValue: any;
    throwError: boolean;
};
export declare type TranscationQuery = {
    tables: string[];
    logic: (data: any) => Promise<void>;
    data: any;
};
export declare type SqlWebResult = {
    api: string;
    data: any;
};
