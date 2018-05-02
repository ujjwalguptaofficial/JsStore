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

export enum COL_OPTION {
    PrimaryKey = "primary_key",
    AutoIncrement = "auto_increment",
    Unique = "unique",
    NotNull = "not_null",
    MultiEntry = "multi_entry"
}