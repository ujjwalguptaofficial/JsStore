import { IWebWorkerRequest } from "./interfaces";
export declare class QueryExecutor {
    checkConnectionAndExecuteLogic(request: IWebWorkerRequest): void;
    private changeLogStatus_(enableLog);
    private returnResult_(result);
    private executeLogic_(request);
    private getDbSchema_(dbName, callback);
    private isDbDeletedByBrowser_;
    private getDbList_(callback);
    private activeDb_;
    private openDb_(dbName, onSuccess, onError);
    private closeDb_();
    private dropDb_(onSuccess, onError);
    private update_(query, onSuccess, onError);
    private insert_(query, onSuccess, onError);
    private bulkInsert_(query, onSuccess, onError);
    private remove_(query, onSuccess, onError);
    private select_(query, onSuccess, onError);
    private count_(query, onSuccess, onError);
    private createDb_(dataBase, onSuccess, onError);
    private activeDbVersion_;
    private getDbVersion_(dbName, callback);
    private readonly dbStatus_;
    private clear_(tableName, onSuccess, onError);
    private exportJson_(query, onSuccess, onError);
    private getType_(value);
    private isDbExist_(dbInfo, onSuccess, onError);
}
