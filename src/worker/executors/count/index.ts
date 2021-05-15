import { BaseFetch } from "@executors/base_fetch";
import { Select } from "@executors/select";
import { CountQuery, SelectQuery, IDB_MODE, API, WhereQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { DbMeta } from "@worker/model";
import { QueryHelper } from "@executors/query_helper";
import { promiseReject, isArray, getError } from "@worker/utils";
import { executeWhereUndefinedLogic } from "@executors/count/not_where";
import { executeWhereLogic } from "./where";
import { executeRegexLogic } from "./regex";
import { executeInLogic } from "./in";

export class Count extends BaseFetch {

    query: CountQuery;
    resultCount: number = 0;
    executeWhereUndefinedLogic = executeWhereUndefinedLogic;
    executeWhereLogic = executeWhereLogic
    executeRegexLogic = executeRegexLogic
    executeInLogic = executeInLogic


    constructor(query: CountQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.util = util;
        this.tableName = query.from;
    }

    execute(db: DbMeta) {
        this.db = db;
        const queryHelper = new QueryHelper(db);
        const query = this.query;
        const err = queryHelper.validate(API.Count, query);
        if (err) {
            return promiseReject(
                err
            );
        }
        try {
            let result: Promise<void>;
            const getDataFromSelect = () => {
                const selectInstance = new Select(this.query as SelectQuery, this.util);
                selectInstance.isTxQuery = this.isTxQuery;
                return selectInstance.execute(db).then(results => {
                    this.resultCount = results.length;
                });
            };
            if (query.join == null) {
                if (query.where != null) {
                    if ((query.where as WhereQuery).or || isArray(this.query.where)) {
                        result = getDataFromSelect();
                    }
                    else {
                        this.initTransaction_();
                        result = this.goToWhereLogic();
                    }
                }
                else {
                    this.initTransaction_();
                    result = this.executeWhereUndefinedLogic() as any;
                }
            }
            else {
                result = getDataFromSelect();
            }
            return result.then(_ => {
                return this.resultCount;
            })
        }
        catch (ex) {
            this.onException(ex);
        }
    }

    private initTransaction_() {
        if (!this.isTxQuery) {
            this.util.createTransaction([this.query.from], IDB_MODE.ReadOnly);
        }
        this.objectStore = this.util.objectStore(this.query.from);
    }
}