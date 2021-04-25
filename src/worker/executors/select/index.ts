import { Base } from "@worker/executors/base";
import { SelectQuery, QUERY_OPTION, IDB_MODE, ERROR_TYPE } from "@/common";
import { IDBUtil } from "@/worker/idb_util";
import { QueryHelper } from "@worker/executors/query_helper";
import { DbMeta } from "@/worker/model";
import { getError, isArray, isObject, getKeys, getObjectFirstKey } from "@/worker/utils";
import { setPushResult, setLimitAndSkipEvaluationAtEnd, removeDuplicates } from "./base_select";
// import "./join";
import { ThenEvaluator } from "./then_evaluator";
import { executeWhereUndefinedLogic } from "./not_where"
import { processAggregateQry, processGroupDistinctAggr, processOrderBy } from "./order_by";
import { executeAggregateGroupBy, processGroupBy } from "./group_by";

export class Select extends Base {
    sorted = false;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;
    query: SelectQuery;
    orInfo: {
        results?: any[];
        orQuery: object
    };

    isSubQuery = false;

    shouldEvaluateLimitAtEnd = false;
    shouldEvaluateSkipAtEnd = false;

    protected pushResult: (value) => void;

    protected thenEvaluator = new ThenEvaluator();

    setLimitAndSkipEvaluationAtEnd_ = setLimitAndSkipEvaluationAtEnd
    setPushResult = setPushResult;
    removeDuplicates = removeDuplicates;
    executeWhereUndefinedLogic = executeWhereUndefinedLogic;
    executeJoinQuery: () => void
    processGroupDistinctAggr = processGroupDistinctAggr;
    processOrderBy = processOrderBy;
    processAggregateQry = processAggregateQry;
    executeAggregateGroupBy = executeAggregateGroupBy;
    processGroupBy = processGroupBy;

    skipRecord;
    limitRecord;

    constructor(query: SelectQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.util = util;
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

    execute(db: DbMeta) {
        this.db = db;
        const err = new QueryHelper(db).checkSelect(this.query);
        if (err) return Promise.reject(getError(err, true));
        try {
            // if (this.query.join == null) {
            // if (this.query.where != null) {
            //     this.initTransaction_();
            //     if (isArray(this.query.where)) {
            //         return this.processWhereArrayQry();
            //     }
            //     else {
            //         return this.processWhere_();
            //     }
            // }
            // else {
            this.initTransaction_();
            return this.executeWhereUndefinedLogic().then(
                this.returnResult_.bind(this)
            );
            // }

            // }
            // else {
            //     return this.executeJoinQuery();
            // }
        }
        catch (ex) {
            this.onExceptionOccured(ex);
        }
    }

    // private processWhereArrayQry() {
    //     this.isArrayQry = true;
    //     const whereQuery = this.query.where,
    //         pKey = this.primaryKey;
    //     let isFirstWhere = true, output = [], operation;

    //     const isItemExist = (keyValue) => {
    //         return output.findIndex(item => item[pKey] === keyValue) >= 0;
    //     };
    //     const onSuccess = () => {
    //         if (operation === QUERY_OPTION.And) {
    //             const doAnd = () => {
    //                 let andResults = [];
    //                 this.results.forEach((item) => {
    //                     if (isItemExist(item[pKey])) {
    //                         andResults.push(item);
    //                     }
    //                 });
    //                 output = andResults;
    //                 andResults = null;
    //             };

    //             if (isFirstWhere === true) {
    //                 output = this.results;
    //             }
    //             else if (output.length > 0) {
    //                 doAnd();
    //             }
    //         }
    //         else {
    //             if (output.length > 0) {
    //                 this.results = [...output, ...this.results];
    //                 this.removeDuplicates();
    //                 output = this.results;
    //             }
    //             else {
    //                 output = this.results;
    //             }
    //         }
    //         isFirstWhere = false;
    //         if (whereQuery.length > 0) {
    //             this.results = [];
    //             processFirstQry();
    //         }
    //         else {
    //             this.results = output;
    //             if (this.isSubQuery === true) {
    //                 this.returnResult_();
    //             }
    //         }

    //     };
    //     const processFirstQry = () => {
    //         this.query.where = whereQuery.shift();
    //         if (this.query.where[QUERY_OPTION.Or]) {
    //             if (Object.keys(this.query.where).length === 1) {
    //                 operation = QUERY_OPTION.Or;
    //                 this.query.where = this.query.where[QUERY_OPTION.Or];
    //                 this.onWhereArrayQrySuccess = onSuccess;
    //             }
    //             else {
    //                 operation = QUERY_OPTION.And;
    //                 this.onWhereArrayQrySuccess = onSuccess;
    //             }
    //         }
    //         else {
    //             operation = QUERY_OPTION.And;
    //             this.onWhereArrayQrySuccess = onSuccess;
    //         }
    //         this.processWhere_();
    //     };
    //     processFirstQry();
    // }

    protected onQueryFinished() {
        // if (this.isOr === true) {
        //     this.orQuerySuccess_();
        // }
        // else if (this.isArrayQry === true) {
        //     this.onWhereArrayQrySuccess();
        // }
        // else if (this.isTxQuery === true || this.isSubQuery === true) {
        //     this.returnResult_();
        // }
    }

    private initTransaction_() {
        this.util.createTransaction([this.tableName], IDB_MODE.ReadOnly);
        this.objectStore = this.util.objectStore(this.tableName);
    }

    private processWhere_() {
        if (this.query.where.or) {
            this.processOrLogic_();
        }
        this.goToWhereLogic();
    }

    private returnResult_ = () => {
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
        return this.results;
    }

    private orQueryFinish_() {
        this.isOr = false;
        this.results = this.orInfo.results;
        // free or info memory
        this.orInfo = null;
        this.removeDuplicates();
        this.onQueryFinished();
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
                this.goToWhereLogic();
            }
            else {
                this.orQueryFinish_();
            }
        }
        else {
            this.orQueryFinish_();
        }
    }

    private processOrLogic_() {
        this.isOr = true;
        this.orInfo = {
            orQuery: this.query.where.or,
            results: []
        };
        // free or memory
        delete this.query.where.or;
    }

    protected onExceptionOccured(ex: DOMException) {
        console.error(ex);
        return Promise.reject(
            getError({
                message: ex.message,
                type: ERROR_TYPE.InvalidQuery
            })
        );
    }

}