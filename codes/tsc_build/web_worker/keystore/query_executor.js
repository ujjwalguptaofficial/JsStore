import { Connection_Status } from "./enums";
import { Main } from "./business/main_logic";
var QueryExecutor = /** @class */ (function () {
    function QueryExecutor() {
    }
    QueryExecutor.prcoessQuery = function (request) {
        this._requestQueue.push(request);
        if (this._requestQueue.length === 1) {
            this.executeCode();
        }
    };
    QueryExecutor.executeCode = function () {
        var _this = this;
        if (!this._isCodeExecuting && this._requestQueue.length > 0) {
            this._isCodeExecuting = true;
            var request = {
                Name: this._requestQueue[0].Name,
                Query: this._requestQueue[0].Query
            };
            new Main(function (results) {
                _this.onQueryFinished(results);
            }).checkConnectionAndExecuteLogic(request);
        }
    };
    QueryExecutor.onQueryFinished = function (message) {
        var finished_request = this._requestQueue.shift();
        this._isCodeExecuting = false;
        if (message.ErrorOccured) {
            if (finished_request.OnError) {
                finished_request.OnError(message.ErrorDetails);
            }
            else {
                console.error(message.ErrorDetails);
            }
        }
        else if (finished_request.OnSuccess) {
            finished_request.OnSuccess(message.ReturnedValue);
        }
        this.executeCode();
    };
    QueryExecutor._requestQueue = [];
    QueryExecutor._tableName = "LocalStore";
    QueryExecutor._columnName = "Key";
    QueryExecutor._isCodeExecuting = false;
    QueryExecutor._dbStatus = {
        ConStatus: Connection_Status.NotStarted,
        LastError: ""
    };
    return QueryExecutor;
}());
export { QueryExecutor };
// export var query_executor_instance = new QueryExecutor();
// export default (new QueryExecutor());
//# sourceMappingURL=query_executor.js.map