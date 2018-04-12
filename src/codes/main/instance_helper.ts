import { LogHelper } from "./log_helper";
import { ERROR_TYPE } from "./enums";
import { IWebWorkerRequest, IWebWorkerResult } from "./interfaces";

export class InstanceHelper {
    private _worker: Worker;
    private isDbOpened = false;
    private requestQueue: IWebWorkerRequest[] = [];
    private isCodeExecuting = false;
    private whiteListApi = ['create_db', 'is_db_exist', 'get_db_version', 'get_db_list', 'open_db'];
    constructor(worker: Worker) {
        if (worker) {
            this._worker = worker;
            this._worker.onmessage = this.onMessageFromWorker.bind(this);
        }
        else {
            const err = new LogHelper(ERROR_TYPE.WorkerNotSupplied);
            err.throw();
        }
    }

    onMessageFromWorker(msg) {
        this.processFinishedQuery(msg.data);
    }

    private processFinishedQuery(message: IWebWorkerResult) {
        const finishedRequest: IWebWorkerRequest = this.requestQueue.shift();
        if (finishedRequest) {
            LogHelper.log("request finished : " + finishedRequest.name);
            if (message.errorOccured) {
                if (finishedRequest.onError) {
                    finishedRequest.onError(message.errorDetails);
                }
            }
            else {
                if (finishedRequest.onSuccess) {
                    const openDbQueries = ['open_db', 'create_db'];
                    if (openDbQueries.indexOf(finishedRequest.name) >= 0) {
                        this.isDbOpened = true;
                    }
                    finishedRequest.onSuccess(message.returnedValue);
                }
            }
            this.isCodeExecuting = false;
            this.executeQry();
        }
    }

    protected pushApi<T>(request: IWebWorkerRequest): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onSuccess = (result) => {
                resolve(result as T);
            };
            request.onError = (error) => {
                reject(error);
            };
            this.prcoessExecutionOfQry(request);
        });
    }

    private prcoessExecutionOfQry(request: IWebWorkerRequest) {
        this.requestQueue.push(request);
        this.executeQry();
        LogHelper.log("request pushed: " + request.name);
    }

    private executeQry() {
        if (!this.isCodeExecuting && this.requestQueue.length > 0) {
            if (this.isDbOpened) {
                this.sendRequestToWorker(this.requestQueue[0]);
                return;
            }
            let allowedQueryIndex = -1;
            this.requestQueue.every((item, index) => {
                if (this.whiteListApi.indexOf(item.name) >= 0) {
                    allowedQueryIndex = index;
                    return false;
                }
                return true;
            });
            // shift allowed query to zeroth index
            if (allowedQueryIndex >= 0) {
                this.requestQueue.splice(0, 0, this.requestQueue.splice(allowedQueryIndex, 1)[0]);
                this.sendRequestToWorker(this.requestQueue[0]);
            }
        }
    }

    private sendRequestToWorker(firstRequest: IWebWorkerRequest) {
        this.isCodeExecuting = true;
        const request = {
            name: firstRequest.name,
            query: firstRequest.query
        } as IWebWorkerRequest;
        LogHelper.log("request executing : " + firstRequest.name);
        this._worker.postMessage(request);
    }
}