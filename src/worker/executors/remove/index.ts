import { BaseFetch } from "../base_fetch";
import { IRemoveQuery, QUERY_OPTION, API, IWhereQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { QueryHelper } from "@executors/query_helper";
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
        query: IRemoveQuery, util: IDBUtil
    ) {
        super();
        this.query = query;
        this.util = util;
        this.tableName = query.from;
    }

    execute(beforeExecute: () => Promise<any>) {
        const queryHelper = new QueryHelper(this.db);
        const query = this.query;
        const err = queryHelper.validate(API.Remove, query);
        if (err) return promiseReject(
            err
        );
        let pResult: Promise<void>;
        return beforeExecute().then(_ => {
            try {
                this.initTransaction_();
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

            }
            catch (ex) {
                return this.onException(ex);
            }
            return pResult.then(() => {
                return this.rowAffected;
            })
        })
    }

    private processWhereArrayQry() {
        const selectObject = new Select(this.query, this.util);
        selectObject.isTxQuery = this.isTxQuery;
        return selectObject.execute().then((results) => {
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
        if ((this.query.where as IWhereQuery).or) {
            this.processOrLogic();
        }
        return this.goToWhereLogic().then(() => {
            return this.onWhereEvaluated();
        });
    }

    private initTransaction_() {
        if (!this.isTxQuery) {
            this.util.createTransaction([this.query.from]);
        }
        this.objectStore = this.util.objectStore(this.query.from);
    }

    private onWhereEvaluated() {
        if (this.isOr) {
            return this.orQuerySuccess_();
        }
    }

    private orQuerySuccess_() {
        const orQueryFromOrInfo = (this as any)._orInfo.OrQuery
        const key = getObjectFirstKey(orQueryFromOrInfo);
        if (key != null) {
            const where = {};
            where[key] = orQueryFromOrInfo[key];
            delete orQueryFromOrInfo[key];
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
        const where = this.query.where as IWhereQuery;
        (this as any)._orInfo = {
            OrQuery: where.or
        };

        // free or memory
        delete where.or;
    }
}

Remove.prototype.executeInLogic = executeInLogic;
Remove.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Remove.prototype.executeWhereLogic = executeWhereLogic;
Remove.prototype.executeRegexLogic = executeRegexLogic;