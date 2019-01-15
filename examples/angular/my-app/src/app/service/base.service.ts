import { idbCon } from "./idb.service";


export class BaseService {
  get connection() {
    return idbCon;
  }

}
