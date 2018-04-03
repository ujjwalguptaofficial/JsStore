import { IError } from "./interfaces";
import { Connection_Status, Error_Type } from "./enums";

export interface IWebWorkerRequest {
    Name: string;
    Query: any;
    OnSuccess: (results) => void;
    OnError: (err: IError) => void;
}

export interface IWebWorkerResult {
    ErrorOccured: boolean;
    ErrorDetails: any;
    ReturnedValue: any;
    ThrowError: boolean;
}

export interface IDbStatus {
    ConStatus: Connection_Status;
    LastError: Error_Type;
}

