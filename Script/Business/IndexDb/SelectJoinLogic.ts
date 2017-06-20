module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectJoinLogic extends BaseSelectLogic {
                Query: ITableJoin;
                ObjectStoreForJoin: IDBObjectStore;
                QueryStack: Array<ITableJoin> = [];
                IndexRequest: Array<IDBIndex> = [];
                Results: Array<any> = [];

                private isExist = function (nameKey, myArray) {
                    for (var i = 0; i < myArray.length; i++) {
                        if (myArray[i].name === nameKey) {
                            return true;
                        }
                    }
                }

                private executeWhereJoinLogic = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var That = this,
                        JoinIndex;
                    //var TmpResults = [];
                    //get the data from query table
                    new SelectLogic(<ISelect>{
                        From: query.Table,
                        Where: query.Where,
                        WhereIn: query.WhereIn
                    }, function (results) {
                        //perform join
                        results.forEach(function (item) {
                            //search item through each global result
                            for (var i = 0; i < That.Results.length; i++) {
                                JoinIndex = i;
                                doJoin()
                            }
                        });
                    }, function (error) {
                        this.onErrorRequest(error);
                    });

                    var doJoin = function (value, cmpValue, index) {
                        switch (query.JoinType) {
                            //inner join
                            case 'inner': if (value == item) {
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = value;
                                Results[JoinIndex][joinQuery.Table] = item;


                            }
                                break;
                            //left join
                            case 'left': if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
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


                private executeWhereUndefinedLogicForJoin = function (joinQuery: ITableJoin, query: ITableJoin) {
                    var That: SelectJoinLogic = this,
                        Results = [],
                        JoinIndex = 0;
                    var CursorOpenRequest,
                        Transaction = DbConnection.transaction([query.Table], "readonly");
                    Transaction.oncomplete = function (e) {
                        if (That.OnSuccess != null && That.QueryStack.length == 1) {
                            That.OnSuccess(That.Results);
                        }
                    }
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
                                if (That.QueryStack.length == 1) {
                                    That.Results = Results;
                                }
                                if (index == That.Results.length - 1) {
                                    That.startExecutionJoinLogic();
                                }
                            }
                        }
                        CursorOpenRequest.onerror = That.onErrorRequest;

                        var doJoin = function (value) {
                            switch (query.JoinType) {
                                //inner join
                                case 'inner': if (value[query.Column] == item[joinQuery.Column]) {
                                    Results[JoinIndex] = {};
                                    Results[JoinIndex][query.Table] = value;
                                    Results[JoinIndex][joinQuery.Table] = item;


                                }
                                    break;
                                //left join
                                case 'left': if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
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
                    for (var i = 0; i < this.Results.length; i++) {
                        ExecuteLogic(this.Results[i][joinQuery.Table], i);
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
                    if (this.QueryStack.length > 1) {
                        var JoinQuery = this.QueryStack[0];
                        this.QueryStack.shift();
                        var Query = this.QueryStack[0];
                        if (Query.WhereIn || this.Query.Where) {
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
}