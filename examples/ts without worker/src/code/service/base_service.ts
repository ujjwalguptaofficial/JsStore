import { idbCon, initJsStore } from "./idb_helper";

export class BaseService {


    constructor() {
        // initiate database when a service instance is initiated
        initJsStore();
    }

    get connection() {
        return idbCon;
    }

}
