import { API } from "./enums";
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
    where?: object;
    order?: OrderQuery;
};

export type SelectQuery = {
    from: string;
    join?: JoinQuery | JoinQuery[];
    where?;
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[];
    aggregate?: AggregateOption;
    ignoreCase?: boolean;
    distinct?: boolean;
};

export type OrderQuery = {
    by: string; // Column name
    type: string;
    idbSorting: boolean;
};

export type CountQuery = {
    from: any;
    join?: JoinQuery;
    ignoreCase?: boolean;
    where?;
};

export type RemoveQuery = {
    from: string;
    ignoreCase?: boolean;
    where?;
};

export type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: object;
    where?;
};

export type InsertQuery = {
    into: string;
    values: object[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
};

// export type TableJoinQuery = {
//     column: string;
//     table: string;
//     where?: object;
//     order?: OrderQuery;
//     joinType?: string;
//     nextJoin?: NextJoinQuery;
// };

// export type SelectJoinQuery = {
//     from: JoinQuery; // IJoin
//     count?: boolean;
//     skip?: number;
//     limit?: number;
// };

// export type JoinQuery = {
//     table1: TableJoinQuery;
//     join: string; // inner,left,right,outer
//     table2: TableJoinQuery;
// };

// export type NextJoinQuery = {
//     table: string;
//     column: string;
// };

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