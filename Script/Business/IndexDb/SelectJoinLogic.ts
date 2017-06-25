module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectJoinLogic extends BaseSelectLogic {
                Query: ITableJoin;
                QueryStack: Array<ITableJoin> = [];
                CurrentQueryStackIndex = 0;

                private onTransactionCompleted = function (e) {
                    if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                        this.OnSuccess(this.Results);
                    }
                }

                private executeWhereJoinLogic = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var That = <SelectJoinLogic>this,
                        Results = [],
                        JoinIndex,
                        TmpResults = That.Results;

                    //get the data from query table
                    new SelectLogic(<ISelect>{
                        From: query.Table,
                        Where: query.Where,
                        WhereIn: query.WhereIn
                    }, function (results) {
                        //perform join
                        JoinIndex = 0;
                        var Item,
                            ResultLength = TmpResults.length;
                        results.forEach(function (value, index) {
                            //search item through each global result
                            for (var i = 0; i < ResultLength; i++) {
                                Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                if (Item == value[query.Column]) {
                                    doJoin(value, i);
                                    ++JoinIndex;
                                }

                            }
                        });
                        That.Results = Results;
                        if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                            That.startExecutionJoinLogic();
                        }
                        else {
                            That.onTransactionCompleted(null);
                        }

                    }, function (error) {
                        this.onErrorRequest(error);
                    });

                    var doJoin = function (value, itemIndex) {
                        // if (Results[JoinIndex] == undefined) {
                        Results[JoinIndex] = {};
                        // }

                        switch (query.JoinType) {
                            //inner join
                            case 'inner':
                                Results[JoinIndex][query.Table] = value;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                break;
                            //left join
                            case 'left': //if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
                                if (value != null) {
                                    That.Results[JoinIndex][query.Table] = value;
                                }
                                else { //add null element
                                    That.Results[JoinIndex][query.Table] = null;
                                };
                                break;
                            //right join
                            case 'right': if (value[query.Column] == That.Results[JoinIndex][joinQuery.Table][joinQuery.Column]) {
                                That.Results[JoinIndex][query.Table] = value;
                            }
                            else { //shift array to 1 position with null as first value and value as second value
                                That.Results.splice(JoinIndex, 0, null);
                                That.Results[JoinIndex][joinQuery.Table] = null;
                                That.Results[JoinIndex][query.Table] = value;
                            }
                                break;
                        }

                    }

                }

                private executeWhereUndefinedLogicForJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    try {
                        var That: SelectJoinLogic = this,
                            Results = [],
                            JoinIndex,
                            TmpResults = That.Results,
                            CursorOpenRequest,
                            ResultLength = this.Results.length,
                            Transaction = DbConnection.transaction([query.Table], "readonly");
                        Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted(e);
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                        };
                        var ExecuteLogic = function (item, index) {
                            JoinIndex = 0;
                            this.ObjectStore = Transaction.objectStore(query.Table);
                            CursorOpenRequest = this.ObjectStore.index(query.Column).openCursor(IDBKeyRange.only(item[joinQuery.Column]));

                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    doJoin(Cursor.value);
                                    Cursor.continue();
                                    ++JoinIndex;
                                }
                                else {
                                    //copy other relative data into current result
                                    if (That.CurrentQueryStackIndex == 1) {
                                        That.Results = Results;
                                    }
                                    else {
                                        for (var i = 0; i < Results.length; i++) {
                                            var ColumnValue = Results[i][joinQuery.Table][joinQuery.Column],
                                                TableName;
                                            for (var j = 0; j < TmpResults.length; j++) {
                                                if (ColumnValue == TmpResults[j][joinQuery.Table][joinQuery.Column]) {
                                                    for (var k = 0; k < That.CurrentQueryStackIndex; k++) {
                                                        // Results[JoinIndex][joinQuery.Table] = item;
                                                        TableName = That.QueryStack[k].Table;
                                                        Results[i][TableName] = TmpResults[j][TableName];
                                                    }
                                                    break;
                                                }
                                            }

                                        }
                                        That.Results = Results;
                                    }
                                    // if (index == ResultLength - 1 && (That.QueryStack.length > That.CurrentQueryStackIndex + 1)) {
                                    //     That.startExecutionJoinLogic();
                                    // }
                                }
                            }
                            CursorOpenRequest.onerror = That.onErrorRequest;

                            var doJoin = function (value) {
                                Results[JoinIndex] = {};
                                switch (query.JoinType) {
                                    //inner join
                                    case 'inner':
                                        Results[JoinIndex][query.Table] = value;
                                        Results[JoinIndex][joinQuery.Table] = item;
                                        break;
                                    //left join
                                    case 'left': //if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
                                        if (value != null) {
                                            That.Results[index][query.Table] = value;
                                        }
                                        else { //add null element
                                            That.Results[index][query.Table] = null;
                                        };
                                        break;
                                    //right join
                                    case 'right': if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
                                        That.Results[index][query.Table] = value;
                                    }
                                    else { //shift array to 1 position with null as first value and value as second value
                                        That.Results.splice(index, 0, null);
                                        That.Results[index][joinQuery.Table] = null;
                                        That.Results[index][query.Table] = value;
                                    }
                                        break;
                                }

                            }
                        }
                        for (var i = 0; i < ResultLength; i++) {
                            ExecuteLogic(TmpResults[i][joinQuery.Table], i);
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            UtilityLogic.getError(ErrorType.TableNotExist, true, { TableName: query.Table });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }

                constructor(query: ISelectJoin, onSuccess: Function, onError: Function) {
                    super();
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
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
                    // if (this.QueryStack.length > 2) {
                    //     for (var i = 0, length = this.QueryStack.length; i < length; i++) {
                    //         if (i % 2 == 1 && this.QueryStack[i].NextJoin != null) {

                    //         }
                    //         else {
                    //             this.ErrorOccured = true;
                    //             UtilityLogic.getError(ErrorType.NextJoinNotExist, true, {});
                    //             break;
                    //         }
                    //     }
                    // }
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
                            That.onErrorRequest(error);
                        });
                    }
                }

                private startExecutionJoinLogic() {
                    var JoinQuery;
                    if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
                        // if (this.QueryStack[this.CurrentQueryStackIndex].Table == this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table) {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
                        // else {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
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
}