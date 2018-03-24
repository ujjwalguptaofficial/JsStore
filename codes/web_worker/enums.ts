export enum Occurence {
    First = 'f',
    Last = 'l',
    Any = 'a'
}

export enum WebWorker_Status {
    Registered = "registerd",
    Failed = "failed",
    NotStarted = "not_started"
}

export enum Connection_Status {
    Connected = "connected",
    Closed = "closed",
    NotStarted = "not_started",
    UnableToStart = "unable_to_start",
    ClosedByJsStore = "closed_by_jsstore"
}

export enum WhereQryOption {
    In = "In",
    Like = "Like",
    Or = "Or"
}

export enum Data_Type {
    String = "string",
    Object = "object",
    Array = "array",
    Number = "number",
    Boolean = "boolean",
    Null = "null"
}

export enum Error_Type {
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
    BadDataType = "bad_data_type",
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
}