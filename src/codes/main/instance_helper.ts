import { LogHelper } from "./log_helper";
import { ERROR_TYPE, API } from "./enums";
import { WebWorkerRequest, WebWorkerResult } from "./types";
import { Config } from "./config";

declare var JsStoreWorker;

export class InstanceHelper {
  private worker_: Worker;
  private isDbOpened_ = false;
  private requestQueue_: WebWorkerRequest[] = [];
  private isCodeExecuting_ = false;
  private queryExecutor_;
  private whiteListApi_ = [
    API.CreateDb,
    API.IsDbExist,
    API.GetDbVersion,
    API.GetDbList,
    API.OpenDb,
    API.GetDbSchema,
    API.Get,
    API.Set,
    API.ChangeLogStatus,
    API.Terminate
  ];

  constructor(worker?: Worker) {
    if (worker) {
      this.worker_ = worker;
      this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
    } else {
      Config.isRuningInWorker = false;
      this.queryExecutor_ = new JsStoreWorker.QueryExecutor(this.processFinishedQuery_.bind(this));
    }
  }

  private onMessageFromWorker_(msg) {
    this.processFinishedQuery_(msg.data);
  }

  private processFinishedQuery_(message: WebWorkerResult) {
    const finishedRequest: WebWorkerRequest = this.requestQueue_.shift();
    if (finishedRequest) {
      LogHelper.log("request finished : " + finishedRequest.name);
      if (message.errorOccured) {
        if (finishedRequest.onError) {
          finishedRequest.onError(message.errorDetails);
        }
      } else {
        if (finishedRequest.onSuccess) {
          const openDbQueries = ["open_db", "create_db"];
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

  protected pushApi<T>(request: WebWorkerRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onSuccess = result => {
        resolve(result as T);
      };
      request.onError = error => {
        reject(error);
      };
      this.prcoessExecutionOfQry_(request);
    });
  }

  private prcoessExecutionOfQry_(request: WebWorkerRequest) {
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

      const allowedQueryIndex = this.requestQueue_.findIndex(
        item => this.whiteListApi_.indexOf(item.name) >= 0
      );

      // shift allowed query to zeroth index
      if (allowedQueryIndex >= 0) {
        this.requestQueue_.splice(
          0,
          0,
          this.requestQueue_.splice(allowedQueryIndex, 1)[0]
        );
        this.sendRequestToWorker_(this.requestQueue_[0]);
      }
    }
  }

  private sendRequestToWorker_(request: WebWorkerRequest) {
    this.isCodeExecuting_ = true;
    LogHelper.log("request executing : " + request.name);
    if (request.name === API.Terminate) {
      if (Config.isRuningInWorker === true) {
        this.worker_.terminate();
      }
      this.isDbOpened_ = false;
      this.processFinishedQuery_({
        returnedValue: null
      } as any);
    }
    else {
      const requestForWorker = {
        name: request.name,
        query: request.query
      } as WebWorkerRequest;
      if (Config.isRuningInWorker === true) {
        this.worker_.postMessage(requestForWorker);
      }
      else {
        this.queryExecutor_.checkConnectionAndExecuteLogic(requestForWorker);
      }
    }
  }
}
