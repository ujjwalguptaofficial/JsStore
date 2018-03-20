import { WebWorker_Status } from "./enums";
import { log } from "./CommonLogic";
import { QueryExecutor } from './web_worker/query_executor';

if (self && !self.alert) {
    self.onmessage = function (e) {
        log("Request executing from WebWorker, request name: " + e.data.Name);
        var request = e.data,
            executor = new QueryExecutor();
        executor.checkConnectionAndExecuteLogic(request);
    };
    KeyStore.init();
}