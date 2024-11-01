import { LogHelper } from "./log_helper";
import {
  WebWorkerRequest, API, WebWorkerResult,
  EVENT, promise, IDataBase, IDbInfo, TMiddleware,
  promiseResolve
} from "../common";
import { EventBus } from "./event_bus";

declare var JsStoreWorker;
export class ConnectionHelper {
  protected database: IDataBase;
  private worker_: Worker;
  private isConOpened_ = false;
  private isDbIdle_ = true;
  private requestQueue_: WebWorkerRequest[] = [];
  private isCodeExecuting_ = false;

  private inactivityTimer_ = -1000;

  protected middlewares: TMiddleware[] = [];

  protected eventBus_: EventBus = new EventBus(this);

  // these apis have special permissions. These apis dont wait for database open.
  private whiteListApi_ = [
    API.InitDb,
    API.OpenDb,
    API.MapGet,
    API.MapSet,
    API.MapHas,
    API.MapDelete,
    API.ChangeLogStatus,
    API.Terminate,
    API.DropDb
  ];

  private queryManager;

  isWorker = true;

  protected logger = new LogHelper(null);

  /**
   * injected by jsstore worker plugin
   *
   * @private
   * @memberof ConnectionHelper
   */
  private $worker;

  private get jsstoreWorker() {
    return this.$worker || self['JsStoreWorker'];
  }

  constructor(worker?: Worker) {
    if (worker) {
      this.worker_ = worker;
      this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
    } else {
      this.isWorker = false;
      this.initQueryManager_();
    }
  }

  private initQueryManager_() {
    const workerRef = this.jsstoreWorker;
    if (workerRef) {
      this.queryManager = new workerRef.QueryManager(this.processFinishedQuery_.bind(this));
    }
    else {
      throw new Error('JsStoreWorker not found. Either pass web worker or inject JsStore Worker.');
    }
  }

  private onMessageFromWorker_(msg) {
    this.processFinishedQuery_(msg.data);
  }

  private isDbClosedForcefully = false;

  private processFinishedQuery_(message: WebWorkerResult) {
    if (message.isDbClosedForcefully) {
      this.isDbClosedForcefully = true;
      this.requestQueue_ = [];
      console.warn('Database closed forcefully');
      return;
    }
    const finishedRequest: WebWorkerRequest = this.requestQueue_.shift();
    if (finishedRequest) {
      this.logger.log(`request ${finishedRequest.name} finished`);
      if (message.error) {
        finishedRequest.onError(message.error);
      } else {
        switch (finishedRequest.name) {
          case API.OpenDb:
          case API.InitDb:
            this.isConOpened_ = true; break;
          case API.Terminate:
            this.isConOpened_ = false;
            if (this.isWorker === true) {
              this.worker_.terminate();
            }
          case API.DropDb:
            this.isConOpened_ = false;
            this.requestQueue_ = [];
            this.isDbIdle_ = true;
            break;
          case API.CloseDb:
            this.isDbIdle_ = true;
            this.eventBus_.emit(EVENT.RequestQueueEmpty, []);
            if (this.requestQueue_.length > 0) {
              this.openDb_(false);
            }
            break;
        }
        finishedRequest.onSuccess(message.result);
      }
      this.isCodeExecuting_ = false;
      this.executeQry_();
    }
  }

  private openDb_(execute = true) {
    const request = {
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
    };
    if (execute) {
      this.prcoessExecutionOfQry_(request, 0);
    }
    else {
      this.requestQueue_.splice(0, 0, request);
    }
  }

  private executeMiddleware_(input: WebWorkerRequest) {
    return promise<void>((res) => {
      let index = 0;
      const lastIndex = this.middlewares.length - 1;
      const callNextMiddleware = () => {
        if (index <= lastIndex) {
          let promiseResult = this.middlewares[index++](input);
          if (!promiseResult || !promiseResult.then) {
            promiseResult = promiseResolve(promiseResult);
          }
          promiseResult.then(_ => {
            callNextMiddleware();
          });
        }
        else {
          res();
        }
      };
      callNextMiddleware();
    });
  }

  private callResultMiddleware(middlewares: any[], result) {
    return promise<any>((res) => {
      let index = 0;
      const lastIndex = middlewares.length - 1;
      const callNextMiddleware = () => {
        if (index <= lastIndex) {
          let promiseResult = middlewares[index++](result);
          if (!promiseResult.then) {
            promiseResult = promiseResolve(promiseResult);
          }
          promiseResult.then(modifiedResult => {
            result = modifiedResult;
            callNextMiddleware();
          });
        }
        else {
          res(result);
        }
      };
      callNextMiddleware();
    });
  }

  protected pushApi<T>(request: WebWorkerRequest): Promise<T> {
    if (process.env.NODE_ENV !== 'production' && !this.jsstoreWorker && !this.worker_) {
      throw new Error(`JsStoreWorker not found. Either pass web worker or inject JsStore Worker.`);
    }
    return new Promise((resolve, reject) => {
      let middlewares = [];
      request.onResult = (cb) => {
        middlewares.push((result) => {
          return cb(result);
        });
      };
      this.executeMiddleware_(request).then(() => {
        request.onSuccess = (result) => {
          this.callResultMiddleware(middlewares, result).then(modifiedResult => {
            resolve(modifiedResult);
          }).catch(err => {
            request.onError(err);
          });
        };
        request.onError = (err) => {
          middlewares = [];
          reject(err);
        };
        if (this.requestQueue_.length === 0) {
          this.eventBus_.emit(EVENT.RequestQueueFilled, []);
          if (this.isDbIdle_ && this.isConOpened_) {
            const isConnectionApi = [API.InitDb, API.CloseDb, API.DropDb, API.OpenDb, API.Terminate].indexOf(request.name) >= 0;
            if (!isConnectionApi) {
              this.openDb_();
            }
          }
          clearTimeout(this.inactivityTimer_);
        }
        this.prcoessExecutionOfQry_(request);
      }).catch(reject);
    });
  }

  private prcoessExecutionOfQry_(request: WebWorkerRequest, index?: number) {
    if (this.isDbClosedForcefully) return;
    this.isDbIdle_ = false;
    if (index != null) {
      this.requestQueue_.splice(index, 0, request);
    }
    else {
      this.requestQueue_.push(request);
    }
    this.logger.log("request pushed: " + request.name);
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
    this.logger.log("request executing: " + request.name);
    const requestForWorker = {
      name: request.name,
      query: request.query
    } as WebWorkerRequest;
    if (this.isWorker === true) {
      this.worker_.postMessage(requestForWorker);
    }
    else {
      this.queryManager.run(requestForWorker);
    }
  }
}
