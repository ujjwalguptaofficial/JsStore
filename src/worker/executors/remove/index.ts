import { BaseFetch } from "../base_fetch";
import { RemoveQuery, QUERY_OPTION } from "@/common";
import { IDBUtil } from "@/worker/idb_util";
import { QueryHelper } from "@executors/query_helper";
import { DbMeta } from "@/worker/model";
import { promiseReject, isArray, getObjectFirstKey } from "@/worker/utils";
import { Select } from "@executors/select";
import { executeWhereUndefinedLogic } from "./not_where";
import { executeInLogic } from "./in";
import { executeWhereLogic } from "./where";
import { executeRegexLogic } from "./regex";

export class Remove extends BaseFetch {
    isOr;
    executeWhereUndefinedLogic;

    constructor(
        query: RemoveQuery, util: IDBUtil
    ) {
        super();
        this.query = query;
        this.util = util;
    }

    execute(db: DbMeta) {
        const queryHelper = new QueryHelper(db);
        const query = this.query;
        const err = queryHelper.checkSelect(query);
        if (err) return promiseReject(err);
        try {
            this.initTransaction_();
            let pResult: Promise<void>;
            if (query.where != null) {
                if (isArray(query.where)) {
                    pResult = this.processWhereArrayQry();
                }
                else {
                    pResult = this.processWhere_();
                }
            }
            else {
                pResult = this.executeWhereUndefinedLogic();
            }
            return pResult.then(() => {
                return this.rowAffected;
            })

        }
        catch (ex) {
            return this.onException(ex);
        }

    }

    private processWhereArrayQry() {
        const selectObject = new Select(this.query, this.util);
        return selectObject.execute(this.db).then((results) => {
            const keyList = [];
            const pkey = this.primaryKey(this.query.from);
            results.forEach((item) => {
                keyList.push(item[pkey]);
            });
            results = null;
            const whereQry = { [pkey]: { [QUERY_OPTION.In]: keyList } };
            this.query[QUERY_OPTION.Where] = whereQry;
            return this.processWhere_();
        })
    }

    private processWhere_() {
        if (this.query.where.or) {
            this.processOrLogic();
        }
        return this.goToWhereLogic().then(() => {
            return this.onWhereEvaluated();
        });
    }

    private initTransaction_() {
        this.util.createTransaction([this.query.from]);
        this.objectStore = this.util.objectStore(this.query.from);
    }

    private onWhereEvaluated() {
        if (this.isOr) {
            return this.orQuerySuccess_();
        }
    }

    private orQuerySuccess_() {
        const key = getObjectFirstKey((this as any)._orInfo.OrQuery);
        if (key != null) {
            const where = {};
            where[key] = (this as any)._orInfo.OrQuery[key];
            delete (this as any)._orInfo.OrQuery[key];
            this.query.where = where;
            return this.goToWhereLogic().then(() => {
                return this.onWhereEvaluated();
            })
        }
        else {
            this.isOr = true;
        }
    }

    private processOrLogic() {
        this.isOr = true;
        (this as any)._orInfo = {
            OrQuery: this.query.where.or
        };

        // free or memory
        delete this.query.where.or;
    }
}

Remove.prototype.executeInLogic = executeInLogic;
Remove.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Remove.prototype.executeWhereLogic = executeWhereLogic;
Remove.prototype.executeRegexLogic = executeRegexLogic;