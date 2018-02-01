namespace JsStore {

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

    export enum DataType {
        String = "string",
        Object = "object",
        Array = "array"
    }
}