import { WebWorkerRequest } from "../common/index";
export declare class QueryExecutor {
    static isTransactionQuery: boolean;
    onQueryFinished: (result: any) => void;
    constructor(fn?: (result: any) => void);
    checkConnectionAndExecuteLogic(request: WebWorkerRequest): void;
    private changeLogStatus_;
    private returnResult_;
    private executeLogic_;
    private openDb_;
    private initKeyStore_;
    private getDbSchema_;
    private terminate_;
    private isDbDeletedByBrowser_;
    private getDbList_;
    private activeDb_;
    private closeDb_;
    private dropDb_;
    private processCreateDb;
    private initDb_;
    private activeDbVersion_;
    private getDbVersion_;
    private readonly dbStatus_;
    private checkForIdbSupport_;
    private isDbExist_;
    private get_;
    private set_;
}
