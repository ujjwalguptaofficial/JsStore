import { WebWorker_Status, Connection_Status } from "./enums";
import { IWebWorkerRequest, IWebWorkerResult } from "./interfaces";
import { file_name, enable_log, db_status, log } from "./common_logic";
import { QueryExecutor } from "./web_worker/query_executor";

export var worker_status: WebWorker_Status = WebWorker_Status.NotStarted,
    worker_instance: Worker;
export class QueryExecutionHelper {
    private _requestQueue: IWebWorkerRequest[] = [];
    private _isCodeExecuting = false;

    protected pushApi(request: IWebWorkerRequest, usePromise: boolean) {
        if (usePromise === true) {
            return new Promise(function (resolve, reject) {
                request.OnSuccess = function (result) {
                    resolve(result);
                };
                request.OnError = function (error) {
                    reject(error);
                };
                this.prcoessExecutionOfCode(request);
            }.bind(this));
        }
        else {
            this.prcoessExecutionOfCode(request);
            return this;
        }
    }

    protected createWorker() {
        try {
            if (Worker) {
                var script_url = this.getScriptUrl(file_name);
                if (script_url && script_url.length > 0) {
                    worker_instance = new Worker(script_url);
                    worker_instance.onmessage = function (msg) {
                        this.onMessageFromWorker(msg);
                    }.bind(this);
                    this.executeCodeUsingWorker({
                        Name: 'change_log_status',
                        Query: {
                            logging: enable_log
                        }
                    } as IWebWorkerRequest);
                    setTimeout(function () {
                        if (worker_status !== WebWorker_Status.Failed) {
                            worker_status = WebWorker_Status.Registered;
                        }
                        if (db_status.ConStatus === Connection_Status.Connected) {
                            this.executeCode();
                        }
                    }.bind(this), 100);
                }
                else {
                    this.onWorkerFailed();
                }

            }
            else {
                this.onWorkerFailed();
            }
        }
        catch (ex) {
            this.onWorkerFailed();
        }
    }

    private prcoessExecutionOfCode(request: IWebWorkerRequest) {
        if (db_status.ConStatus === Connection_Status.NotStarted) {
            switch (request.Name) {
                case 'create_db':
                case 'open_db':
                    this._requestQueue.splice(0, 0, request);
                    if (worker_status !== WebWorker_Status.NotStarted) {
                        this.executeCode();
                    }
                    db_status.ConStatus = Connection_Status.Connected;
                    break;
                default: this._requestQueue.push(request);
            }
        }
        else {
            this._requestQueue.push(request);
            if (this._requestQueue.length === 1 && worker_status !== WebWorker_Status.NotStarted) {
                this.executeCode();
            }
        }
        log("request pushed: " + request.Name);
    }

    private executeCode() {
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            this._isCodeExecuting = true;
            var first_request = this._requestQueue[0],
                request = {
                    Name: first_request.Name,
                    Query: first_request.Query
                } as IWebWorkerRequest;
            log("request executing : " + first_request.Name);
            if (worker_status === WebWorker_Status.Registered) {
                this.executeCodeUsingWorker(request);
            } else {
                this.executeCodeDirect(request);
            }
        }
    }

    private executeCodeDirect(request: IWebWorkerRequest) {
        new QueryExecutor(function (results) {
            this.processFinishedRequest(results);
        }.bind(this)).checkConnectionAndExecuteLogic(request);
    }

    private executeCodeUsingWorker(request: IWebWorkerRequest) {
        worker_instance.postMessage(request);
    }

    private processFinishedRequest(message: IWebWorkerResult) {
        var finished_request: IWebWorkerRequest = this._requestQueue.shift();
        this._isCodeExecuting = false;
        if (finished_request) {
            log("request finished : " + finished_request.Name);
            if (message.ErrorOccured) {
                if (finished_request.OnError) {
                    finished_request.OnError(message.ErrorDetails);
                }
            }
            else {
                if (finished_request.OnSuccess) {
                    finished_request.OnSuccess(message.ReturnedValue);
                }
            }
            this.executeCode();
        }
    }

    private onWorkerFailed() {
        console.warn('JsStore is not runing in web worker');
        worker_status = WebWorker_Status.Failed;
        if (db_status.ConStatus === Connection_Status.NotStarted) {
            this.executeCode();
        }
    }

    private getScriptUrl(fileName: string) {
        var script_url = "";
        var temp_file_name = fileName ? fileName.toLowerCase() : "jsstore";
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1, url = ""; i >= 0; i--) {
            url = scripts[i].src;
            url = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
            if (url.length > 0 && url.indexOf(temp_file_name) >= 0) {
                script_url = scripts[i].src;
                return script_url;
            }
        }
        return script_url;
    }

    private onMessageFromWorker(msg) {
        if (typeof msg.data === 'string') {
            var datas = msg.data.split(':')[1];
            switch (datas) {
                case 'WorkerFailed': this.onWorkerFailed();
                    break;
            }
        }
        else {
            this.processFinishedRequest(msg.data);
        }
    }
}
