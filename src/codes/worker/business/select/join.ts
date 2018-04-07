import { BaseSelect } from "./base_select";
import { ISelectJoin, ITableJoin, IError, IJoin, ISelect } from "../../interfaces";
import * as Select from './instance';

export class Join extends BaseSelect {
    query: ISelectJoin;
    _queryStack: ITableJoin[] = [];
    _currentQueryStackIndex = 0;

    constructor(query: ISelectJoin, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
        var table_list = []; // used to open the multiple object store

        var convertQueryIntoStack = function (qry) {
            if (qry.hasOwnProperty('Table1')) {
                qry.Table2['JoinType'] = (qry as IJoin).join === undefined ?
                    'inner' : (qry as IJoin).join.toLowerCase();
                this._queryStack.push(qry.Table2);
                if (this._queryStack.length % 2 === 0) {
                    this._queryStack[this._queryStack.length - 1].NextJoin = qry.NextJoin;
                }
                table_list.push(qry.Table2.Table);
                return convertQueryIntoStack(qry.Table1);
            }
            else {
                this._queryStack.push(qry);
                table_list.push(qry.Table);
                return;
            }
        }.bind(this);
        convertQueryIntoStack(query.from);
        this._queryStack.reverse();
        // get the data for first table
        if (!this.errorOccured) {
            var select_object = new Select.Instance({
                from: this._queryStack[0].table,
                where: this._queryStack[0].where
            } as ISelect, function (results) {
                var table_name = this._queryStack[0].Table;
                results.forEach(function (item, index) {
                    this._results[index] = {};
                    this._results[index][table_name] = item;
                }, this);
                this.startExecutionJoinLogic();
            }.bind(this), this.onErrorOccured.bind(this));
            select_object.execute();
        }
    }

    private onTransactionCompleted(e) {
        if (this.onSuccess != null && (this._queryStack.length === this._currentQueryStackIndex + 1)) {
            if (this.query['Count']) {
                this.onSuccess(this._results.length);
            }
            else {
                if (this.query['Skip'] && this.query['Limit']) {
                    this._results.splice(0, this.query['Skip']);
                    this._results.splice(this.query['Limit'] - 1, this._results.length);
                }
                else if (this.query['Skip']) {
                    this._results.splice(0, this.query['Skip']);
                }
                else if (this.query['Limit']) {
                    this._results.splice(this.query['Limit'] - 1, this._results.length);
                }
                this.onSuccess(this._results);
            }

        }
    }

    private executeWhereJoinLogic(joinQuery: ITableJoin, query: ITableJoin) {
        var results = [],
            join_index = 0,
            column = query.column,
            tmp_results = this._results,
            item,
            result_length = tmp_results.length;

        // get the data from query table
        var select_object = new Select.Instance({
            from: query.table,
            order: query.order,
            where: query.where
        } as ISelect, function (selectResults) {
            // perform join
            selectResults.forEach((value, index) => {
                // search item through each global result
                for (var i = 0; i < result_length; i++) {
                    item = tmp_results[i][joinQuery.table][joinQuery.column];
                    doJoin(item, value, i);
                }
            });
            this._results = results;
            // check if further execution needed
            if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic();
            }
            else {
                this.onTransactionCompleted(null);
            }

        }.bind(this), this.onErrorOccured.bind(this));
        select_object.execute();

