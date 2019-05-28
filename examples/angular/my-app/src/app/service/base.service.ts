import { idbCon, initJsStore } from './idb.service';


export class BaseService {

  constructor() {
    initJsStore();
  }

  get connection() {
    return idbCon;
  }

}
