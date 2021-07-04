import { IError, IDataBase } from "./interfaces";
import { API, EVENT } from "./enums";

export type WebWorkerRequest = {
    name: API;
    query?: any;
    onSuccess?: (results?) => void;
    onError?: (err: IError) => void;
    onResult?: (cb: (result: any) => Promise<any>) => void;
    beforeExecute?: (cb: (result: any) => Promise<any>) => void;
};

export type WebWorkerResult = {
    error?: any;
    result?: any;
};


export type SqlWebResult = {
    api: string;
    data: any;
};

export type EventQueue = {
    event: EVENT;
    callback: Function
};

export type SetQuery = {
    key: string;
    value: any;
};



export type TStringAny = { [key: string]: any };

export type TMiddleware = (request: WebWorkerRequest) => Promise<any>;

export type InitDbResult = {
    isCreated: boolean,
    database?: IDataBase,
    oldVersion: number,
    newVersion: number
};
