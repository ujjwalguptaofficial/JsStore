namespace KeyStore {

    export interface ISelect {
        From: any;
        Where: any;
    }

    export interface IDelete {
        From: string;
        Where: any;
    }

    export enum Connection_Status {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected"
    }

    export interface IDbStatus {
        ConStatus: Connection_Status;
        LastError: string;
    }

    export interface IInsert {
        TableName: string;
        Set: {
            Key: string,
            Value; any
        };
    }

    export interface IWebWorkerRequest {
        Name: string;
        Query: any;
        OnSuccess: (result) => void;
        OnError: (err: IError) => void;
    }

    export interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }

    export var request_queue: IWebWorkerRequest[] = [],
        table_name = "LocalStore",
        is_code_executing = false,
        db_status: IDbStatus = {
            ConStatus: Connection_Status.NotStarted,
            LastError: ""
        };

}