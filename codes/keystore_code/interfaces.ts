import { Connection_Status } from "./enums";

export interface ISelect {
    From: any;
    Where: any;
}

export interface IDelete {
    From: string;
    Where: any;
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

export interface IError {
    Name: string;
    Value: string;
}


export interface IWebWorkerResult {
    ErrorOccured: boolean;
    ErrorDetails: any;
    ReturnedValue: any;
}