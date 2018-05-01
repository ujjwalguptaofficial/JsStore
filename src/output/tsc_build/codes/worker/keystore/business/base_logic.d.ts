import { IError } from "../interfaces";
export declare class Base {
    results: any;
    onSuccess: (results) => void;
    onError: (err: IError) => void;
    errorOccured: boolean;
    errorCount: number;
    transaction: IDBTransaction;
    objectStore: IDBObjectStore;
    protected onErrorOccured(e: any): void;
}
