import { IError } from "./interfaces";
import { API, EVENT } from "./enums";
export declare type OrderQuery = {
    /**
     * sorting column name
     *
     * @type {(string | { [columnName: string]: [CaseOption] })}
     */
    by: string | {
        [columnName: string]: [CaseOption];
    };
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
    /**
     * use this option to modify ordering
     *
     * @type {[CaseOption]}
     */
    case?: [CaseOption];
};
export declare type JoinQuery = {
    type?: string;
    with: string;
    on: string;
    where?: {
        [columnName: string]: any;
    };
    order?: OrderQuery;
    as?: {
        [originalColumnName: string]: string;
    };
    case?: {
        [columnName: string]: [CaseOption];
    };
    ignoreCase?: boolean;
};
export declare type SelectQuery = {
    from: string;
    join?: JoinQuery | JoinQuery[];
    where?: {
        [columnName: string]: any;
    };
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[] | {
        [columnName: string]: [CaseOption];
    };
    aggregate?: AggregateOption;
    ignoreCase?: boolean;
    distinct?: boolean;
    case?: {
        [columnName: string]: [CaseOption];
    };
};
export declare type CaseOption = {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '-'?: any;
    '!='?: any;
    then: any;
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
    from: string;
    join?: JoinQuery;
    ignoreCase?: boolean;
    where?: {
        [columnName: string]: any;
    };
};
export declare type RemoveQuery = {
    from: string;
    ignoreCase?: boolean;
    where?: {
        [columnName: string]: any;
    };
};
export declare type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: {
        [columnName: string]: any;
    };
    where?: {
        [columnName: string]: any;
    };
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
export declare type EventQueue = {
    event: EVENT;
    callback: Function;
};
export declare type SetQuery = {
    key: string;
    value: any;
};
export declare type IntersectQuery = {
    queries: SelectQuery[];
    skip: number;
    limit: number;
};
