import * as KeyStore from "./keystore/index";
import { LogHelper } from "./log_helper";
import { QueryExecutor } from "./query_executor";
export var registerEvents = function () {
    self.onmessage = function (e) {
        LogHelper.log("Request executing from WebWorker, request name: " + e.data.Name);
        var request = e.data;
        var query_executor = new QueryExecutor();
        query_executor.checkConnectionAndExecuteLogic(request);
    };
};
registerEvents();
KeyStore.init();
//# sourceMappingURL=start.js.map