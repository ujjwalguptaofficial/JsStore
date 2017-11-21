module JsStore {
    export var WorkerStatus: WebWorkerStatus = WebWorkerStatus.NotStarted,
        WorkerInstance: Worker;
    export class CodeExecutionHelper {
        RequestQueue: Array<IWebWorkerRequest> = [];
        IsCodeExecuting = false;

        protected pushApi = function (request: IWebWorkerRequest, usePromise: boolean) {
            if (usePromise === true) {
                var That = this;
                return new Promise(function (resolve, reject) {
                    request.OnSuccess = function (result) {
                        resolve(result);
                    };
                    request.OnError = function (error) {
                        reject(error);
                    };
                    That.prcoessExecutionOfCode(request);
                });
            }
            else {
                this.prcoessExecutionOfCode(request);
                return this;
            }
        }

        private prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
            if (Status.ConStatus == ConnectionStatus.NotStarted) {
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this.RequestQueue.splice(0, 0, request);
                        if (WorkerStatus != WebWorkerStatus.NotStarted) {
                            this.executeCode();
                        };
                        Status.ConStatus = ConnectionStatus.Connected;
                        break;
                    default: this.RequestQueue.push(request);
                }
            }
            else {
                this.RequestQueue.push(request);
                if (this.RequestQueue.length == 1 && WorkerStatus != WebWorkerStatus.NotStarted) {
                    this.executeCode();
                }
            }
            log("request pushed: " + request.Name);
        }

        private executeCode = function () {
            if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                this.IsCodeExecuting = true;
                var FirstRequest = this.RequestQueue[0],
                    Request = <IWebWorkerRequest>{
                        Name: FirstRequest.Name,
                        Query: FirstRequest.Query
                    }
                log("request executing : " + FirstRequest.Name);
                if (WorkerStatus == WebWorkerStatus.Registered) {
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
            WorkerInstance.postMessage(request);
        }

        private processFinishedRequest = function (message: IWebWorkerResult) {
            var FinishedRequest: IWebWorkerRequest = this.RequestQueue.shift();
            this.IsCodeExecuting = false;
            if (FinishedRequest) {
                log("request finished : " + FinishedRequest.Name);
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

        private onWorkerFailed = function () {
            console.warn('JsStore is not runing in web worker');
            WorkerStatus = WebWorkerStatus.Failed;
            if (Status.ConStatus == ConnectionStatus.NotStarted) {
                this.executeCode();
            }
        }

        protected createWorker = function () {
            var That: CodeExecutionHelper = this;
            try {
                if (Worker) {
                    var ScriptUrl = this.getScriptUrl();
                    if (ScriptUrl && ScriptUrl.length > 0) {
                        WorkerInstance = new Worker(ScriptUrl);
                        WorkerInstance.onmessage = function (msg) {
                            That.onMessageFromWorker(msg);
                        }
                        That.executeCodeUsingWorker(<IWebWorkerRequest>{
                            Name: 'change_log_status',
                            Query: {
                                logging: EnableLog
                            }
                        });
                        setTimeout(function () {
                            if (WorkerStatus != WebWorkerStatus.Failed) {
                                WorkerStatus = WebWorkerStatus.Registered;
                            }
                            if (Status.ConStatus == ConnectionStatus.Connected) {
                                That.executeCode();
                            }
                        }, 100);
                    }
                    else {
                        That.onWorkerFailed();
                    }

                }
                else {
                    That.onWorkerFailed();
                }
            }
            catch (ex) {
                That.onWorkerFailed();
            }
        }

        private getScriptUrl(fileName: string) {
            var ScriptUrl = "";
            var FileName = fileName ? fileName.toLowerCase() : "jsstore";
            var Scripts = document.getElementsByTagName('script');
            for (var i = Scripts.length - 1, url = ""; i >= 0; i--) {
                url = Scripts[i].src;
                url = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
                if (url.length > 0 && url.indexOf(FileName) >= 0) {
                    ScriptUrl = Scripts[i].src;
                    return ScriptUrl;
                }
            }
            return ScriptUrl;
        }

        private onMessageFromWorker = function (msg) {
            var That = this;
            if (typeof msg.data == 'string') {
                var Datas = msg.data.split(':')[1];
                switch (Datas) {
                    case 'WorkerFailed': That.onWorkerFailed();
                        break;
                }
            }
            else {
                this.processFinishedRequest(msg.data);
            }

        }
    }
}
