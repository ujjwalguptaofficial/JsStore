import { BaseFetch } from "@executors/base_fetch";
import { Select } from "@executors/select";
import { ICountQuery, ISelectQuery, IDB_MODE, API, IWhereQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { QueryHelper } from "@executors/query_helper";
import { promiseReject, isArray } from "@worker/utils";
import { executeWhereUndefinedLogic } from "@executors/count/not_where";
import { executeWhereLogic } from "./where";
import { executeRegexLogic } from "./regex";
import { executeInLogic } from "./in";

export class Count extends BaseFetch {

    query: ICountQuery;
    resultCount: number = 0;
    executeWhereUndefinedLogic: typeof executeWhereUndefinedLogic;

    constructor(query: ICountQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.util = util;
        this.tableName = query.from;
    }

    execute(beforeExecute: () => Promise<any>) {
        const queryHelper = new QueryHelper(this.db);
        const query = this.query;
        const err = queryHelper.validate(API.Count, query);
        if (err) {
            return promiseReject(
                err
            );
        }
        return beforeExecute().then(_ => {
            let result: Promise<void>;
            try {
                const getDataFromSelect = () => {
                    const selectInstance = new Select(query as ISelectQuery, this.util);
                    selectInstance.isTxQuery = this.isTxQuery;
                    return selectInstance.execute().then(results => {
                        this.resultCount = results.length;
                    });
                };
                this.initTransaction_();
                if (query.join == null) {
                    if (query.where != null) {
                        if ((query.where as IWhereQuery).or || isArray(query.where)) {
                            result = getDataFromSelect();
                        }
                        else {
                            this.shouldAddValue = (cursor) => {
                                return this.whereCheckerInstance.check(cursor.value);
                            };
                            result = this.goToWhereLogic();
                        }
                    }
                    else {
                        result = this.executeWhereUndefinedLogic() as any;
                    }
                }
                else {
                    result = getDataFromSelect();
                }
            }
            catch (ex) {
                this.onException(ex);
            }
            return result.then(_ => {
                return this.resultCount;
            })
        });
    }

    private initTransaction_() {
        const tableName = this.query.from;
        if (!this.isTxQuery) {
            this.util.createTransaction([tableName], IDB_MODE.ReadOnly);
        }
        this.objectStore = this.util.objectStore(tableName);
    }
}

Count.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Count.prototype.executeWhereLogic = executeWhereLogic
Count.prototype.executeRegexLogic = executeRegexLogic
Count.prototype.executeInLogic = executeInLogic