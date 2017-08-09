module KeyStore {

    export interface ISelect {
        From: any,
        Where: any
    }

    export interface IDelete {
        From: string,
        Where: any
    }

    export enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected"
    }

    export interface KeyStoreStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export interface IInsert {
        TableName: string,
        Set: {
            Key: string,
            Value; any
        }
    }

    export interface IWebWorkerRequest {
        Name: string,
        Query: any,
        OnSuccess: Function,
        OnError: Function
    }

    export interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }

    export var RequestQueue: Array<IWebWorkerRequest> = [],
        TableName = "LocalStore",
        IsCodeExecuting = false;

}