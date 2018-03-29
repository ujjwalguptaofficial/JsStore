import { LogHelper } from "./log_helper";
import { Error_Type } from "./enums";
var InstanceHelper = /** @class */ (function () {
    function InstanceHelper(worker) {
        this._isDbOpened = false;
        this._requestQueue = [];
        this._isCodeExecuting = false;
        this._whiteListApi = ['create_db', 'is_db_exist', 'get_db_version', 'get_db_list', 'open_db'];
        if (worker) {
            this._worker = worker;
            this._worker.onmessage = this.onMessageFromWorker.bind(this);
        }
        else {
            var err = new LogHelper(Error_Type.WorkerNotSupplied);
            err.throw();
        }
    }
    InstanceHelper.prototype.onMessageFromWorker = function (msg) {
        this.processFinishedQuery(msg.data);
    };
    InstanceHelper.prototype.processFinishedQuery = function (message) {
        var finished_request = this._requestQueue.shift();
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
    };
    InstanceHelper.prototype.pushApi = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.OnSuccess = function (result) {
                resolve(result);
            };
            request.OnError = function (error) {
                reject(error);
            };
            _this.prcoessExecutionOfQry(request);
        });
    };
    InstanceHelper.prototype.prcoessExecutionOfQry = function (request) {
        this._requestQueue.push(request);
        this.executeQry();
        LogHelper.log("request pushed: " + request.Name);
    };
    InstanceHelper.prototype.executeQry = function () {
        var _this = this;
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            if (this._isDbOpened) {
                this.sendRequestToWorker(this._requestQueue[0]);
                return;
            }
            var allowed_query_index = -1;
            this._requestQueue.every(function (item, index) {
                if (_this._whiteListApi.indexOf(item.Name) >= 0) {
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
    };
    InstanceHelper.prototype.sendRequestToWorker = function (firsrtRequest) {
        this._isCodeExecuting = true;
        var request = {
            Name: firsrtRequest.Name,
            Query: firsrtRequest.Query
        };
        LogHelper.log("request executing : " + firsrtRequest.Name);
        this._worker.postMessage(request);
    };
    return InstanceHelper;
}());
export { InstanceHelper };
//# sourceMappingURL=instance_helper.js.map