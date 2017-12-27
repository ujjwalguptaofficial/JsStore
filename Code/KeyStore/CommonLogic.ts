namespace KeyStore {

    export interface ISelect {
        From: any;
        Where: any;
    }

    export interface IDelete {
        From: string;
        Where: any;
    }

    export enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected"
    }

    export interface IKeyStoreStatus {
        ConStatus: ConnectionStatus;
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
        is_code_executing = false;

}