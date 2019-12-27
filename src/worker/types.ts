import { API, QUERY_OPTION } from "./enums";
import { IError } from "./interfaces";



export type WebWorkerRequest = {
    name: API;
    query: any;
    onSuccess: (results) => void;
    onError: (err: IError) => void;
};

export type WebWorkerResult = {
    errorOccured: boolean;
    errorDetails: object;
    returnedValue: number | string | object[];
    throwError: boolean;
};

export type DbInfo = {
    dbName: string;
    table: {
        name: string,
        version: number
    };
};


export type JoinQuery = {
    type: string //'inner',
    with: string // 'Customers',
    on: string // "Customers.customerId = Orders.customerId",
    where?: { [columnName: string]: any };
    order?: OrderQuery;
    as?: { [originalColumnName: string]: [string] }
};

export type SelectQuery = {
    from: string;
    join?: JoinQuery | JoinQuery[];
    where?: { [columnName: string]: any };
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[];
    aggregate?: AggregateOption;
    ignoreCase?: boolean;
    distinct?: boolean;
    case?: { [columnName: string]: [SelectCase] }
};

export type SelectCase = {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '-'?: any;
    '!='?: any;
    then: any;
};

export type OrderQuery = {
    by: string; // Column name
    type: string;
    idbSorting: boolean;
    case?: { [columnName: string]: [SelectCase] }
};

export type CountQuery = {
    from: any;
    join?: JoinQuery;
    ignoreCase?: boolean;
    where?: { [columnName: string]: any };
};

export type RemoveQuery = {
    from: string;
    ignoreCase?: boolean;
    where?: { [columnName: string]: any };
};

export type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: object;
    where?: { [columnName: string]: any };
};

export type InsertQuery = {
    into: string;
    values: object[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
};

export type AggregateOption = {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
};

export type SetQuery = {
    key: string;
    value: any;
};

export type TranscationQuery = {
    tables: string[];
    logic: (results: any) => void;
    data: any;
};