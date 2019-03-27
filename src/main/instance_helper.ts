import { LogHelper } from "./log_helper";
import { API } from "./enums";
import { WebWorkerRequest, WebWorkerResult } from "./types";
import { Config } from "./config";

declare var JsStoreWorker;
export class InstanceHelper {
  private worker_: Worker;
  private isDbOpened_ = false;
  private requestQueue_: WebWorkerRequest[] = [];
  private isCodeExecuting_ = false;

  // these apis have special permissions. These apis dont wait for database open.
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
    API.Terminate,
    API.InitKeyStore
  ];

  constructor(worker?: Worker) {
    if (worker) {
      this.worker_ = worker;
      this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
      this.pushApi({
        name: API.InitKeyStore
      } as WebWorkerRequest);
    } else {
      Config.isRuningInWorker = false;
      JsStoreWorker.KeyStore.init();
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
        finishedRequest.onError(message.errorDetails);
      } else {
        switch (finishedRequest.name) {
          case API.OpenDb:
          case API.CreateDb:
            this.isDbOpened_ = true; break;
          case API.Terminate:
            this.isDbOpened_ = false;
            if (Config.isRuningInWorker === true) {
              this.worker_.terminate();
            }
            break;
        }
        finishedRequest.onSuccess(message.returnedValue);
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
    LogHelper.log("request pushed: " + request.name);
    this.executeQry_();
  }

  private executeQry_() {
    if (!this.isCodeExecuting_ && this.requestQueue_.length > 0) {
      if (this.isDbOpened_ === true) {
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
    const requestForWorker = {
      name: request.name,
      query: request.query
    } as WebWorkerRequest;
    if (Config.isRuningInWorker === true) {
      this.worker_.postMessage(requestForWorker);
    }
    else {
      new JsStoreWorker.QueryExecutor(this.processFinishedQuery_.bind(this)).checkConnectionAndExecuteLogic(requestForWorker);
    }

  }
}
