import { WebWorkerRequest } from "./types";
export declare class InstanceHelper {
    private worker_;
    private isDbOpened_;
    private requestQueue_;
    private isCodeExecuting_;
    private queryExecutor_;
    private whiteListApi_;
    constructor(worker?: Worker);
    private onMessageFromWorker_;
    private processFinishedQuery_;
    protected pushApi<T>(request: WebWorkerRequest): Promise<T>;
    private prcoessExecutionOfQry_;
    private executeQry_;
    private sendRequestToWorker_;
}
