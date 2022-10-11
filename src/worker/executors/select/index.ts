import { ISelectQuery, QUERY_OPTION, IDB_MODE, API, IWhereQuery, promiseResolve, IOrderQuery } from "@/common";
import { IDBUtil } from "@/worker/idbutil";
import { QueryHelper } from "@worker/executors/query_helper";
import { isArray, isObject, getObjectFirstKey, promiseReject, getLength } from "@/worker/utils";
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
import { MemoryObjectStore } from "@/worker/memory_store";

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
        if (isArray(query.where)) {
            this.isArrayQry = true;
            this.setLimitAndSkipEvaluationAtEnd_();
        }
        else {
            this.skipRecord = query.skip;
            this.limitRecord = query.limit;
        }
        const orderQuery = query.order;
        if (orderQuery) {
            if (isArray(orderQuery) || (orderQuery as IOrderQuery).case || isObject((orderQuery as IOrderQuery).by)) {
                ((orderQuery as IOrderQuery).idbSorting) = false;
            }
            this.setLimitAndSkipEvaluationAtEnd_();
        }
        else if (query.groupBy) {
            this.setLimitAndSkipEvaluationAtEnd_();
        }
    }

    execute(beforeExecute?: () => Promise<any>): Promise<any> {
        let pResult: Promise<void>;
        if (!beforeExecute) {
            beforeExecute = () => promiseResolve(null);
        }
        const query = this.query;
        try {
            const err = new QueryHelper(this.db).validate(API.Select, query);
            if (err) return promiseReject(err);
            return beforeExecute().then(_ => {
                this.initTransaction_();
                if (query.join == null) {
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
                else {
                    pResult = this.executeJoinQuery();
                }
                return pResult.then(
                    this.returnResult_.bind(this)
                )
            })

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
            let whereQueryToProcess = whereQuery.shift();
            if (whereQueryToProcess[QUERY_OPTION.Or]) {
                if (getLength(whereQueryToProcess) === 1) {
                    operation = QUERY_OPTION.Or;
                    whereQueryToProcess = whereQueryToProcess[QUERY_OPTION.Or] as any;
                }
                else {
                    operation = QUERY_OPTION.And;
                }
            }
            else {
                operation = QUERY_OPTION.And;
            }
            this.query.where = whereQueryToProcess;
            return this.processWhere_().then(onSuccess);
        };
        return processFirstQry();
    }

    private initTransaction_() {
        const store = this.query.store
        if (store) {
            this.objectStore = new MemoryObjectStore(store as any[]) as any;
            return
        }
        if (!this.isTxQuery) {
            this.util.createTransactionIfNotExist([this.tableName], IDB_MODE.ReadOnly);
        }
        this.objectStore = this.util.objectStore(this.tableName);
    }

    private processWhere_() {
        this.shouldAddValue = (cursor: IDBCursorWithValue) => {
            return this.whereChecker.check(cursor.value);
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
            const query = this.query;
            if (query.flatten) {
                const flattendData = [];
                const indexToDelete = new Map<number, Boolean>();
                query.flatten.forEach(column => {
                    this.results.forEach((data, i) => {
                        data[column].forEach(item => {
                            flattendData.push(
                                { ...data, ...{ [column]: item } }
                            );
                        });
                        indexToDelete.set(i, true);
                    });
                });
                let itemsDeleted = 0;
                indexToDelete.forEach((_, key) => {
                    this.results.splice(key - itemsDeleted, 1);
                    ++itemsDeleted;
                });
                this.results = this.results.concat(flattendData);
            }
            this.processGroupDistinctAggr();
            this.processOrderBy();
            if (this.skipAtEnd) {
                this.results.splice(0, query.skip);
            }
            if (this.limitAtEnd) {
                this.results = this.results.slice(0, query.limit);
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
        const query = this.query;
        if (this.results.length > 0) {
            this.orInfo.results = [... this.orInfo.results, ...this.results];
        }

        if (!query.limit || (query.limit > this.orInfo.results.length)) {
            this.results = [];
            const key = getObjectFirstKey(this.orInfo.orQuery);
            if (key != null) {
                const where = {};
                where[key] = this.orInfo.orQuery[key];
                delete this.orInfo.orQuery[key];
                query.where = where;
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
        this.setLimitAndSkipEvaluationAtEnd_();
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
