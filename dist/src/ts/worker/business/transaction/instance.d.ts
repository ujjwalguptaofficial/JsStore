import { TranscationQuery, WebWorkerRequest } from "../../types";
import { Base } from "../base";
import { IError } from "../../interfaces";
export declare class Instance extends Base {
    query: TranscationQuery;
    results: any;
    requestQueue: WebWorkerRequest[];
    isQueryExecuting: boolean;
    isTransactionStarted: boolean;
    constructor(qry: TranscationQuery, onSuccess: (results: any) => void, onError: (err: IError) => void);
    execute(): void;
    private startTransaction_;
    private initTransaction_;
    private onTransactionCompleted_;
    onRequestFinished_(result: any): void;
    abortTransaction(): void;
    executeRequest(request: WebWorkerRequest): void;
    pushRequest(request: WebWorkerRequest): Promise<{}>;
    processExecutionOfQry(): void;
    private checkQueries;
}
