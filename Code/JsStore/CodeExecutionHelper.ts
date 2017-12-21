namespace JsStore {
    export var worker_status: WebWorkerStatus = WebWorkerStatus.NotStarted,
        worker_instance: Worker;
    export class CodeExecutionHelper {
        _requestQueue: IWebWorkerRequest[] = [];
        _isCodeExecuting = false;

        protected pushApi = function (request: IWebWorkerRequest, usePromise: boolean) {
            if (usePromise === true) {
                var that = this;
                return new Promise(function (resolve, reject) {
                    request.OnSuccess = function (result) {
                        resolve(result);
                    };
                    request.OnError = function (error) {
                        reject(error);
                    };
                    that.prcoessExecutionOfCode(request);
                });
            }
            else {
                this.prcoessExecutionOfCode(request);
                return this;
            }
        };

        protected createWorker = function () {
            var that: CodeExecutionHelper = this;
            try {
                if (Worker) {
                    var script_url = this.getScriptUrl();
                    if (script_url && script_url.length > 0) {
                        worker_instance = new Worker(script_url);
                        worker_instance.onmessage = function (msg) {
                            that.onMessageFromWorker(msg);
                        };
                        that.executeCodeUsingWorker({
                            Name: 'change_log_status',
                            Query: {
                                logging: enable_log
                            }
                        } as IWebWorkerRequest);
                        setTimeout(function () {
                            if (worker_status !== WebWorkerStatus.Failed) {
                                worker_status = WebWorkerStatus.Registered;
                            }
                            if (status.ConStatus === ConnectionStatus.Connected) {
                                that.executeCode();
                            }
                        }, 100);
                    }
                    else {
                        that.onWorkerFailed();
                    }

                }
                else {
                    that.onWorkerFailed();
                }
            }
            catch (ex) {
                that.onWorkerFailed();
            }
        };

        private prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
            if (status.ConStatus === ConnectionStatus.NotStarted) {
                switch (request.Name) {
                    case 'create_db':
                    case 'open_db':
                        this._requestQueue.splice(0, 0, request);
                        if (worker_status !== WebWorkerStatus.NotStarted) {
                            this.executeCode();
                        }
                        status.ConStatus = ConnectionStatus.Connected;
                        break;
                    default: this._requestQueue.push(request);
                }
            }
            else {
                this.RequestQueue.push(request);
                if (this.RequestQueue.length === 1 && worker_status !== WebWorkerStatus.NotStarted) {
                    this.executeCode();
                }
            }
            log("request pushed: " + request.Name);
        }

        private executeCode = function () {
            if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                this.IsCodeExecuting = true;
                var first_request = this.RequestQueue[0],
                    request = {
                        Name: first_request.Name,
                        Query: first_request.Query
                    } as IWebWorkerRequest;
                log("request executing : " + first_request.Name);
                if (worker_status === WebWorkerStatus.Registered) {
                    this.executeCodeUsingWorker(request);
                } else {
                    this.executeCodeDirect(request);
                }
            }
        }

        private executeCodeDirect = function (request: IWebWorkerRequest) {
            var that = this;
            new Business.Main(function (results) {
                that.processFinishedRequest(results);
            }).checkConnectionAndExecuteLogic(request);
        };

        private executeCodeUsingWorker = function (request: IWebWorkerRequest) {
            worker_instance.postMessage(request);
        };

        private processFinishedRequest = function (message: IWebWorkerResult) {
            var finished_request: IWebWorkerRequest = this._requestQueue.shift();
            this.IsCodeExecuting = false;
            if (finished_request) {
                log("request finished : " + finished_request.Name);
                if (message.ErrorOccured) {
                    if (finished_request.OnError) {
                        finished_request.OnError(message.ErrorDetails);
                    }
                }
                else {
                    if (finished_request.OnSuccess) {
                        if (message.ReturnedValue != null) {
                            finished_request.OnSuccess(message.ReturnedValue);
                        }
                        else {
                            finished_request.OnSuccess();
                        }
                    }
                }
                this.executeCode();
            }
        }

        private onWorkerFailed = function () {
            console.warn('JsStore is not runing in web worker');
            worker_status = WebWorkerStatus.Failed;
            if (status.ConStatus === ConnectionStatus.NotStarted) {
                this.executeCode();
            }
        };

        private getScriptUrl(fileName: string) {
            var script_url = "";
            var file_name = fileName ? fileName.toLowerCase() : "jsstore";
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length - 1, url = ""; i >= 0; i--) {
                url = scripts[i].src;
                url = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
                if (url.length > 0 && url.indexOf(file_name) >= 0) {
                    script_url = scripts[i].src;
                    return script_url;
                }
            }
            return script_url;
        }

        private onMessageFromWorker = function (msg) {
            var that = this;
            if (typeof msg.data === 'string') {
                var datas = msg.data.split(':')[1];
                switch (datas) {
                    case 'WorkerFailed': that.onWorkerFailed();
                        break;
                }
            }
            else {
                this.processFinishedRequest(msg.data);
            }
        };
    }
}
