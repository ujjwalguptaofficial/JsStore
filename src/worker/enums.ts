export enum OCCURENCE {
    First = 'f',
    Last = 'l',
    Any = 'a'
}

export enum WEBWORKER_STATUS {
    Registered = "registerd",
    Failed = "failed",
    NotStarted = "not_started"
}

export enum CONNECTION_STATUS {
    Connected = "connected",
    Closed = "closed",
    NotStarted = "not_started",
    UnableToStart = "unable_to_start",
    ClosedByJsStore = "closed_by_jsstore"
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

export enum ERROR_TYPE {
    UndefinedColumn = "undefined_column",
    UndefinedValue = "undefined_value",
    UndefinedColumnName = "undefined_column_name",
    UndefinedDbName = "undefined_database_name",
    UndefinedColumnValue = "undefined_column_value",
    NotArray = "not_array",
    NoValueSupplied = "no_value_supplied",
    ColumnNotExist = "column_not_exist",
    EnableSearchOff = "enable_search_off",
    InvalidOp = "invalid_operator",
    NullValue = "null_value",
    WrongDataType = "wrong_data_type",
    NextJoinNotExist = "next_join_not_exist",
    TableNotExist = "table_not_exist",
    DbNotExist = "db_not_exist",
    ConnectionAborted = "connection_aborted",
    ConnectionClosed = "connection_closed",
    NotObject = "not_object",
    InvalidConfig = "invalid_config",
    DbBlocked = "Db_blocked",
    IndexedDbUndefined = "indexeddb_undefined",
    IndexedDbBlocked = "indexeddb_blocked",
    NullValueInWhere = "null_value_in_where",
    InvalidJoinQuery = 'invalid_join_query'
}

export enum QUERY_OPTION {
    Where = "where",
    Like = 'like',
    Regex = 'regex',
    In = 'in',
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
    Or = "or",
    Skip = "skip",
    Limit = "limit",
    And = "and",
    IgnoreCase = "ignoreCase"
}

export enum IDB_MODE {
    ReadOnly = "readonly",
    ReadWrite = "readwrite"
}

export enum API {
    InitDb = "init_db",
    IsDbExist = "is_db_exist",
    GetDbVersion = "get_db_version",
    GetDbList = "get_db_list",
    Get = "get",
    Set = "set",
    Select = "select",
    Insert = "insert",
    Update = "update",
    Remove = "remove",
    GetDbSchema = "get_db_schema",
    OpenDb = "open_db",
    Clear = "clear",
    DropDb = "drop_db",
    Count = "count",
    BulkInsert = "bulk_insert",
    ChangeLogStatus = "change_log_status",
    Transaction = "transaction",
    FinishTransaction = "finish_transaction",
    Terminate = "terminate",
    InitKeyStore = "init_keystore",
    CloseDb = "close_db"
}