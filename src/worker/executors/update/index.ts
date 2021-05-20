import { UpdateQuery, SelectQuery, QUERY_OPTION, API, WhereQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { DbMeta } from "@worker/model";
import { QueryHelper } from "../query_helper";
import { promiseReject, isArray } from "@worker/utils";
import { BaseFetch } from "@executors/base_fetch";
import { Select } from "@executors/select";
import { executeWhereUndefinedLogic } from "./not_where";
import { executeInLogic } from "./in";
import { executeRegexLogic } from "./regex";
import { executeWhereLogic } from "./where";

export class Update extends BaseFetch {
    executeWhereUndefinedLogic: typeof executeWhereUndefinedLogic

    constructor(query: UpdateQuery, util: IDBUtil) {
        super();
        this.query = query as any;
        this.util = util;
        this.tableName = query.in;
    }

    execute(db: DbMeta) {
        this.db = db;
        const query: UpdateQuery = this.query as any;
        try {
            const queryHelper = new QueryHelper(db);
            const err = queryHelper.validate(API.Update, query);
            if (err) return promiseReject(err);

            this.initTransaction();
            let pResult: Promise<void>;
            if (query.where != null) {
                if ((query.where as WhereQuery).or || isArray(query.where)) {
                    pResult = this.executeComplexLogic_();
                }
                else {
                    pResult = this.goToWhereLogic();
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

    private executeComplexLogic_() {
        const query: UpdateQuery = this.query as any;
        const selectObject = new Select({
            from: query.in,
            where: query.where,
            ignoreCase: query.ignoreCase
        } as SelectQuery, this.util);
        selectObject.isTxQuery = this.isTxQuery;
        return selectObject.execute(this.db).then((results: any[]) => {
            const key = this.primaryKey(query.in);
            const inQuery = [];
            results.forEach((value) => {
                inQuery.push(value[key]);
            });
            results = null;
            const whereQry = { [key]: { [QUERY_OPTION.In]: inQuery } };
            this.query.where = whereQry;
            this.initTransaction();
            return this.goToWhereLogic();
        });
    }

    private initTransaction() {
        const tableName = (this.query as any).in;
        if (!this.isTxQuery) {
            this.util.createTransaction([tableName]);
        }
        this.objectStore = this.util.objectStore(tableName);
    }
}

Update.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Update.prototype.executeWhereLogic = executeWhereLogic
Update.prototype.executeRegexLogic = executeRegexLogic
Update.prototype.executeInLogic = executeInLogic