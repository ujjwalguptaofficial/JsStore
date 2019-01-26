import { KeyStore } from "./keystore/index";
import { QueryExecutor } from "./query_executor";
import { Config } from "./config";
export const initialize = () => {
    if (typeof (self as any).alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined') {
        Config.isRuningInWorker = true;
        (self as any).onmessage = (e) => {
            new QueryExecutor().checkConnectionAndExecuteLogic(e.data);
        };
        KeyStore.init();
    }
};
initialize();
