import { LogHelper } from "./log_helper";
import { Error_Type } from "./enums";
import { IWebWorkerRequest, IWebWorkerResult } from "./interfaces";

export class InstanceHelper {
    private _worker: Worker;
    private _isDbOpened: boolean = false;
    private _requestQueue: IWebWorkerRequest[] = [];
    private _isCodeExecuting = false;
    private _whiteListApi = ['create_db', 'is_db_exist', 'get_db_version', 'get_db_list', 'open_db'];
    constructor(worker: Worker) {
        if (worker) {
            this._worker = worker;
            this._worker.onmessage = this.onMessageFromWorker.bind(this);
        }
        else {
            var err = new LogHelper(Error_Type.WorkerNotSupplied);
            err.throw();
        }
    }

    onMessageFromWorker(msg) {
        this.processFinishedQuery(msg.data);
    }

    private processFinishedQuery(message: IWebWorkerResult) {
        var finished_request: IWebWorkerRequest = this._requestQueue.shift();
        if (finished_request) {
            LogHelper.log("request finished : " + finished_request.Name);
            if (message.ErrorOccured) {
                if (finished_request.OnError) {
                    finished_request.OnError(message.ErrorDetails);
                }
            }
            else {
                if (finished_request.OnSuccess) {
                    var open_db_queries = ['open_db', 'create_db'];
                    if (open_db_queries.indexOf(finished_request.Name) >= 0) {
                        this._isDbOpened = true;
                    }
                    finished_request.OnSuccess(message.ReturnedValue);
                }
            }
            this._isCodeExecuting = false;
            this.executeQry();
        }
    }

    protected pushApi<T>(request: IWebWorkerRequest): Promise<T> {
        return new Promise((resolve, reject) => {
            request.OnSuccess = (result) => {
                resolve(result as T);
            };
            request.OnError = (error) => {
                reject(error);
            };
            this.prcoessExecutionOfQry(request);
        });
    }

    private prcoessExecutionOfQry(request: IWebWorkerRequest) {
        this._requestQueue.push(request);
        this.executeQry();
        LogHelper.log("request pushed: " + request.Name);
    }

    private executeQry() {
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            if (this._isDbOpened) {
                this.sendRequestToWorker(this._requestQueue[0]);
                return;
            }
            var allowed_query_index = -1;
            this._requestQueue.every((item, index) => {
                if (this._whiteListApi.indexOf(item.Name) >= 0) {
                    allowed_query_index = index;
                    return false;
                }
                return true;
            });
            // shift allowed query to zeroth index
            if (allowed_query_index >= 0) {
                this._requestQueue.splice(0, 0, this._requestQueue.splice(allowed_query_index, 1)[0]);
                this.sendRequestToWorker(this._requestQueue[0]);
            }
        }
    }

    private sendRequestToWorker(firsrtRequest: IWebWorkerRequest) {
        this._isCodeExecuting = true;
        var request = {
            Name: firsrtRequest.Name,
            Query: firsrtRequest.Query
        } as IWebWorkerRequest;
        LogHelper.log("request executing : " + firsrtRequest.Name);
        this._worker.postMessage(request);
    }
}