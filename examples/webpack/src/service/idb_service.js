import * as JsStore from "jsstore";
const Worker = require("worker-loader?publicPath=/&name=jsstore.worker.js!../../node_modules/jsstore/dist/jsstore.worker");

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export class IdbService {
    static get idbCon() {
        return new JsStore.Instance(new Worker());
    }
}