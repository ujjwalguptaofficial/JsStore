import { IDbStatus, IQueryResult, IQueryRequest } from "./interfaces";
import { Connection_Status } from "./enums";
import { Main } from "./business/main_logic";

export class QueryExecutor {
    static _requestQueue: IQueryRequest[] = [];
    static _tableName = "LocalStore";
    static _columnName = "Key";
    static _isCodeExecuting = false;
    static _dbStatus: IDbStatus = {
        ConStatus: Connection_Status.NotStarted,
        LastError: ""
    };

    static prcoessQuery(request: IQueryRequest) {
        this._requestQueue.push(request);
        if (this._requestQueue.length === 1) {
            this.executeCode();
        }
    }

    static executeCode() {
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            this._isCodeExecuting = true;
            var request: IQueryRequest = {
                Name: this._requestQueue[0].Name,
                Query: this._requestQueue[0].Query
            } as IQueryRequest;
            new Main(results => {
                this.onQueryFinished(results);
            }).checkConnectionAndExecuteLogic(request);
        }
    }

    static onQueryFinished(message: IQueryResult) {
        var finished_request: IQueryRequest = this._requestQueue.shift();
        this._isCodeExecuting = false;
        if (message.ErrorOccured) {
            if (finished_request.OnError) {
                finished_request.OnError(message.ErrorDetails);
            }
            else {
                console.error(message.ErrorDetails);
            }
        }
        else if (finished_request.OnSuccess) {
            finished_request.OnSuccess(message.ReturnedValue);
        }
        this.executeCode();
    }
}

// export var query_executor_instance = new QueryExecutor();

// export default (new QueryExecutor());