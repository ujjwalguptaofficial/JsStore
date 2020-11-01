import { WebWorkerRequest, EventQueue } from "../common/index";
export declare class ConnectionHelper {
    protected activeDbName: string;
    private worker_;
    private isDbOpened_;
    private isDbIdle_;
    private requestQueue_;
    private isCodeExecuting_;
    private inactivityTimer_;
    protected eventQueue: EventQueue[];
    protected middlewares: any[];
    private whiteListApi_;
    constructor(worker?: Worker);
    private initKeyStore_;
    private onMessageFromWorker_;
    private processFinishedQuery_;
    private openDb_;
    private executeMiddleware_;
    protected pushApi<T>(request: WebWorkerRequest): Promise<T>;
    private prcoessExecutionOfQry_;
    private executeQry_;
    private sendRequestToWorker_;
    private callEvent;
}
