import { IInsert, IError, IQueryRequest } from "../interfaces";
export declare class Main {
    onSuccess: (result) => void;
    constructor(onSuccess?: any);
    set(query: IInsert, onSuccess: (result) => void, onError: (err: IError) => void): void;
    remove(key: string, onSuccess: (result) => void, onError: (err: IError) => void): void;
    get(key: string, onSuccess: (result) => void, onError: (err: IError) => void): void;
    createDb(onSuccess: () => void, onError: (err: IError) => void): void;
    checkConnectionAndExecuteLogic(request: IQueryRequest): void;
    private returnResult(result);
    private executeLogic(request);
}
