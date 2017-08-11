module JsStore {
    export enum WebWorkerStatus {
        Registered = "registerd",
        Failed = "failed",
        NotStarted = "not_started"
    };

    export class CodeExecutionHelper {
        RequestQueue: Array<IWebWorkerRequest> = [];
        WorkerInstance: Worker;
        IsCodeExecuting = false;
        WorkerStatus: WebWorkerStatus = WebWorkerStatus.NotStarted;

        protected prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
            this.RequestQueue.push(request);
            console.log("request pushed:" + request.Name);
            if (this.RequestQueue.length == 1 && this.WorkerStatus != WebWorkerStatus.NotStarted) {
                console.log("request executing from processExecutionOfCode:" + request.Name);
                this.executeCode();
            }
        }

        private executeCode = function () {
            if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                console.log("request executing" + this.RequestQueue[0].Name)
                this.IsCodeExecuting = true;
                var Request = <IWebWorkerRequest>{
                    Name: this.RequestQueue[0].Name,
                    Query: this.RequestQueue[0].Query
                }
                if (this.WorkerStatus == WebWorkerStatus.Registered) {
                    this.executeCodeUsingWorker(Request);
                } else {
                    this.executeCodeDirect(Request);
                }
            }

        }

        private executeCodeDirect = function (request: IWebWorkerRequest) {
            var That = this;
            new Business.Main(function (results) {
                That.processFinishedRequest(results);
            }).checkConnectionAndExecuteLogic(request);
        }

        private executeCodeUsingWorker = function (request: IWebWorkerRequest) {
            this.WorkerInstance.postMessage(request);
        }

        private processFinishedRequest = function (message: IWebWorkerResult) {
            var FinishedRequest: IWebWorkerRequest = this.RequestQueue.shift();
            this.IsCodeExecuting = false;
            if (FinishedRequest) {
                console.log("request finished:" + FinishedRequest.Name);
                if (message.ErrorOccured) {
                    if (FinishedRequest.OnError) {
                        FinishedRequest.OnError(message.ErrorDetails);
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

        protected createWorker = function () {
            var That = this,
                onFailed = function () {
                    console.warn('JsStore is not runing in web worker');
                    That.WorkerStatus = WebWorkerStatus.Failed;
                    That.executeCode();
                }
            try {
                if (Worker) {
                    var ScriptUrl = this.getScriptUrl();
                    if (ScriptUrl.length > 0) {
                        this.WorkerInstance = new Worker(ScriptUrl);
                        this.WorkerInstance.onmessage = function (msg) {
                            That.onMessageFromWorker(msg);
                        }
                        setTimeout(function () {
                            if (That.WorkerStatus != WebWorkerStatus.Failed) {
                                That.WorkerStatus = WebWorkerStatus.Registered;
                            }
                            That.executeCode();
                        }, 100);
                    }
                    else {
                        onFailed();
                    }

                }
                else {
                    onFailed();
                }
            }
            catch (ex) {
                onFailed();
            }
        }

        private getScriptUrl(fileName: string) {
            var ScriptUrl = "";
            var FileName = fileName ? fileName.toLowerCase() : "jsstorage";
            var Scripts = document.getElementsByTagName('script');
            for (var i = Scripts.length - 1, url = ""; i >= 0; i--) {
                url = Scripts[i].src.toLowerCase();
                if (url.length > 0 && url.indexOf(FileName) >= 0) {
                    ScriptUrl = url;
                    console.log(ScriptUrl);
                    break;
                }
            }
            return ScriptUrl;
        }

        private onMessageFromWorker = function (msg) {
            if (typeof msg.data == 'string') {
                var Datas = msg.data.split(':')[1];
                switch (Datas) {
                    case 'WorkerFailed': this.WorkerStatus = WebWorkerStatus.Failed;
                        console.warn('JsStore is not runing in web worker');
                        break;
                }
            }
            else {
                this.processFinishedRequest(msg.data);
            }

        }

    }
}
