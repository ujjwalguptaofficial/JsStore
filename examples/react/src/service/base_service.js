import {
    idbCon, initJsStore
} from "./idb_service";
export class BaseService {

    constructor() {
        initJsStore();
    }

    get connection() {
        return idbCon;
    }

}