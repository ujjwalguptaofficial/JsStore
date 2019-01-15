import { idbCon } from "./idb_helper";

export class BaseService {

    get connection() {
        return idbCon;
    }

}
