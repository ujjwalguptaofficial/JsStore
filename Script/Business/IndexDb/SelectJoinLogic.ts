module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectJoinLogic extends BaseSelectLogic {
                Query: ITableJoin;
                // ObjectStoreForJoin: IDBObjectStore;
                QueryStack: Array<ITableJoin> = [];
                CurrentQueryStackIndex = 0;
                // IndexRequest: Array<IDBIndex> = [];
                Results: Array<any> = [];

                private onTransactionCompleted = function (e) {
                    if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                        this.OnSuccess(this.Results);
                    }
                }

                private isExist = function (nameKey, myArray) {
                    for (var i = 0; i < myArray.length; i++) {
                        if (myArray[i].name === nameKey) {
                            return myArray[i];
                        }
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
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    // Results[JoinIndex][joinQuery.Table] = item;
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
                    var That: SelectJoinLogic = this,
                        Results = [],
                        JoinIndex,
                        TmpResults = That.Results,
                        CursorOpenRequest,
                        ResultLength = this.Results.length,
                        Transaction = DbConnection.transaction([query.Table], "readonly");
                    Transaction.oncomplete = function (e) {
                        That.onTransactionCompleted(e);
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
                                if (index == ResultLength - 1 && (That.QueryStack.length > That.CurrentQueryStackIndex + 1)) {
                                    That.startExecutionJoinLogic();
                                }
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

                constructor(query: ISelectJoin, onSuccess: Function, onError: Function) {
                    super();
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this,
                        TableList = []; // used to open the multiple object store

                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2.Table = query.Table2.Table.toLowerCase();
                            query.Table2['JoinType'] = (<IJoin>query).Join == undefined ? 'inner' : (<IJoin>query).Join.toLowerCase();
                            That.QueryStack.push(query.Table2);
                            TableList.push(query.Table2.Table);
                            return convertQueryIntoStack(query.Table1);
                        }
                        else {
                            query.Table = query.Table.toLowerCase();
                            That.QueryStack.push(query);
                            TableList.push(query.Table);
                            return;
                        }
                    };
                    convertQueryIntoStack(query.From);
                    this.QueryStack.reverse();
                    //get the data for first table
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
                        this.onErrorRequest(error);
                    });
                }

                private startExecutionJoinLogic() {

                    var JoinQuery = this.QueryStack[this.CurrentQueryStackIndex++];
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