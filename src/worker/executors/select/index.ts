import { ISelectQuery, QUERY_OPTION, IDB_MODE, API, IWhereQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { QueryHelper } from "@worker/executors/query_helper";
import { DbMeta } from "@/worker/model";
import { isArray, isObject, getKeys, getObjectFirstKey, promiseReject, getLength } from "@/worker/utils";
import { setPushResult, setLimitAndSkipEvaluationAtEnd, removeDuplicates } from "./base_select";
import { ThenEvaluator } from "./then_evaluator";
import { executeWhereUndefinedLogic } from "./not_where"
import { processAggregateQry, processGroupDistinctAggr, processOrderBy } from "./order_by";
import { executeAggregateGroupBy, processGroupBy } from "./group_by";
import { executeWhereLogic } from "./where";
import { BaseFetch } from "@executors/base_fetch";
import { executeInLogic } from "./in";
import { executeRegexLogic } from "./regex";
import { executeJoinQuery } from "./join";

export class Select extends BaseFetch {
    sorted = false;
    isOr: boolean;
    isArrayQry: boolean;
    query: ISelectQuery;
    orInfo: {
        results?: any[];
        orQuery: object
    };

    isSubQuery = false;

    protected pushResult: (value) => void;

    protected thenEvaluator = new ThenEvaluator();

    executeWhereUndefinedLogic: typeof executeWhereUndefinedLogic;

    setLimitAndSkipEvaluationAtEnd_: typeof setLimitAndSkipEvaluationAtEnd
    setPushResult: typeof setPushResult;
    removeDuplicates: typeof removeDuplicates;
    executeJoinQuery: typeof executeJoinQuery
    processGroupDistinctAggr: typeof processGroupDistinctAggr;
    processOrderBy: typeof processOrderBy;
    processAggregateQry: typeof processAggregateQry;
    executeAggregateGroupBy: typeof executeAggregateGroupBy;
    processGroupBy: typeof processGroupBy;


    constructor(query: ISelectQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.util = util;
        this.tableName = query.from;
        this.setPushResult();
        if (isArray(this.query.where)) {
            this.isArrayQry = true;
            this.setLimitAndSkipEvaluationAtEnd_();
        }
        else {
            this.skipRecord = query.skip;
            this.limitRecord = query.limit;
        }
        if (query.order) {
            if (isArray(query.order) || query.order.case || isObject(query.order.by)) {
                this.query.order.idbSorting = false;
            }
            this.setLimitAndSkipEvaluationAtEnd_();
        }
        else if (query.groupBy) {
            this.setLimitAndSkipEvaluationAtEnd_();
        }
    }

    execute(): Promise<any> {
        let pResult: Promise<void>;
        try {
            const err = new QueryHelper(this.db).validate(API.Select, this.query);
            if (err) return promiseReject(err);
            this.initTransaction_();
            if (this.query.join == null) {
                if (this.query.where != null) {
                    if (isArray(this.query.where)) {
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
            else {
                pResult = this.executeJoinQuery();
            }
            return pResult.then(
                this.returnResult_.bind(this)
            )
        }
        catch (ex) {
            return this.onException(ex);
        }
    }

    private processWhereArrayQry() {
        this.isArrayQry = true;
        const whereQuery = this.query.where as IWhereQuery[];
        const pKey = this.primaryKey();
        let isFirstWhere = true, output = [], operation;

        const isItemExist = (keyValue) => {
            return output.findIndex(item => item[pKey] === keyValue) >= 0;
        };
        const onSuccess = () => {
            if (operation === QUERY_OPTION.And) {
                const doAnd = () => {
                    let andResults = [];
                    this.results.forEach((item) => {
                        if (isItemExist(item[pKey])) {
                            andResults.push(item);
                        }
                    });
                    output = andResults;
                    andResults = null;
                };

                if (isFirstWhere === true) {
                    output = this.results;
                }
                else if (output.length > 0) {
                    doAnd();
                }
            }
            else {
                if (output.length > 0) {
                    this.results = [...output, ...this.results];
                    this.removeDuplicates();
                    output = this.results;
                }
                else {
                    output = this.results;
                }
            }
            isFirstWhere = false;
            if (whereQuery.length > 0) {
                this.results = [];
                return processFirstQry();
            }
            else {
                this.results = output;
            }

        };
        const processFirstQry = () => {
            this.query.where = whereQuery.shift();
            if (this.query.where[QUERY_OPTION.Or]) {
                if (getLength(this.query.where) === 1) {
                    operation = QUERY_OPTION.Or;
                    this.query.where = this.query.where[QUERY_OPTION.Or] as any;
                }
                else {
                    operation = QUERY_OPTION.And;
                }
            }
            else {
                operation = QUERY_OPTION.And;
            }
            return this.processWhere_().then(onSuccess);
        };
        return processFirstQry();
    }

    private initTransaction_() {
        if (!this.isTxQuery) {
            this.util.createTransactionIfNotExist([this.tableName], IDB_MODE.ReadOnly);
        }
        this.objectStore = this.util.objectStore(this.tableName);
    }

    private processWhere_() {
        this.shouldAddValue = (value) => {
            return this.whereCheckerInstance.check(value);
        };
        if ((this.query.where as IWhereQuery).or) {
            this.processOrLogic_();
        }
        return this.goToWhereLogic().then(() => {
            return this.onWhereEvaluated();
        })
    }

    private onWhereEvaluated() {
        if (this.isOr) {
            return this.orQuerySuccess_();
        }
    }

    private returnResult_ = () => {
        if (this.results.length > 0) {


            if (this.query.flatten) {
                const flattendData = [];
                const indexToDelete = {};
                this.query.flatten.forEach(column => {
                    this.results.forEach((data, i) => {
                        data[column].forEach(item => {
                            flattendData.push(
                                { ...data, ...{ [column]: item } }
                            );
                        });
                        indexToDelete[i] = true;
                    });
                });
                let itemsDeleted = 0;
                getKeys(indexToDelete).forEach(key => {
                    this.results.splice(Number(key) - itemsDeleted, 1);
                    ++itemsDeleted;
                });
                this.results = this.results.concat(flattendData);
            }
            this.processGroupDistinctAggr();
            this.processOrderBy();
            if (this.shouldEvaluateSkipAtEnd) {
                this.results.splice(0, this.query.skip);
            }
            if (this.shouldEvaluateLimitAtEnd) {
                this.results = this.results.slice(0, this.query.limit);
            }
        }
        return this.results;
    }

    private orQueryFinish_() {
        this.isOr = false;
        this.results = this.orInfo.results;
        // free or info memory
        this.orInfo = null;
        this.removeDuplicates();
        // this.onQueryFinished();
    }

    private orQuerySuccess_() {
        this.orInfo.results = [... this.orInfo.results, ...this.results];
        if (!this.query.limit || (this.query.limit > this.orInfo.results.length)) {
            this.results = [];
            const key = getObjectFirstKey(this.orInfo.orQuery);
            if (key != null) {
                const where = {};
                where[key] = this.orInfo.orQuery[key];
                delete this.orInfo.orQuery[key];
                this.query.where = where;
                return this.goToWhereLogic().then(this.onWhereEvaluated.bind(this))
            }
        }
        return this.orQueryFinish_();
    }

    private processOrLogic_() {
        this.isOr = true;
        const where = this.query.where as IWhereQuery;
        this.orInfo = {
            orQuery: where.or as any,
            results: []
        };
        // free or memory
        delete where.or;
    }
}

Select.prototype.executeInLogic = executeInLogic;
Select.prototype.executeWhereUndefinedLogic = executeWhereUndefinedLogic;
Select.prototype.executeWhereLogic = executeWhereLogic;
Select.prototype.executeRegexLogic = executeRegexLogic;

Select.prototype.setLimitAndSkipEvaluationAtEnd_ = setLimitAndSkipEvaluationAtEnd
Select.prototype.setPushResult = setPushResult;
Select.prototype.removeDuplicates = removeDuplicates;
Select.prototype.executeJoinQuery = executeJoinQuery
Select.prototype.processGroupDistinctAggr = processGroupDistinctAggr;
Select.prototype.processOrderBy = processOrderBy;
Select.prototype.processAggregateQry = processAggregateQry;
Select.prototype.executeAggregateGroupBy = executeAggregateGroupBy;
Select.prototype.processGroupBy = processGroupBy;
