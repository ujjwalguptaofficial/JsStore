import * as JsStore from 'jsstore';
import * as workerPath from "file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js";
// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export class IdbHelper {
    static idbCon = new JsStore.Instance(new Worker(workerPath));
}