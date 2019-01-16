import {
    Column,
    DATA_TYPE,
    COL_OPTION
} from "jsstore";
import {
    idbCon
} from "./idb_service";
export class BaseService {

     
    get connection() {
        return idbCon;
    }

}