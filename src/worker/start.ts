import { QueryExecutor } from "./query_executor";
import { Config } from "./config";
export const initialize = function () {
    if (typeof (self as any).alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined') {
        Config.isRuningInWorker = true;
        (self as any).onmessage = function (e) {
            new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
        };
    }
};
initialize();
