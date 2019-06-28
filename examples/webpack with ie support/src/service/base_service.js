import {
    idbCon, initJsStore
} from "./idb_service";
export class BaseService {

     
    get connection() {
        return idbCon;
    }

}