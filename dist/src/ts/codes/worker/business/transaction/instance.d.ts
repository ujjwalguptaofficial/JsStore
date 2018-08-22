import { ITranscationQry, IError, IWebWorkerRequest } from "../../interfaces";
import { Base } from "../base";
export declare class Instance extends Base {
    query: ITranscationQry;
    results: any;
    requestQueue: IWebWorkerRequest[];
    isQueryExecuting: boolean;
    isTransactionStarted: boolean;
    constructor(qry: ITranscationQry, onSuccess: (results: any) => void, onError: (err: IError) => void);
    execute(): void;
    private startTransaction_;
    private initTransaction_;
    private onTransactionCompleted_;
    onRequestFinished_(result: any): void;
    abortTransaction(): void;
    executeRequest(request: IWebWorkerRequest): void;
    pushRequest(request: IWebWorkerRequest): Promise<{}>;
    processExecutionOfQry(): void;
    private checkQueries;
}
