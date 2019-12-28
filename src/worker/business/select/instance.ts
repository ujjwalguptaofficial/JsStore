import { SelectQuery, IError, IDB_MODE, QUERY_OPTION, API } from "../../../common/index";
import { Join } from "./join";
import { QueryHelper } from "../query_helper";
import { isArray, getObjectFirstKey } from "../../utils/index";

export class Instance extends Join {

    constructor(query: SelectQuery, onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        super();
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.query = query;
        this.skipRecord = query.skip;
        this.limitRecord = query.limit;
        this.tableName = query.from;
        this.setPushResult();
        if (query.order) {
            if (isArray(query.order) || query.order.case != null) {
                this.query.order.idbSorting = false;
            }

            if (query.limit != null) {
                this.isOrderWithLimit = true;
            }
            if (query.skip != null) {
                this.isOrderWithSkip = true;
            }
        }

    }

    execute() {
        const queryHelper = new QueryHelper(API.Select, this.query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            try {
                if (this.query.join == null) {
                    if (this.query.where != null) {
                        this.initTransaction_();
                        if (isArray(this.query.where)) {
                            this.processWhereArrayQry();
                        }
                        else {
                            this.processWhere_();
                        }
                    }
                    else {
                        this.initTransaction_();
                        this.executeWhereUndefinedLogic();
                    }

                }
                else {
                    this.executeJoinQuery();
                }
            }
            catch (ex) {
                this.onExceptionOccured(ex);
            }
        }
        else {
            this.onError(
                queryHelper.error
            );
        }
    }


    private processWhereArrayQry() {
        this.isArrayQry = true;
        const whereQuery = this.query.where,
            pKey = this.getPrimaryKey(this.query.from);
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
                if (output.length > 0) {
                    doAnd();
                }
                else if (isFirstWhere === true) {
                    output = this.results;
                }
                else {
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
                processFirstQry();
            }
            else {
                this.results = output;
                if (this.isSubQuery === true) {
                    this.onTransactionCompleted_();
                }
            }

        };
        const processFirstQry = () => {
            this.query.where = whereQuery.shift();
            if (this.query.where[QUERY_OPTION.Or]) {
                if (Object.keys(this.query.where).length === 1) {
                    operation = QUERY_OPTION.Or;
                    this.query.where = this.query.where[QUERY_OPTION.Or];
                    this.onWhereArrayQrySuccess = onSuccess;
                }
                else {
                    operation = QUERY_OPTION.And;
                    this.onWhereArrayQrySuccess = onSuccess;
                }
            }
            else {
                operation = QUERY_OPTION.And;
                this.onWhereArrayQrySuccess = onSuccess;
            }
            this.processWhere_();
        };
        processFirstQry();
    }

    protected onQueryFinished() {
        if (this.isOr === true) {
            this.orQuerySuccess_();
        }
        else if (this.isArrayQry === true) {
            this.onWhereArrayQrySuccess();
        }
        else if (this.isTransaction === true || this.isSubQuery === true) {
            this.onTransactionCompleted_();
        }
    }

    private initTransaction_() {
        this.createTransaction([this.tableName], this.onTransactionCompleted_, IDB_MODE.ReadOnly);
        this.objectStore = this.transaction.objectStore(this.tableName);
    }

    private processWhere_() {
        if (this.query.where.or) {
            this.processOrLogic_();
        }
        this.goToWhereLogic();
    }

    private onTransactionCompleted_ = () => {
        if (this.error == null) {
            this.processOrderBy();
            if (!this.error) {
                if (this.query.order && this.query.skip) {
                    this.results.splice(0, this.query.skip);
                }
                if (this.isOrderWithLimit === true) {
                    this.results = this.results.slice(0, this.query.limit);
                }
                this.processGroupDistinctAggr();
                this.onSuccess(this.results);
            }
            else {
                this.onError(this.error);
            }
        }
        else {
            this.onError(this.error);
        }
    }

    private orQueryFinish_() {
        this.isOr = false;
        this.results = this.orInfo.results;
        // free or info memory
        this.orInfo = undefined;
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
}