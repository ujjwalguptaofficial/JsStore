import { IDBUtil } from "@worker/idb_util";
import { InsertQuery, SelectQuery } from "@/common";
import { LogHelper } from "@worker/utils";

export class Base {
    idb: IDBUtil;
    query: InsertQuery | SelectQuery;
    onSuccess: (result: any) => void;
    onError: (err: LogHelper) => void;
    rowAffected = 0;
    isTxQuery = false;

    get tableName() {
        return (this.query as SelectQuery).from || (this.query as InsertQuery).into
    }
}