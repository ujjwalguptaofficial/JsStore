export enum ERROR_TYPE {
    WorkerNotSupplied = "worker_not_supplied",
    IndexedDbUndefined = "indexeddb_undefined"
}

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
    ChangeLogStatus = "change_log_status",
    Terminate = "terminate",
    Transaction = "transaction",
    InitKeyStore = "init_keystore",
    CloseDb = "close_db",
    Union = "union"
}

export enum EVENT {
    RequestQueueEmpty = "requestQueueEmpty",
    RequestQueueFilled = "requestQueueFilled"
}