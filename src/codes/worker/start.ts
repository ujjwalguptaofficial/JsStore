import * as KeyStore from "./keystore/index";
import { LogHelper } from "./log_helper";
import { QueryExecutor } from "./query_executor";
import { Config } from "./config";
const log = (value) => {
    LogHelper.log(value);
};
export const initialize = () => {
    (self as DedicatedWorkerGlobalScope).onmessage = (e) => {
        log("Request executing from WebWorker, request name: " + e.data.name);
        new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
    };
    if (typeof (self as any).alert === 'undefined') {
        Config.isRuningInWorker = true;
    }
};
initialize();
KeyStore.init();