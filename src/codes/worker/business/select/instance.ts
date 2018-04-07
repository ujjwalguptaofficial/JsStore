import { ISelect, IError } from "../../interfaces";
import { IdbHelper } from "../idb_helper";
import { Helper } from "./helper";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE } from "../../enums";

export class Instance extends Helper {
    query: ISelect;
    constructor(query: ISelect, onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        super();
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.query = query;
        this._skipRecord = query.skip;
        this._limitRecord = query.limit;
        this.tableName = query.from as string; 
    }

    execute() {
        if (this.isTableExist(this.tableName) === true) {
            try {
                if (this.query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    this.initTransaction();
                    if (Array.isArray(this.query.where)) {
                        this.processWhereArrayQry();
                    }
                    else {
                        this.processWhere();
                    }
                }
                else {
                    this.initTransaction();
                    this.executeWhereUndefinedLogic();
                }
            }
            catch (ex) {
                this.errorOccured = true;
                this.onExceptionOccured(ex, { TableName: this.query.from });
            }
        }
        else {
            this.errorOccured = true;
            this.onErrorOccured(
                new LogHelper(ERROR_TYPE.TableNotExist, { TableName: this.query.from }),
                true
            );
        }
    }

    private processWhereArrayQry() {
        this._isArrayQry = true;
        var is_first_where = true,
            where_query = this.query.where,
            output = [], operation,
            pKey = this.getPrimaryKey(this.query.from),
            isItemExist = (keyValue) => {
                var is_exist = false;
                output.every((item) => {
                    if (item[pKey] === keyValue) {
                        is_exist = true;
                        return false;
                    }
                    return true;
                });
                return is_exist;
            },
            onSuccess = function () {
                if (operation === 'and') {
                    var doAnd = function () {
                        var and_results = [];
                        this._results.forEach((item) => {
                            if (isItemExist(item[pKey])) {
                                and_results.push(item);
                            }
                        });
                        output = and_results;
                        and_results = null;
                    }.bind(this);
                    if (output.length > 0) {
                        doAnd();
                    }
                    else if (is_first_where === true) {
                        output = this._results;
                    }
                    else {
                        doAnd();
                    }
                }
                else {
                    if (output.length > 0) {
                        this._results = output.concat(this._results);
                        this.removeDuplicates();
                        output = this._results;
                    }
                    else {
                        output = this._results;
                    }
                }
                if (where_query.length > 0) {
                    this._results = [];
                    processFirstQry();
                }
                else {
                    this._results = output;
                }
                is_first_where = false;
            }.bind(this),
            processFirstQry = function () {
                this._query.where = where_query.shift();
                if (this._query.where['or']) {
                    if (Object.keys(this._query.where).length === 1) {
                        operation = 'or';
                        this._query.where = this._query.where['or'];
                        this._onWhereArrayQrySuccess = onSuccess;
                    }
                    else {
                        operation = 'and';
                        this._onWhereArrayQrySuccess = onSuccess;
                    }
                }
                else {
                    operation = 'and';
                    this._onWhereArrayQrySuccess = onSuccess;
                }
                this.processWhere();
            }.bind(this);
        processFirstQry();
    }

    protected onQueryFinished() {
        if (this._isOr === true) {
            this.orQuerySuccess();
        }
        else if (this._isArrayQry === true) {
            this._onWhereArrayQrySuccess();
        }
        else if (this.isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private initTransaction() {
        IdbHelper.createTransaction([this.tableName], this.onTransactionCompleted.bind(this), 'readonly');
        this.objectStore = IdbHelper.transaction.objectStore(this.tableName);
    }

    private processWhere() {
        if (this.query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    }

    private onTransactionCompleted() {
        if (this.errorOccured === false) {
            this.processOrderBy();
            if (this.query.distinct) {
                var group_by = [];
                var result = this._results[0];
                for (var key in result) {
                    group_by.push(key);
                }
                var primary_key = this.getPrimaryKey(this.query.from),
                    index = group_by.indexOf(primary_key);
                group_by.splice(index, 1);
                this.query.groupBy = group_by.length > 0 ? group_by : null;
            }
            if (this.query.from) {
                if (this.query.aggregate) {
                    this.executeAggregateGroupBy();
                }
                else {
                    this.processGroupBy();
                }
            }
            else if (this.query.aggregate) {
                this.processAggregateQry();
            }
            this.onSuccess(this._results);
        }
    }

    private orQueryFinish() {
        this._isOr = false;
        this._results = (this as any)._orInfo.Results;
        // free or info memory
        (this as any)._orInfo = undefined;
        this.removeDuplicates();
        this.onQueryFinished();
    }

    private orQuerySuccess() {
        (this as any)._orInfo.Results = (this as any)._orInfo.Results.concat(this._results);
        if (!this.query.limit || (this.query.limit > (this as any)._orInfo.Results.length)) {
            this._results = [];
            var key = this.getObjectFirstKey((this as any)._orInfo.OrQuery);
            if (key != null) {
                var where = {};
                where[key] = (this as any)._orInfo.OrQuery[key];
                delete (this as any)._orInfo.OrQuery[key];
                this.query.where = where;
                this.goToWhereLogic();
            }
            else {
                this.orQueryFinish();
            }
        }
        else {
            this.orQueryFinish();
        }
    }

    private processOrLogic() {
        this._isOr = true;
        (this as any)._orInfo = {
            OrQuery: this.query.where.or,
            Results: []
        };
        // free or memory
        delete this.query.where.or;
    }
}