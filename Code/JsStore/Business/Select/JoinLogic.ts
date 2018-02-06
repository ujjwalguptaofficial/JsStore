namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Join extends BaseSelect {
                _query: ISelectJoin;
                _queryStack: ITableJoin[] = [];
                _currentQueryStackIndex = 0;

                constructor(query: ISelectJoin, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
                    super();
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._query = query;
                    var table_list = []; // used to open the multiple object store

                    var convertQueryIntoStack = function (qry) {
                        if (qry.hasOwnProperty('Table1')) {
                            qry.Table2['JoinType'] = (qry as IJoin).Join === undefined ?
                                'inner' : (qry as IJoin).Join.toLowerCase();
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
                    convertQueryIntoStack(query.From);
                    this._queryStack.reverse();
                    // get the data for first table
                    if (!this._errorOccured) {
                        var select_object = new Select.Instance({
                            From: this._queryStack[0].Table,
                            Where: this._queryStack[0].Where
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

                private onTransactionCompleted = function (e) {
                    if (this._onSuccess != null && (this._queryStack.length === this._currentQueryStackIndex + 1)) {
                        if (this._query['Count']) {
                            this._onSuccess(this._results.length);
                        }
                        else {
                            if (this._query['Skip'] && this._query['Limit']) {
                                this._results.splice(0, this._query['Skip']);
                                this._results.splice(this._query['Limit'] - 1, this._results.length);
                            }
                            else if (this._query['Skip']) {
                                this._results.splice(0, this._query['Skip']);
                            }
                            else if (this._query['Limit']) {
                                this._results.splice(this._query['Limit'] - 1, this._results.length);
                            }
                            this._onSuccess(this._results);
                        }

                    }
                };

                private executeWhereJoinLogic = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var results = [],
                        join_index = 0,
                        column = query.Column,
                        tmp_results = this._results,
                        item,
                        result_length = tmp_results.length;

                    // get the data from query table
                    var select_object = new Select.Instance({
                        From: query.Table,
                        Order: query.Order,
                        Where: query.Where
                    } as ISelect, function (selectResults) {
                        // perform join
                        selectResults.forEach(function (value, index) {
                            // search item through each global result
                            for (var i = 0; i < result_length; i++) {
                                item = tmp_results[i][joinQuery.Table][joinQuery.Column];
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
                        if (value1 === value2[query.Column]) {
                            results[join_index][query.Table] = value2;
                            // copy other relative data into current result
                            for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                results[join_index][this._queryStack[j].Table] =
                                    tmp_results[itemIndex][this._queryStack[j].Table];
                            }
                            ++join_index;
                        }
                        else if (query.JoinType === 'left') {
                            // left join
                            results[join_index] = {};
                            results[join_index][query.Table] = null;
                            // copy other relative data into current result
                            for (var j = 0; j < this._currentQueryStackIndex; j++) {
                                results[join_index][this._queryStack[j].Table] =
                                    tmp_results[itemIndex][this._queryStack[j].Table];
                            }
                            // results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                            ++join_index;
                        }
                    }.bind(this);
                };

                private executeRightJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var join_results = [],
                        join_index = 0,
                        column = query.Column,
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
                                    if (item[query.Column] ===
                                        tmp_results[item_index][joinQuery.Table][joinQuery.Column]) {
                                        value_found = true;
                                        break;
                                    }
                                }
                                join_results[index] = {};
                                join_results[index][query.Table] = item;
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
                        executeLogic = function () {
                            var select_object = new Select.Instance({
                                From: query.Table,
                                Order: query.Order,
                                Where: query.Where
                            } as ISelect, function (results) {
                                doRightJoin(results);
                                onExecutionFinished();
                            }.bind(this), this.onErrorOccured.bind(this));
                            select_object.execute();
                        }.bind(this);
                    executeLogic();
                };

                private executeWhereUndefinedLogicForJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var join_results = [],
                        join_index = 0,
                        column = query.Column,
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
                                    join_results[join_index][query.Table] = value;
                                    // copy other relative data into current result
                                    for (var k = 0; k < this._currentQueryStackIndex; k++) {
                                        join_results[join_index][this._queryStack[k].Table] =
                                            tmp_results[item_index][this._queryStack[k].Table];
                                    }
                                    ++join_index;
                                }, this);
                            }
                            else if (query.JoinType === 'left') {
                                // left join
                                join_results[join_index] = {};
                                join_results[join_index][query.Table] = null;
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
                                    where[query.Column] = tmp_results[item_index][joinQuery.Table][joinQuery.Column];
                                    var select_object = new Select.Instance({
                                        From: query.Table,
                                        Order: query.Order,
                                        Where: where
                                    } as ISelect, function (results) {
                                        doJoin(results);
                                        ++item_index;
                                        executeLogic();
                                    }.bind(this), this.onErrorOccured.bind(this));
                                    select_object.execute();
                                }
                            }
                            else {
                                onExecutionFinished();
                            }
                        }.bind(this);
                    executeLogic();
                };

                private startExecutionJoinLogic() {
                    var join_query;
                    if (this._currentQueryStackIndex >= 1 && this._currentQueryStackIndex % 2 === 1) {
                        join_query = {
                            Column: this._queryStack[this._currentQueryStackIndex].NextJoin.Column,
                            Table: this._queryStack[this._currentQueryStackIndex].NextJoin.Table
                        } as ITableJoin;
                        this._currentQueryStackIndex++;
                    }
                    else {
                        join_query = this._queryStack[this._currentQueryStackIndex++];
                    }

                    var query = this._queryStack[this._currentQueryStackIndex];
                    if (query.JoinType === 'right') {
                        this.executeRightJoin(join_query, query);
                    }
                    else if (query.Where) {
                        this.executeWhereJoinLogic(join_query, query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(join_query, query);
                    }
                }
            }
        }
    }
}