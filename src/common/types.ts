import { IError } from "./interfaces";
import { API, EVENT } from "./enums";

export type OrderQuery = {

    /**
     * sorting column name
     *
     * @type {(string | { [columnName: string]: [CaseOption] })}
     */
    by: string | { [columnName: string]: [CaseOption] };

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
    case?: [CaseOption]
};

export type JoinQuery = {
    type?: string //'inner',
    with: string // 'Customers',
    on: string // "Customers.customerId = Orders.customerId"
    where?: WhereQuery | WhereQuery[];
    order?: OrderQuery;
    as?: { [originalColumnName: string]: string },
    case?: { [columnName: string]: [CaseOption] },
    flatten?: string[];
};

export type WhereQueryOption = {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '!='?: any;
    '-'?: any;
    like?: any;
    regex?: any;
    or?: WhereQuery;
    in?: any[];
};

export type WhereQuery = { [columnName: string]: WhereQueryOption | string | number | boolean };


export type SelectQuery = {
    from: string;
    join?: JoinQuery | JoinQuery[];
    where?: WhereQuery | WhereQuery[];
    skip?: number;
    limit?: number;
    order?: OrderQuery;
    groupBy?: string | string[] | { [columnName: string]: [CaseOption] };
    aggregate?: AggregateOption;
    distinct?: boolean;
    case?: { [columnName: string]: [CaseOption] },
    flatten?: string[];
};

export type CaseOption = {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '-'?: any;
    '!='?: any;
    then: any;
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
    query?: any;
    onSuccess?: (results?) => void;
    onError?: (err: IError) => void;
    result?: () => Promise<any>;
    middleware?: Array<Function>;
};



export type CountQuery = {
    from: string;
    join?: JoinQuery;
    where?: WhereQuery | WhereQuery[];
};

export type RemoveQuery = {
    from: string;
    where?: WhereQuery | WhereQuery[];
};

export type UpdateQuery = {
    in: string;
    ignoreCase?: boolean;
    set: { [columnName: string]: any };
    where?: WhereQuery | WhereQuery[];
};

export type InsertQuery = {
    into: string;
    values: any[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
    ignore?: boolean;
    validation?: boolean;
};

export type WebWorkerResult = {
    error?: any;
    result?: any;
};

export type TranscationQuery = {
    tables: string[];
    method: string;
    data?: any;
};

export type SqlWebResult = {
    api: string;
    data: any;
};

export type EventQueue = {
    event: EVENT;
    callback: Function
};

export type SetQuery = {
    key: string;
    value: any;
};

export type IntersectQuery = {
    queries: SelectQuery[];
    skip: number;
    limit: number;
    order?: OrderQuery;
};

export type TStringAny = { [key: string]: any };

export type TMiddleware = (request: WebWorkerRequest) => Promise<any>;