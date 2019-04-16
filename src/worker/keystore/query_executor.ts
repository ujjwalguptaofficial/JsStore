import { IQueryResult, IQueryRequest } from "./interfaces";
import { Main } from "./business/main_logic";
import { promise } from "../helpers/index";

export class QueryExecutor {
    static requestQueue: IQueryRequest[] = [];
    static tableName = "LocalStore";
    static columnName = "Key";
    static isCodeExecuting = false;
    static prcoessQuery<T>(request: IQueryRequest) {
        return promise<T>((resolve, reject) => {
            request.onSuccess = (result) => {
                resolve(result);
            };
            request.onError = (error) => {
                if (process.env.NODE_ENV === 'dev') {
                    console.error(error);
                }
                reject(error);
            };
            this.requestQueue.push(request);
            this.executeCode();
        });
    }

    static executeCode() {
        if (!this.isCodeExecuting && this.requestQueue.length > 0) {
            this.isCodeExecuting = true;
            const request: IQueryRequest = {
                name: this.requestQueue[0].name,
                query: this.requestQueue[0].query
            } as IQueryRequest;
            new Main(this.onQueryFinished.bind(this)).checkConnectionAndExecuteLogic(request);
        }
    }

    static onQueryFinished(message: IQueryResult) {
        const finishedRequest: IQueryRequest = this.requestQueue.shift();
        this.isCodeExecuting = false;
        if (message.errorOccured) {
            finishedRequest.onError(message.errorDetails);
        }
        else {
            finishedRequest.onSuccess(message.returnedValue);
        }
        this.executeCode();
    }
}
