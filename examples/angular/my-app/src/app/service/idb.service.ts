import * as JsStore from 'jsstore';
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';
export class IdbService {
  // this will make sure that we are using one instance
  // otherwise multiple instance will be created and thus multiple worker and that may create some problems
  static idbCon = new JsStore.Instance(new Worker(workerPath));
}