        var doJoin = function (value1, value2, itemIndex) {
            results[join_index] = {};
            if (value1 === value2[query.column]) {
                results[join_index][query.table] = value2;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    results[join_index][this._queryStack[j].Table] =
                        tmp_results[itemIndex][this._queryStack[j].Table];
                }
                ++join_index;
            }
            else if (query.joinType === 'left') {
                // left join
                results[join_index] = {};
                results[join_index][query.table] = null;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    results[join_index][this._queryStack[j].Table] =
                        tmp_results[itemIndex][this._queryStack[j].Table];
                }
                // results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                ++join_index;
            }
        }.bind(this);
    }

    private executeRightJoin(joinQuery: ITableJoin, query: ITableJoin) {
        var join_results = [],
            join_index = 0,
            column = query.column,
            tmp_results = this._results,
            result_length = tmp_results.length,
            item_index = 0,
            where = {},
            onExecutionFinished = function () {
                this._results = join_results;
                // check if further execution needed
                if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                    this.startExecutionJoinLogic();
                }
                else {
                    this.onTransactionCompleted(null);
                }
            }.bind(this),
            doRightJoin = function (results) {
                var value_found = false;
                results.forEach(function (item, index) {
                    for (item_index = 0; item_index < result_length; item_index++) {
                        if (item[query.column] ===
                            tmp_results[item_index][joinQuery.table][joinQuery.column]) {
                            value_found = true;
                            break;
                        }
                    }
                    join_results[index] = {};
                    join_results[index][query.table] = item;
                    if (value_found) {
                        value_found = false;
                        for (var j = 0; j < this._currentQueryStackIndex; j++) {
                            join_results[index][this._queryStack[j].Table] =
                                tmp_results[item_index][this._queryStack[j].Table];
                        }
                    }
                    else {
                        for (var j = 0; j < this._currentQueryStackIndex; j++) {
                            join_results[index][this._queryStack[j].Table] = null;
                        }
                    }
                }, this);
            }.bind(this),
            executeLogic = () => {
                var select_object = new Select.Instance({
                    from: query.table,
                    order: query.order,
                    where: query.where
                } as ISelect, (results) => {
                    doRightJoin(results);
                    onExecutionFinished();
                }, this.onErrorOccured.bind(this));
                select_object.execute();
            };
        executeLogic();
    }

    private executeWhereUndefinedLogicForJoin(joinQuery: ITableJoin, query: ITableJoin) {
        var join_results = [],
            join_index = 0,
            column = query.column,
            tmp_results = this._results,
            // Item,
            result_length = tmp_results.length,
            item_index = 0,
            where = {},
            onExecutionFinished = function () {
                this._results = join_results;
                // check if further execution needed
                if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                    this.startExecutionJoinLogic();
                }
                else {
                    this.onTransactionCompleted(null);
                }
            }.bind(this),
            doJoin = function (results) {
                if (results.length > 0) {
                    results.forEach(function (value) {
                        join_results[join_index] = {};
                        join_results[join_index][query.table] = value;
                        // copy other relative data into current result
                        for (var k = 0; k < this._currentQueryStackIndex; k++) {
                            join_results[join_index][this._queryStack[k].Table] =
                                tmp_results[item_index][this._queryStack[k].Table];
                        }
                        ++join_index;
                    }, this);
                }
                else if (query.joinType === 'left') {
                    // left join
                    join_results[join_index] = {};
                    join_results[join_index][query.table] = null;
                    // copy other relative data into current result
                    for (var j = 0; j < this._currentQueryStackIndex; j++) {
                        join_results[join_index][this._queryStack[j].Table] =
                            tmp_results[item_index][this._queryStack[j].Table];
                    }
                    ++join_index;
                }
            }.bind(this),
            executeLogic = function () {
                if (item_index < result_length) {
                    if (!this._errorOccured) {
                        where[query.column] = tmp_results[item_index][joinQuery.table][joinQuery.column];
                        var select_object = new Select.Instance({
                            from: query.table,
                            order: query.order,
                            where: where
                        } as ISelect, (results) => {
                            doJoin(results);
                            ++item_index;
                            executeLogic();
                        }, this.onErrorOccured.bind(this));
                        select_object.execute();
                    }
                }
                else {
                    onExecutionFinished();
                }
            }.bind(this);
        executeLogic();
    }

    private startExecutionJoinLogic() {
        var join_query;
        if (this._currentQueryStackIndex >= 1 && this._currentQueryStackIndex % 2 === 1) {
            join_query = {
                column: this._queryStack[this._currentQueryStackIndex].nextJoin.column,
                table: this._queryStack[this._currentQueryStackIndex].nextJoin.table
            } as ITableJoin;
            this._currentQueryStackIndex++;
        }
        else {
            join_query = this._queryStack[this._currentQueryStackIndex++];
        }

        var query = this._queryStack[this._currentQueryStackIndex];
        if (query.joinType === 'right') {
            this.executeRightJoin(join_query, query);
        }
        else if (query.where) {
            this.executeWhereJoinLogic(join_query, query);
        }
        else {
            this.executeWhereUndefinedLogicForJoin(join_query, query);
        }
    }
}