import { IUpdateQuery, ISelectQuery, QUERY_OPTION, API, IWhereQuery, DATA_TYPE, ERROR_TYPE, promiseAll } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { DbMeta } from "@worker/model";
import { QueryHelper } from "../query_helper";
import { promiseReject, isArray, getDataType, variableFromPath, LogHelper } from "@worker/utils";
import { BaseFetch } from "@executors/base_fetch";
import { Select } from "@executors/select";
import { executeWhereUndefinedLogic } from "./not_where";
import { executeInLogic } from "./in";
import { executeRegexLogic } from "./regex";
import { executeWhereLogic } from "./where";

export class Update extends BaseFetch {
    executeWhereUndefinedLogic: typeof executeWhereUndefinedLogic

    constructor(query: IUpdateQuery, util: IDBUtil) {
        super();
        query.returnImmediate = query.returnImmediate == null ? true : query.returnImmediate;
        this.query = query as any;
        this.util = util;
        this.tableName = query.in;
        const mapSet = query.mapSet;
        if (mapSet) {
            const method = getDataType(mapSet) === DATA_TYPE.String ?
                variableFromPath(mapSet as string) : mapSet;
            if (!method) {
                throw new LogHelper(ERROR_TYPE.MethodNotExist, mapSet);
            }
            query.mapSet = method;
        }

    }

    execute(beforeExecute: () => Promise<any>) {
        const query: IUpdateQuery = this.query as any;
        try {
            const queryHelper = new QueryHelper(this.db);
            const err = queryHelper.validate(API.Update, query);
            if (err) return promiseReject(err);
            return beforeExecute().then(_ => {
                const txPromise = this.initTransaction();
                let pResult: Promise<void>;
                if (query.where != null) {
                    if ((query.where as IWhereQuery).or || isArray(query.where)) {
                        pResult = this.executeComplexLogic_();
                    }
                    else {
                        pResult = this.goToWhereLogic();
                    }
                }
                else {
                    pResult = this.executeWhereUndefinedLogic();
                }
                const promiseToUse = [pResult];
                if (query.returnImmediate === false && txPromise) {
                    promiseToUse.push(txPromise);
                }
                return promiseAll(promiseToUse).then(() => {
                    return this.rowAffected;
                })
            })
        }
        catch (ex) {
            return this.onException(ex);
        }
    }

    private executeComplexLogic_() {
        const query: IUpdateQuery = this.query as any;
        const selectObject = new Select({
            from: query.in,
            where: query.where,
            ignoreCase: query.ignoreCase
        } as ISelectQuery, this.util);
        selectObject.isTxQuery = this.isTxQuery;
        return selectObject.execute().then((results: any[]) => {
            const key = this.primaryKey(query.in);
            const inQuery = [];
            results.forEach((value) => {
                inQuery.push(value[key]);
            });
            results = null;
            const whereQry = { [key]: { [QUERY_OPTION.In]: inQuery } };
            this.query.where = whereQry;
            // this.initTransaction();
            return this.goToWhereLogic();
        });
    }

    private initTransaction() {
        const tableName = (this.query as any).in;
        let promise: Promise<void>;
        if (!this.isTxQuery) {
            promise = this.util.createTransaction([tableName]);
        }
        this.objectStore = this.util.objectStore(tableName);
        return promise;
    }
}

Update.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Update.prototype.executeWhereLogic = executeWhereLogic
Update.prototype.executeRegexLogic = executeRegexLogic
Update.prototype.executeInLogic = executeInLogic
