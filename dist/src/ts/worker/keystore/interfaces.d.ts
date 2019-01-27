import { CONNECTION_STATUS } from "./enums";
export interface IDbStatus {
    conStatus: CONNECTION_STATUS;
    lastError?: string;
}
export interface IInsert {
    Key: string;
    Value: any;
}
export interface IQueryRequest {
    name: string;
    query: any;
    onSuccess?: (result: any) => void;
    onError?: (err: IError) => void;
}
export interface IError {
    type: string;
    message: string;
}
export interface IQueryResult {
    errorOccured: boolean;
    errorDetails: any;
    returnedValue: any;
}
