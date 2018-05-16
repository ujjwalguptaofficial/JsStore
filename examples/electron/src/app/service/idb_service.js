import * as JsStore from "jsstore";
const Worker = require("worker-loader?name=scripts/jsstore.worker.js!jsstore/dist/jsstore.worker.min");
export const idbCon = new JsStore.Instance(new Worker());