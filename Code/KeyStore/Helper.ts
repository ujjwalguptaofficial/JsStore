namespace KeyStore {
    export var prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
        request_queue.push(request);
        if (request_queue.length === 1) {
            executeCode();
        }
    };

    export var executeCode = function () {
        if (!is_code_executing && request_queue.length > 0) {
            is_code_executing = true;
            var request = {
                Name: request_queue[0].Name,
                Query: request_queue[0].Query
            } as IWebWorkerRequest;
            executeCodeDirect(request);
        }
    };

    export var executeCodeDirect = function (request: IWebWorkerRequest) {
        new Business.Main(function (results) {
            this.processFinishedRequest(results);
        }.bind(this)).checkConnectionAndExecuteLogic(request);
    };

    export var processFinishedRequest = function (message: IWebWorkerResult) {
        var finished_request: IWebWorkerRequest = request_queue.shift();
        is_code_executing = false;
        if (message.ErrorOccured) {
            if (finished_request.OnError) {
                finished_request.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (finished_request.OnSuccess) {
                finished_request.OnSuccess(message.ReturnedValue);
            }
        }
        this.executeCode();
    };

}