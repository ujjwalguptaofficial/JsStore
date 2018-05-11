import { IdbHelper } from "./idb_helper";

export class BaseService {

    isDbExist(dbName) {
        return this.connection.isDbExist(dbName);
    }

    get connection() {
        return IdbHelper.idbCon;
    }

}
