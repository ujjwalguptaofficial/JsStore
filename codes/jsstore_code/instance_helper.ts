import { LogHelper } from "./log_helper";
import { Error_Type } from "./enums";
import { IWebWorkerRequest, IWebWorkerResult } from "./interfaces";

export class InstanceHelper {
    private _worker: Worker;
    private _isDbOpened: boolean = false;
    private _requestQueue: IWebWorkerRequest[] = [];
    private _isCodeExecuting = false;
    private _whiteListApi = []
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

    executeQry() {
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            this._isCodeExecuting = true;
            var first_request = this._requestQueue[0],
                request = {
                    Name: first_request.Name,
                    Query: first_request.Query
                } as IWebWorkerRequest;
            LogHelper.log("request executing : " + first_request.Name);
            this._worker.postMessage(request);
        }
    }

    onMessageFromWorker(msg) {
        this.processFinishedQuery(msg.data);
    }

    private processFinishedQuery(message: IWebWorkerResult) {
        var finished_request: IWebWorkerRequest = this._requestQueue.shift();
        this._isCodeExecuting = false;
        if (finished_request) {
            LogHelper.log("request finished : " + finished_request.Name);
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
        // if (this._isDbOpened === false) {
        //     switch (request.Name) {
        //         case 'create_db':
        //         case 'is_db_exist':
        //         case 'get_db_version':
        //         case 'get_db_list':
        //         case 'open_db':
        //             this._requestQueue.splice(0, 0, request);
        //             this._isDbOpened = true;
        //             this.executeQry();
        //             break;
        //         default: this._requestQueue.push(request);
        //     }
        // }
        // else {
        this._requestQueue.push(request);
        if (this._requestQueue.length === 1) {
            this.executeQry();
        }
        // }
        LogHelper.log("request pushed: " + request.Name);
    }
}