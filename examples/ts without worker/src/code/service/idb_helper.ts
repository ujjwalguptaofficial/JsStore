import * as JsStoreWorker from "jsstore/dist/jsstore.worker.commonjs2";
window['JsStoreWorker'] = JsStoreWorker;
import * as JsStore from 'jsstore';

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new JsStore.Instance();