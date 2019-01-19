import { TranscationQuery, WebWorkerRequest } from "../../types";
import { Base } from "../base";
import { IError } from "../../interfaces";
export declare class Instance extends Base {
    query: TranscationQuery;
    results: any;
    requestQueue: WebWorkerRequest[];
    isQueryExecuting: boolean;
    constructor(qry: TranscationQuery, onSuccess: (results: any) => void, onError: (err: IError) => void);
    execute(): void;
    private startTransaction_;
    private initTransaction_;
    private onTransactionCompleted_;
    private onRequestFinished_;
    private abortTransaction_;
    private executeRequest_;
    private pushRequest_;
    private processExecutionOfQry_;
    private checkQueries_;
}
