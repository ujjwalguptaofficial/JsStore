export const ERROR_TYPE = {
    InvalidUpdateColumn: "invalid_update_column",
    UndefinedColumn: "undefined_column",
    UndefinedValue: "undefined_value",
    UndefinedColumnName: "undefined_column_name",
    UndefinedDbName: "undefined_database_name",
    UndefinedColumnValue: "undefined_column_value",
    NotArray: "not_array",
    NoValueSupplied: "no_value_supplied",
    ColumnNotExist: "column_not_exist",
    NoIndexFound: "no_index_found",
    InvalidOp: "invalid_operator",
    NullValue: "null_value",
    WrongDataType: "wrong_data_type",
    TableNotExist: "table_not_exist",
    DbNotExist: "db_not_exist",
    ConnectionAborted: "connection_aborted",
    ConnectionClosed: "connection_closed",
    NotObject: "not_object",
    InvalidConfig: "invalid_config",
    DbBlocked: "Db_blocked",
    IndexedDbNotSupported: "indexeddb_not_supported",
    NullValueInWhere: "null_value_in_where",
    InvalidJoinQuery: 'invalid_join_query',
    InvalidQuery: 'invalid_query',
    ImportScriptsFailed: 'import_scripts_failed',
    MethodNotExist: 'method_not_exist',
    Unknown: "unknown",
    InvalidMiddleware: "invalid_middleware",
    InvalidOrderQuery: 'invalid_order_query',
    InvalidGroupQuery: 'invalid_group_query',
    NoPrimaryKey: 'no_primary_key'
};

export enum WORKER_STATUS {
    Registered = "registerd",
    Failed = "failed",
    NotStarted = "not_started"
}

export enum DATA_TYPE {
    String = "string",
    Object = "object",
    Array = "array",
    Number = "number",
    Boolean = "boolean",
    Null = "null",
    DateTime = "date_time"
}


export enum API {
    InitDb = "init_db",
    MapGet = "map_get",
    MapSet = "map_set",
    MapHas = "map_has",
    MapDelete = "map_delete",
    Select = "select",
    Insert = "insert",
    Update = "update",
    Remove = "remove",
    OpenDb = "open_db",
    Clear = "clear",
    DropDb = "drop_db",
    Count = "count",
    ChangeLogStatus = "change_log_status",
    Terminate = "terminate",
    Transaction = "transaction",
    CloseDb = "close_db",
    Union = "union",
    Intersect = "intersect",
    ImportScripts = "import_scripts",
    Middleware = "middleware"
}

export enum EVENT {
    RequestQueueEmpty = "requestQueueEmpty",
    RequestQueueFilled = "requestQueueFilled",
    Upgrade = "upgrade",
    Create = "create",
    Open = "open",
    DbRefreshRequired = "dbRefreshRequired",
}

export enum QUERY_OPTION {
    Where = "where",
    Like = 'like',
    Regex = 'regex',
    In = 'in',
    Equal = "=",
    Between = '-',
    GreaterThan = '>',
    LessThan = '<',
    GreaterThanEqualTo = ">=",
    LessThanEqualTo = "<=",
    NotEqualTo = "!=",
    Aggregate = "aggregate",
    Max = "max",
    Min = "min",
    Avg = "avg",
    Count = "count",
    Sum = "sum",
    List = "list",
    Or = "or",
    Skip = "skip",
    Limit = "limit",
    And = "and",
    IgnoreCase = "ignoreCase",
    Then = "then"
}

export enum IDB_MODE {
    ReadOnly = "readonly",
    ReadWrite = "readwrite"
}

export enum OCCURENCE {
    First = 'f',
    Last = 'l',
    Any = 'a'
}

export enum CONNECTION_STATUS {
    Connected = "connected",
    Closed = "closed",
    NotStarted = "not_started",
    UnableToStart = "unable_to_start",
    ClosedByJsStore = "closed_by_jsstore"
}
