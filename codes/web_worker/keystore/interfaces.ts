import { Connection_Status } from "./enums";

export interface IDbStatus {
    ConStatus: Connection_Status;
    LastError: string;
}

export interface IInsert {
    Key: string;
    Value: any;
}

export interface IQueryRequest {
    Name: string;
    Query: any;
    OnSuccess: (result) => void;
    OnError: (err: IError) => void;
}

export interface IError {
    _type: string;
    _message: string;
}

export interface IQueryResult {
    ErrorOccured: boolean;
    ErrorDetails: any;
    ReturnedValue: any;
}