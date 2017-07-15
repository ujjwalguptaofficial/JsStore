module JsStore {
    export module Business {
        export class SelectJoinLogic extends BaseSelectLogic {
            Query: ISelectJoin;
            QueryStack: Array<ITableJoin> = [];
            CurrentQueryStackIndex = 0;

            private onTransactionCompleted = function (e) {
                if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                    if (this.Query['Count']) {
                        this.OnSuccess(this.Results.length);
                    }
                    else {
                        if (this.Query['Skip'] && this.Query['Limit']) {
                            this.Results.splice(0, this.Query['Skip']);
                            this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                        }
                        else if (this.Query['Skip']) {
                            this.Results.splice(0, this.Query['Skip']);
                        }
                        else if (this.Query['Limit']) {
                            this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                        }
                        this.OnSuccess(this.Results);
                    }

                }
            }

            private executeWhereJoinLogic = function (joinQuery: ITableJoin, query: ITableJoin) {
                var That = <SelectJoinLogic>this,
                    Results = [],
                    JoinIndex = 0,
                    Column = query.Column,
                    TmpResults = That.Results,
                    Item,
                    ResultLength = TmpResults.length;

                //get the data from query table
                new SelectLogic(<ISelect>{
                    From: query.Table,
                    Where: query.Where,
                    WhereIn: query.WhereIn
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
                    That.Results = Results;
                    //check if further execution needed
                    if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                        That.startExecutionJoinLogic();
                    }
                    else {
                        That.onTransactionCompleted(null);
                    }

                }, function (error) {
                    That.onErrorOccured(error);
                });

                var doJoin = function (value1, value2, itemIndex) {
                    Results[JoinIndex] = {};
                    if (value1 == value2[query.Column]) {
                        Results[JoinIndex][query.Table] = value2;
                        //copy other relative data into current result
                        for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                            Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                        }
                        ++JoinIndex;
                    }
                    else {
                        switch (query.JoinType) {
                            //left join
                            case 'left':
                                Results[JoinIndex][query.Table] = value2;
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = null;
                                }
                                ++JoinIndex;
                                break;
                            //right join
                            case 'right':
                                Results[JoinIndex][query.Table] = null;
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                ++JoinIndex;
                                break;
                        }
                    }
                }

            }

            private executeWhereUndefinedLogicForJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                var That = <SelectJoinLogic>this,
                    Results = [],
                    JoinIndex = 0,
                    Column = query.Column,
                    TmpResults = That.Results,
                    Item,
                    ResultLength = TmpResults.length,
                    ItemIndex = 0,
                    Where = {},
                    doJoin = function (results) {
                        if (results.length > 0) {
                            results.forEach(function (value) {
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = value;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                }
                                ++JoinIndex;
                            });
                        }
                        else {
                            Results[JoinIndex] = {};
                            switch (query.JoinType) {
                                //left join
                                case 'left':
                                    Results[JoinIndex][query.Table] = Where[query.Column];
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = null;
                                    }
                                    ++JoinIndex;
                                    break;
                                //right join
                                case 'right':
                                    Results[JoinIndex][query.Table] = null;
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                    }
                                    ++JoinIndex;
                                    break;
                            }
                        }
                    },
                    executeLogic = function () {
                        if (ItemIndex < ResultLength) {
                            if (!That.ErrorOccured) {
                                Where[query.Column] = TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column];
                                new SelectLogic(<ISelect>{
                                    From: query.Table,
                                    Where: Where
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
                            That.Results = Results;
                            //check if further execution needed
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }
                    };
                executeLogic();
            }


            constructor(query: ISelectJoin, onSuccess: Function, onError: Function) {
                super();
                this.OnSuccess = onSuccess;
                this.OnError = onError;
                this.Query = query;
                var That = this,
                    TableList = []; // used to open the multiple object store

                var convertQueryIntoStack = function (query) {
                    if (query.hasOwnProperty('Table1')) {
                        query.Table2['JoinType'] = (<IJoin>query).Join == undefined ? 'inner' : (<IJoin>query).Join.toLowerCase();
                        That.QueryStack.push(query.Table2);
                        if (That.QueryStack.length % 2 == 0) {
                            That.QueryStack[That.QueryStack.length - 1].NextJoin = query.NextJoin;
                        }
                        TableList.push(query.Table2.Table);
                        return convertQueryIntoStack(query.Table1);
                    }
                    else {
                        That.QueryStack.push(query);
                        TableList.push(query.Table);
                        return;
                    }
                };
                convertQueryIntoStack(query.From);
                this.QueryStack.reverse();
                //get the data for first table
                if (!this.ErrorOccured) {
                    new SelectLogic(<ISelect>{
                        From: this.QueryStack[0].Table,
                        Where: this.QueryStack[0].Where,
                        WhereIn: this.QueryStack[0].WhereIn
                    }, function (results) {
                        var TableName = That.QueryStack[0].Table;
                        results.forEach(function (item, index) {
                            That.Results[index] = {};
                            That.Results[index][TableName] = item;
                        });
                        That.startExecutionJoinLogic();
                    }, function (error) {
                        That.onErrorOccured(error);
                    });
                }
            }

            private startExecutionJoinLogic() {
                var JoinQuery;
                if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
                    JoinQuery = <ITableJoin>{
                        Table: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table,
                        Column: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Column
                    }
                    this.CurrentQueryStackIndex++;
                }
                else {
                    JoinQuery = this.QueryStack[this.CurrentQueryStackIndex++];
                }

                var Query = this.QueryStack[this.CurrentQueryStackIndex];
                if (Query.WhereIn || Query.Where) {
                    this.executeWhereJoinLogic(JoinQuery, Query);
                }
                else {
                    this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                }

            }
        }
    }
}
