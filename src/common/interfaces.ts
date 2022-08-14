import { ERROR_TYPE, CONNECTION_STATUS } from "./enums";
import { SqlWebResult } from "./types";

export interface IError {
    type: ERROR_TYPE;
    message: string;
}

export interface IDataBase {
    name: string;
    tables: ITable[];
    version?: number;
}

export type TColumns = {
    [columnName: string]: IColumnOption
};

export interface ITable {
    name: string;
    columns: TColumns;
    alter?: IAlterQuery;
}

export interface IIntersectQuery {
    queries: ISelectQuery[];
    skip: number;
    limit: number;
    order?: IOrderQuery;
}

export interface ITranscationQuery {
    tables: string[];
    method: string;
    data?: any;
}

export interface ICountQuery {
    from: string;
    join?: IJoinQuery;
    where?: IWhereQuery | IWhereQuery[];
}

export interface IRemoveQuery {
    from: string;
    where?: IWhereQuery | IWhereQuery[];
}

export interface IUpdateQuery {
    in: string;
    ignoreCase?: boolean;
    set: { [columnName: string]: any };
    where?: IWhereQuery | IWhereQuery[];
    mapSet?: string | Function;
}

export interface IAlterQuery {
    [version: number]: {
        add: TColumns,
        drop: TColumns,
        modify: TColumns
    };
}

export interface IOrderQuery {

    /**
     * sorting column name
     *
     * @type {(string | { [columnName: string]: [ICaseOption] })}
     */
    by: string | { [columnName: string]: [ICaseOption] };

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
     * @type {[ICaseOption]}
     */
    case?: [ICaseOption];
}

export interface IJoinQuery {
    type?: string; //'inner',
    with: string; // 'Customers',
    on: string; // "Customers.customerId = Orders.customerId"
    where?: IWhereQuery | IWhereQuery[];
    order?: IOrderQuery;
    as?: { [originalColumnName: string]: string };
    case?: { [columnName: string]: [ICaseOption] };
    flatten?: string[];
    store?: any[];
    meta?: {
        primaryKey?: string;
    };
}

export interface IWhereQueryOption {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '!='?: any;
    '-'?: any;
    like?: any;
    regex?: any;
    or?: IWhereQuery;
    in?: any[];
}

export interface IWhereQuery {
    [columnName: string]: IWhereQueryOption | string | number | boolean;
}

export interface ICaseOption {
    '>'?: any;
    '<'?: any;
    '>='?: any;
    '<='?: any;
    '-'?: any;
    '!='?: any;
    then: any;
}

export interface IAggregateOption {
    max?: string | string[];
    min?: string | string[];
    sum?: string | string[];
    count?: string | string[];
    avg?: string | string[];
}

export interface IColumn extends IColumnOption {
    name: string;
}

export interface ISelectQuery {
    from: string;
    join?: IJoinQuery | IJoinQuery[];
    where?: IWhereQuery | IWhereQuery[];
    skip?: number;
    limit?: number;
    order?: IOrderQuery | IOrderQuery[];
    groupBy?: string | string[] | { [columnName: string]: [ICaseOption] };
    aggregate?: IAggregateOption;
    distinct?: boolean;
    case?: { [columnName: string]: [ICaseOption] };
    flatten?: string[];
    store?: any[];
    meta?: {
        primaryKey?: string;
    };
}

export interface IInsertQuery {
    into: string;
    values: any[];
    return?: boolean;
    skipDataCheck?: boolean;
    upsert?: boolean;
    ignore?: boolean;
    validation?: boolean;
}

export interface IColumnOption {

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

export interface ISqlWeb {
    parseSql: (sql: string | object) => SqlWebResult;
}

export interface IDbStatus {
    conStatus: CONNECTION_STATUS;
    lastError?: ERROR_TYPE;
}

export interface IPlugin {
    setup: (connection, params) => any;
}

export interface IDbInfo {
    name: string;
    version: number;
}