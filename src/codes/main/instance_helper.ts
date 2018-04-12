import { LogHelper } from "./log_helper";
import { ERROR_TYPE } from "./enums";
import { IWebWorkerRequest, IWebWorkerResult } from "./interfaces";

export class InstanceHelper {
    private worker_: Worker;
    private isDbOpened_ = false;
    private requestQueue_: IWebWorkerRequest[] = [];
    private isCodeExecuting_ = false;
    private whiteListApi_ = ['create_db', 'is_db_exist', 'get_db_version', 'get_db_list', 'open_db'];
    
    constructor(worker: Worker) {
        if (worker) {
            this.worker_ = worker;
            this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
        }
        else {
            const err = new LogHelper(ERROR_TYPE.WorkerNotSupplied);
            err.throw();
        }
    }

    private onMessageFromWorker_(msg) {
        this.processFinishedQuery_(msg.data);
    }

    private processFinishedQuery_(message: IWebWorkerResult) {
        const finishedRequest: IWebWorkerRequest = this.requestQueue_.shift();
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
                        this.isDbOpened_ = true;
                    }
                    finishedRequest.onSuccess(message.returnedValue);
                }
            }
            this.isCodeExecuting_ = false;
            this.executeQry_();
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
            this.prcoessExecutionOfQry_(request);
        });
    }

    private prcoessExecutionOfQry_(request: IWebWorkerRequest) {
        this.requestQueue_.push(request);
        this.executeQry_();
        LogHelper.log("request pushed: " + request.name);
    }

    private executeQry_() {
        if (!this.isCodeExecuting_ && this.requestQueue_.length > 0) {
            if (this.isDbOpened_) {
                this.sendRequestToWorker_(this.requestQueue_[0]);
                return;
            }
            let allowedQueryIndex = -1;
            this.requestQueue_.every((item, index) => {
                if (this.whiteListApi_.indexOf(item.name) >= 0) {
                    allowedQueryIndex = index;
                    return false;
                }
                return true;
            });
            // shift allowed query to zeroth index
            if (allowedQueryIndex >= 0) {
                this.requestQueue_.splice(0, 0, this.requestQueue_.splice(allowedQueryIndex, 1)[0]);
                this.sendRequestToWorker_(this.requestQueue_[0]);
            }
        }
    }

    private sendRequestToWorker_(firstRequest: IWebWorkerRequest) {
        this.isCodeExecuting_ = true;
        const request = {
            name: firstRequest.name,
            query: firstRequest.query
        } as IWebWorkerRequest;
        LogHelper.log("request executing : " + firstRequest.name);
        this.worker_.postMessage(request);
    }
}