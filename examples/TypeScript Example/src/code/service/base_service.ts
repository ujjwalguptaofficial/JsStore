import { idbCon, initJsStore } from "./idb_helper";

export class BaseService {

    constructor() {
        initJsStore();
    }

    get connection() {
        return idbCon;
    }

}
