import { WebWorkerResult, WebWorkerRequest } from "../types";
import { QueryExecutor } from "../query_executor";

const onResultEvaluated = function (result: WebWorkerResult) {
    const finishedRequest: WebWorkerRequest = requestQueue.shift();
    if (finishedRequest) {
        if (result.errorOccured) {
            finishedRequest.onError(result.errorDetails as any);
        } else {
            finishedRequest.onSuccess(result.returnedValue);
        }
        isQueryExecuting = false;
        sendQueryForExecution();
    }
};

let isQueryExecuting = false;

const sendQueryForExecution = function () {
    if (isQueryExecuting === false) {
        isQueryExecuting = true;
        executor.checkConnectionAndExecuteLogic(requestQueue[0]);
    }
};

const executor = new QueryExecutor(onResultEvaluated);

export const execute = function (request: WebWorkerRequest) {
    requestQueue.push(request);
    sendQueryForExecution();
};

const requestQueue: WebWorkerRequest[] = [];
