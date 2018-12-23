import { IDbStatus, IQueryResult, IQueryRequest } from "./interfaces";
import { CONNECTION_STATUS } from "./enums";
import { Main } from "./business/main_logic";

export class QueryExecutor {
    static requestQueue: IQueryRequest[] = [];
    static tableName = "LocalStore";
    static columnName = "Key";
    static isCodeExecuting = false;
    static dbStatus: IDbStatus = {
        conStatus: CONNECTION_STATUS.NotStarted,
        lastError: ""
    };

    static prcoessQuery(request: IQueryRequest) {
        this.requestQueue.push(request);
        if (this.requestQueue.length === 1) {
            this.executeCode();
        }
    }

    static executeCode() {
        if (!this.isCodeExecuting && this.requestQueue.length > 0) {
            this.isCodeExecuting = true;
            const request: IQueryRequest = {
                Name: this.requestQueue[0].Name,
                Query: this.requestQueue[0].Query
            } as IQueryRequest;
            new Main(results => {
                this.onQueryFinished(results);
            }).checkConnectionAndExecuteLogic(request);
        }
    }

    static onQueryFinished(message: IQueryResult) {
        const finishedRequest: IQueryRequest = this.requestQueue.shift();
        this.isCodeExecuting = false;
        if (message.ErrorOccured) {
            if (finishedRequest.OnError) {
                finishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.error(message.ErrorDetails);
            }
        }
        else if (finishedRequest.OnSuccess) {
            finishedRequest.OnSuccess(message.ReturnedValue);
        }
        this.executeCode();
    }
}
