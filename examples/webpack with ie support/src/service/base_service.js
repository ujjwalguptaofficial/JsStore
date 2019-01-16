import {
    idbCon
} from "./idb_service";
export class BaseService {


    get connection() {
        return idbCon;
    }


}