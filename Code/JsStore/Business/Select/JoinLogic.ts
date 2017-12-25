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
                    var That = this,
                        TableList = []; // used to open the multiple object store

                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = (<IJoin>query).Join == undefined ?
                                'inner' : (<IJoin>query).Join.toLowerCase();
                            That._queryStack.push(query.Table2);
                            if (That._queryStack.length % 2 == 0) {
                                That._queryStack[That._queryStack.length - 1].NextJoin = query.NextJoin;
                            }
                            TableList.push(query.Table2.Table);
                            return convertQueryIntoStack(query.Table1);
                        }
                        else {
                            That._queryStack.push(query);
                            TableList.push(query.Table);
                            return;
                        }
                    };
                    convertQueryIntoStack(query.From);
                    this._queryStack.reverse();
                    //get the data for first table
                    if (!this._errorOccured) {
                        new Select.Instance(<ISelect>{
                            From: this._queryStack[0].Table,
                            Where: this._queryStack[0].Where
                        }, function (results) {
                            var TableName = That._queryStack[0].Table;
                            results.forEach(function (item, index) {
                                That._results[index] = {};
                                That._results[index][TableName] = item;
                            });
                            That.startExecutionJoinLogic();
                        }, function (error) {
                            That.onErrorOccured(error);
                        });
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
                    var That = this,
                        _results = [],
                        JoinIndex = 0,
                        Column = query.Column,
                        TmpResults = That._results,
                        Item,
                        ResultLength = TmpResults.length;

                    //get the data from query table
                    new Select.Instance(<ISelect>{
                        From: query.Table,
                        Where: query.Where,
                        Order: query.Order
                    }, function (results) {
                        //perform join
                        results.forEach(function (value, index) {
                            //search item through each global result
                            for (var i = 0; i < ResultLength; i++) {
                                Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                //if (Item == value[query.Column]) {
                                doJoin(Item, value, i);
                                //}
                            }
                        });
                        That._results = _results;
                        //check if further execution needed
                        if (That._queryStack.length > That._currentQueryStackIndex + 1) {
                            That.startExecutionJoinLogic();
                        }
                        else {
                            That.onTransactionCompleted(null);
                        }

                    }, function (error) {
                        That.onErrorOccured(error);
                    });

                    var doJoin = function (value1, value2, itemIndex) {
                        _results[JoinIndex] = {};
                        if (value1 == value2[query.Column]) {
                            _results[JoinIndex][query.Table] = value2;
                            //copy other relative data into current result
                            for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                _results[JoinIndex][That._queryStack[j].Table] = TmpResults[itemIndex][That._queryStack[j].Table];
                            }
                            ++JoinIndex;
                        }
                        else if (query.JoinType == 'left') {
                            //left join
                            _results[JoinIndex] = {};
                            _results[JoinIndex][query.Table] = null;
                            //copy other relative data into current result
                            for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                _results[JoinIndex][That._queryStack[j].Table] = TmpResults[itemIndex][That._queryStack[j].Table];
                            }
                            //_results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                            ++JoinIndex;
                        }
                    }

                }

                private executeRightJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var That = this,
                        _results = [],
                        JoinIndex = 0,
                        Column = query.Column,
                        TmpResults = That._results,
                        Item,
                        ResultLength = TmpResults.length,
                        ItemIndex = 0,
                        Where = {},
                        onExecutionFinished = function () {
                            That._results = _results;
                            //check if further execution needed
                            if (That._queryStack.length > That._currentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        },
                        doRightJoin = function (results) {
                            var ValueFound = false;
                            results.forEach(function (item, index) {
                                for (ItemIndex = 0; ItemIndex < ResultLength; ItemIndex++) {
                                    if (item[query.Column] == TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column]) {
                                        ValueFound = true;
                                        break;
                                    }
                                }
                                _results[index] = {};
                                _results[index][query.Table] = item;
                                if (ValueFound) {
                                    ValueFound = false;
                                    for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                        _results[index][That._queryStack[j].Table] = TmpResults[ItemIndex][That._queryStack[j].Table];
                                    }
                                }
                                else {
                                    for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                        _results[index][That._queryStack[j].Table] = null;
                                    }
                                }
                            });
                        },
                        executeLogic = function () {
                            new Select.Instance(<ISelect>{
                                From: query.Table,
                                Where: query.Where,
                                Order: query.Order
                            }, function (results) {
                                doRightJoin(results);
                                onExecutionFinished();
                            }, function (error) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(error);
                            });
                        };
                    executeLogic();
                };

                private executeWhereUndefinedLogicForJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var That = this,
                        _results = [],
                        JoinIndex = 0,
                        Column = query.Column,
                        TmpResults = That._results,
                        Item,
                        ResultLength = TmpResults.length,
                        ItemIndex = 0,
                        Where = {},
                        onExecutionFinished = function () {
                            That._results = _results;
                            //check if further execution needed
                            if (That._queryStack.length > That._currentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        },
                        doJoin = function (results) {
                            if (results.length > 0) {
                                results.forEach(function (value) {
                                    _results[JoinIndex] = {};
                                    _results[JoinIndex][query.Table] = value;
                                    //copy other relative data into current result
                                    for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                        _results[JoinIndex][That._queryStack[j].Table] = TmpResults[ItemIndex][That._queryStack[j].Table];
                                    }
                                    ++JoinIndex;
                                });
                            }
                            else if (query.JoinType == 'left') {
                                //left join
                                _results[JoinIndex] = {};
                                _results[JoinIndex][query.Table] = null;
                                //copy other relative data into current result
                                for (var j = 0; j < That._currentQueryStackIndex; j++) {
                                    _results[JoinIndex][That._queryStack[j].Table] = TmpResults[ItemIndex][That._queryStack[j].Table];
                                }
                                //_results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                                ++JoinIndex;
                            }
                        },
                        executeLogic = function () {
                            if (ItemIndex < ResultLength) {
                                if (!That.ErrorOccured) {
                                    Where[query.Column] = TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column];
                                    new Select.Instance(<ISelect>{
                                        From: query.Table,
                                        Where: Where,
                                        Order: query.Order
                                    }, function (results) {
                                        doJoin(results);
                                        ++ItemIndex;
                                        executeLogic();
                                    }, function (error) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(error);
                                    });
                                }
                            }
                            else {
                                onExecutionFinished();
                            }
                        };
                    executeLogic();
                };

                private startExecutionJoinLogic() {
                    var JoinQuery;
                    if (this._currentQueryStackIndex >= 1 && this._currentQueryStackIndex % 2 == 1) {
                        JoinQuery = <ITableJoin>{
                            Table: this._queryStack[this._currentQueryStackIndex].NextJoin.Table,
                            Column: this._queryStack[this._currentQueryStackIndex].NextJoin.Column
                        }
                        this._currentQueryStackIndex++;
                    }
                    else {
                        JoinQuery = this._queryStack[this._currentQueryStackIndex++];
                    }

                    var _query = this._queryStack[this._currentQueryStackIndex];
                    if (_query.JoinType == 'right') {
                        this.executeRightJoin(JoinQuery, _query);
                    }
                    else if (_query.Where) {
                        this.executeWhereJoinLogic(JoinQuery, _query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(JoinQuery, _query);
                    }

                }




            }
        }
    }
}