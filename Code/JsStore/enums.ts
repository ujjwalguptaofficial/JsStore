namespace JsStore {
    export enum ErrorType {
        UndefinedColumn = "undefined_column",
        UndefinedValue = "undefined_value",
        UndefinedColumnName = "undefined_column_name",
        UndefinedColumnValue = "undefined_column_value",
        NotArray = "not_array",
        NoValueSupplied = "no_value_supplied",
        ColumnNotExist = "column_not_exist",
        InvalidOp = "invalid_operator",
        NullValue = "null_value",
        BadDataType = "bad_data_type",
        NextJoinNotExist = "next_join_not_exist",
        TableNotExist = "table_not_exist",
        DbNotExist = "db_not_exist",
        IndexedDbUndefined = "indexeddb_undefined",
        IndexedDbBlocked = "indexeddb_blocked"
    }

    export enum Occurence {
        First = 'f',
        Last = 'l',
        Any = 'a'
    }

    export enum WebWorkerStatus {
        Registered = "registerd",
        Failed = "failed",
        NotStarted = "not_started"
    }

    export enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_started",
        UnableToStart = "unable_to_start"
    }

    export enum WhereQryOption {
        In = "In",
        Like = "Like",
        Or = "Or"
    }

    export enum DataType {
        String = "string",
        Object = "object",
        Array = "array"
    }
}