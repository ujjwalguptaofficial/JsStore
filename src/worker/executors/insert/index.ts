export * from "./values_checker";
import { InsertQuery } from "@/common";
import { Base } from "../base";
import { IDBUtil } from "@/worker/idb_util";
import { QueryHelper } from "../query_helper";
import { DbMeta } from "@/worker/model";

export class Insert extends Base {
    constructor(query: InsertQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.idbUtil = util;
    }

    execute(db: DbMeta) {
        const err = new QueryHelper(db).checkInsertQuery(this.query, {});
        if (err) return this.onError(err);

        
    }
}