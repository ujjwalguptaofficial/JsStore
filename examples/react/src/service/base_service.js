import {
    Column,
    DATA_TYPE,
    COL_OPTION
} from "jsstore";
import {
    idbCon
} from "./idb_service";
export class BaseService {

    constructor() {
        this.connection.setLogStatus(true);
    }

    get connection() {
        return idbCon;
    }

}