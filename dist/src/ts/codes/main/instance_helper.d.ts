import { IWebWorkerRequest } from "./interfaces";
export declare class InstanceHelper {
    private worker_;
    private isDbOpened_;
    private requestQueue_;
    private isCodeExecuting_;
    private queryExecutor_;
    private whiteListApi_;
    constructor(worker?: Worker);
    private onMessageFromWorker_(msg);
    private processFinishedQuery_(message);
    protected pushApi<T>(request: IWebWorkerRequest): Promise<T>;
    private prcoessExecutionOfQry_(request);
    private executeQry_();
    private sendRequestToWorker_(request);
}
