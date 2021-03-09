import { TranscationQuery, WebWorkerRequest, IError } from "../../../common/index";
import { Base } from "../base";
export declare class Instance extends Base {
    query: TranscationQuery;
    results: any;
    reqQueue: WebWorkerRequest[];
    isQueryExecuting: boolean;
    isTxStarted_: boolean;
    constructor(qry: TranscationQuery, onSuccess: (results: any) => void, onError: (err: IError) => void);
    execute(): void;
    private startExecution_;
    private startTx_;
    private initTx_;
    private onTxCompleted_;
    private onReqFinished_;
    private abortTx_;
    private executeRequest_;
    private pushReq_;
    private processExecutionOfQry_;
    private checkQueries_;
    private getNotExistingTable_;
}
