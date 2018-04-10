import * as KeyStore from "./keystore/index";
import { LogHelper } from "./log_helper";
import { QueryExecutor } from "./query_executor";
const log = (value) => {
    LogHelper.log(value);
};
export const registerEvents = () => {
    (self as DedicatedWorkerGlobalScope).onmessage = (e) => {
        log("Request executing from WebWorker, request name: " + e.data.Name);
        new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
    };
};
registerEvents();
KeyStore.init();