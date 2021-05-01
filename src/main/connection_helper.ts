import { LogHelper } from "./log_helper";
import { Config } from "./config";
import { WebWorkerRequest, EventQueue, API, WebWorkerResult, EVENT, promise, IDataBase, IDbInfo } from "../common/index";

declare var JsStoreWorker;
export class ConnectionHelper {
  protected database: IDataBase;
  private worker_: Worker;
  private isConOpened_ = false;
  private isDbIdle_ = true;
  private requestQueue_: WebWorkerRequest[] = [];
  private isCodeExecuting_ = false;

  private inactivityTimer_ = -1000;

  protected eventQueue: EventQueue[] = [];

  protected middlewares = [];

  // these apis have special permissions. These apis dont wait for database open.
  private whiteListApi_ = [
    API.InitDb,
    API.OpenDb,
    API.GetDbSchema,
    API.Get,
    API.Set,
    API.ChangeLogStatus,
    API.Terminate,
    API.DropDb
  ];

  queryManager;

  constructor(worker?: Worker) {
    if (worker) {
      this.worker_ = worker;
      this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
    } else {
      Config.isRuningInWorker = false;
      this.queryManager = new JsStoreWorker.QueryManager(this.processFinishedQuery_.bind(this));
    }
  }

  private onMessageFromWorker_(msg) {
    this.processFinishedQuery_(msg.data);
  }

  private processFinishedQuery_(message: WebWorkerResult) {

    const finishedRequest: WebWorkerRequest = this.requestQueue_.shift();
    if (finishedRequest) {
      LogHelper.log(`request ${finishedRequest.name} finished`);
      if (message.error) {
        finishedRequest.onError(message.error);
      } else {
        switch (finishedRequest.name) {
          case API.OpenDb:
          case API.InitDb:
            this.isConOpened_ = true; break;
          case API.Terminate:
            this.isConOpened_ = false;
            if (Config.isRuningInWorker === true) {
              this.worker_.terminate();
            }
            break;
          case API.DropDb:
            this.isConOpened_ = false;
            this.requestQueue_ = [];
            this.isDbIdle_ = true;
            break;
          case API.CloseDb:
            if (this.requestQueue_.length > 0) {
              this.openDb_();
            }
            else {
              this.isDbIdle_ = true;
              this.callEvent(EVENT.RequestQueueEmpty, []);
            }
            break;
        }
        finishedRequest.onSuccess(message.result);
      }
      this.isCodeExecuting_ = false;
      this.executeQry_();
    }
  }

  private openDb_() {
    this.prcoessExecutionOfQry_({
      name: API.OpenDb,
      query: {
        name: this.database.name,
        version: this.database.version
      } as IDbInfo,
      onSuccess: function () {

      },
      onError: function (err) {
        console.error(err);
      }
    }, 1);
  }

  private executeMiddleware_(input: WebWorkerRequest) {
    return promise<void>((res) => {
      let index = 0;
      const lastIndex = this.middlewares.length - 1;
      const callNextMiddleware = () => {
        if (index <= lastIndex) {
          this.middlewares[index++](input, callNextMiddleware);
        }
        else {
          res();
        }
      };
      callNextMiddleware();
    });
  }

  protected pushApi<T>(request: WebWorkerRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      this.executeMiddleware_(request).then(() => {
        request.onSuccess = resolve;
        request.onError = reject;
        if (this.requestQueue_.length === 0) {
          this.callEvent(EVENT.RequestQueueFilled, []);
          const isConnectionApi = [API.CloseDb, API.DropDb, API.OpenDb].indexOf(request.name) >= 0;
          if (!isConnectionApi && this.isDbIdle_ && this.isConOpened_) {
            this.openDb_();
          }
          else {
            clearTimeout(this.inactivityTimer_);
          }
        }
        this.prcoessExecutionOfQry_(request);
      }).catch(reject);
    });
  }

  private prcoessExecutionOfQry_(request: WebWorkerRequest, index?: number) {
    this.isDbIdle_ = false;
    if (index != null) {
      this.requestQueue_.splice(index, 0, request);
    }
    else {
      this.requestQueue_.push(request);
    }
    LogHelper.log("request pushed: " + request.name);
    this.executeQry_();
  }

  private executeQry_() {
    const requestQueueLength = this.requestQueue_.length;
    if (!this.isCodeExecuting_ && requestQueueLength > 0) {
      if (this.isConOpened_ === true) {
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
    else if (requestQueueLength === 0 && this.isDbIdle_ === false && this.isConOpened_) {
      this.inactivityTimer_ = setTimeout(() => {
        this.prcoessExecutionOfQry_({
          name: API.CloseDb,
          onSuccess: function () {

          },
          onError: function (err) {
            console.error(err);
          }
        });
      }, 100) as any;
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
      this.queryManager.run(requestForWorker);
    }
  }

  private callEvent(event: EVENT, args: any[]) {
    const events = this.eventQueue.filter(function (ev) {
      if (ev.event === event) {
        return ev;
      }
    });
    events.forEach(function (ev) {
      ev.callback(...args);
    });
  }
}
