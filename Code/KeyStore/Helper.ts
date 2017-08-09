module KeyStore {
    export var prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
        RequestQueue.push(request);
        if (RequestQueue.length == 1) {
            executeCode();
        }
    }

    export var executeCode = function () {
        if (!IsCodeExecuting && RequestQueue.length > 0) {
            IsCodeExecuting = true;
            var Request = <IWebWorkerRequest>{
                Name: RequestQueue[0].Name,
                Query: RequestQueue[0].Query
            }
            executeCodeDirect(Request);
        }
    }

    export var executeCodeDirect = function (request: IWebWorkerRequest) {
        var That = this;
        new Business.Main(function (results) {
            That.processFinishedRequest(results);
        }).checkConnectionAndExecuteLogic(request);
    }

    export var processFinishedRequest = function (message: IWebWorkerResult) {
        var FinishedRequest: IWebWorkerRequest = RequestQueue.shift();
        IsCodeExecuting = false;
        if (message.ErrorOccured) {
            if (FinishedRequest.OnError) {
                FinishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (FinishedRequest.OnSuccess) {
                if (message.ReturnedValue != null) {
                    FinishedRequest.OnSuccess(message.ReturnedValue);
                }
                else {
                    FinishedRequest.OnSuccess();
                }
            }
        }
        this.executeCode();
    }

}