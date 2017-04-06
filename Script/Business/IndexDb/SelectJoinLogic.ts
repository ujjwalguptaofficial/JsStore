module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectJoinLogic extends BaseSelectLogic {
                Query: ITableJoin;
                ObjectStoreForJoin: IDBObjectStore;
                QueryStack: Array<ITableJoin> = [];
                IndexRequest: Array<IDBIndex> = []
                private executeWhereInLogic = function () {
                    if (Array.isArray(this.Query.WhereIn)) {
                        this.executeMultipleWhereInLogic(this.Query.WhereIn);
                    }
                    else {
                        this.executeSingleWhereInLogic(this.Query.WhereIn);
                    }
                }

                private executeWhereLogic = function (query: ITableJoin, queryJoin: ITableJoin, joinType = "inner") {
                    var Column,
                        That: SelectJoinLogic = this,
                        ExecutionNo = 0,
                        ConditionLength = Object.keys(query.Where).length,
                        OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                That.onSuccessRequest();
                            }
                        };
                    for (Column in query.Where) {
                        if (!this.ErrorOccured) {
                            if (this.ObjectStore.keyPath != null && this.ObjectStore.keyPath == Column) {
                                var GetRequest = this.ObjectStore.get(query.Where[Column]);
                                GetRequest.onerror = function (e) {
                                    That.ErrorOccured = true; ++That.ErrorCount;
                                    That.onErrorRequest(e);
                                }
                                GetRequest.onsuccess = function (e) {
                                    var Result = (<any>e).target.result
                                    if (Result) {
                                        //That.doInner(query,Result[query.Column],queryJoin.Column,Result[query.Column])
                                        That.Results.push();
                                    }
                                    OnSuccessGetRequest();
                                }

                            }
                            else if (this.ObjectStore.indexNames.contains(Column)) {
                                var CursorOpenRequest = this.ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true; ++this.ErrorCount;
                                    That.onErrorRequest(e);
                                }
                                if (query.Skip && query.Limit) {
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == query.Skip) {
                                                if (That.Results.length != query.Limit) {
                                                    That.Results.push(Cursor);
                                                    Cursor.continue();
                                                }
                                                else {
                                                    OnSuccessGetRequest();
                                                }
                                            }
                                            else {
                                                ++RecordSkipped;
                                            }
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    }
                                }
                                else if (query.Skip) { //skip exist
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == query.Limit) {
                                                That.Results.push(Cursor);
                                            }
                                            else {
                                                ++RecordSkipped;
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    }
                                }
                                else if (query.Limit) {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor && That.Results.length != query.Limit) {
                                            That.Results.push(Cursor);
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    }
                                }
                                else {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            That.Results[That.Results.length - 1][query.Table] = Cursor.value;
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    }
                                }

                            }
                            else {
                                UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            }
                        }

                    }
                }

                // private executeJoinLogic = function (value, onSuccess: Function, onError: Function, results: any = {}, index = 1) {
                //     var JoinStatus = true,
                //         Results = [],
                //         That: SelectJoinLogic = this,
                //         CursorJoinRequest = this.IndexRequest[index - 1].openCursor(IDBKeyRange.only(value[this.QueryStack[index].Column]));
                //     CursorJoinRequest.onsuccess = function (e) {
                //         var Cursor: IDBCursorWithValue = (<any>e).target.result;
                //         if (Cursor) {
                //             switch (That.QueryStack[index].JoinType) {
                //                 case 'inner': Results.push(Cursor.value); break;
                //                 case 'left':
                //             }

                //         }
                //         else {
                //             ++index;
                //             results[this.QueryStack[index].Column] = Results;
                //             if (index <= this.IndexRequest.length) {
                //                 That.executeJoinLogic(Results, onSuccess, onError, results);
                //             }
                //             else {
                //                 That.Results.push(results);
                //                 onSuccess();
                //             }
                //         }
                //     }
                //     CursorJoinRequest.onerror = function (e) {
                //         onError(e);
                //     }
                // }

                private executeJoinLogic = function (joinData: Array<any>, joinTable: string, joinColumn: string, query: ITableJoin) {
                    var Column,
                        SkipRecord = this.Query.Skip,
                        LimitRecord = this.Query.Limit,
                        That: SelectJoinLogic = this,
                        ConditionLength = 0,
                        OnSuccessGetRequest = function () {
                            --ConditionLength;
                            if (ConditionLength == 0)
                                That.onSuccessRequest();
                        };

                    var executeInnerWhereLogic = function (column, value) {

                        if (That.ObjectStore.indexNames.contains(column)) {
                            var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true; ++That.ErrorCount;
                                That.onErrorRequest(e);
                            }
                            if (SkipRecord && LimitRecord) {
                                var RecordSkipped = false;
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            if (That.Results.length != LimitRecord) {
                                                That.Results.push(Cursor);
                                                Cursor.continue();
                                            }
                                            else {
                                                OnSuccessGetRequest();
                                            }
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(SkipRecord - 1);
                                        }
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }
                            }
                            else if (SkipRecord) { //skip exist
                                var RecordSkipped = false;
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            That.Results.push(Cursor);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(SkipRecord - 1);
                                        }


                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }
                            }
                            else if (LimitRecord) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor && That.Results.length != LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }
                            }
                            else {
                                var Index = 0;
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                            doJoin(Index, Cursor.value);
                                        }
                                        Cursor.continue(joinData[joinColumn][Index]);
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }
                            }
                        }
                        else {
                            UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                        }
                        return false;
                    }

                    var doJoin = function (index, value) {
                        switch (query.JoinType) {
                            //inner join
                            case 'inner': if (value[query.Column][index] == joinData[joinColumn][index]) {
                                That.Results[index++][query.Table] = value;
                            }
                            else { //remove current element
                                That.Results.splice(index, 1);
                            }; break;
                            //left join
                            case 'left': if (index[query.Column][index] == joinData[joinColumn][index]) {
                                That.Results[index++][query.Table] = value;
                            }
                            else { //add null element
                                That.Results[index++][query.Table] = null;
                            };
                                break;
                            //right join
                            case 'right': if (value[query.Column][index] == joinData[joinColumn][index]) {
                                That.Results[index++][query.Table] = value;
                            }
                            else { //shift array to 1 position with null as first value and value as second value
                                That.Results.splice(index, 0, null);
                                That.Results[index++][joinTable] = null;
                                That.Results[index++][query.Table] = value;
                            }
                                break;
                        };
                    }

                    for (Column in this.Query.Where) {
                        if (Array.isArray(this.Query.Where[Column])) {
                            ConditionLength = this.Query.Where[Column].length;
                            for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                var ExecutionStatus = executeInnerWhereLogic(Column, this.Query.Where[Column][i])
                                if (ExecutionStatus == false) {
                                    break;
                                }
                            }

                        }
                        else {
                            executeInnerWhereLogic(Column, this.Query.Where[Column]);
                        }
                        break;
                    }

                }

                /**
                 * For matching the different column value existance
                 * 
                 * @private
                 * @param {any} where 
                 * @param {any} value 
                 * @returns 
                 * 
                 * @memberOf SelectLogic
                 */
                private checkForWhereConditionMatch(where, value) {
                    var TempColumn;
                    for (TempColumn in where) {
                        if (Array.isArray(where[TempColumn])) {
                            var i, Status = true;
                            for (i = 0; i < TempColumn.length; i++) {
                                if (where[TempColumn][i] == value[TempColumn]) {
                                    Status = true;
                                    break;
                                }
                                else {
                                    Status = false;
                                }
                            };
                            if (!Status) {
                                return Status;
                            }
                        }
                        else {
                            if (where[TempColumn] != value[TempColumn]) {
                                return false;
                            }
                        }
                    }
                    return true;
                }


                private executeWhereUndefinedLogic = function () {
                    var That: SelectLogic = this,
                        CursorOpenRequest = this.ObjectStore.openCursor();

                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            That.Results.push(Cursor.value);
                            (Cursor as any).continue();
                        }
                        else {
                            That.onSuccessRequest();
                        }
                    }
                    CursorOpenRequest.onerror = That.onErrorRequest;
                }

                constructor(query: ISelectJoin, onSuccess: Function, onError: Function) {
                    super();
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this,
                        TableList = []; // used to open the multiple object store
                    //this.Transaction = DbConnection.transaction([query.From], "readonly");
                    //this.ObjectStore = this.Transaction.objectStore(query.From);

                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = (<IJoin>query).Join == undefined ? 'inner' : (<IJoin>query).Join.toLowerCase();
                            That.QueryStack.push(query.Table2); TableList.push(query.Table2.Table);
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
                    console.log(TableList);
                    //var i = QueryStack.length - 1;
                    // while (i >= 0) {
                    //     this.doJoinLogic(QueryStack.pop(), QueryStack.pop());
                    //     i -= 2;
                    // }


                    this.Transaction = DbConnection.transaction(TableList, "readonly");
                    for (var i = 1; i < this.QueryStack.length; i++) {
                        this.IndexRequest[i - 1] = this.Transaction.objectStore(this.QueryStack[i].Table).index(this.QueryStack[i].Column);

                    }
                    this.Query = this.QueryStack[this.QueryStack.length - 1];
                    this.ObjectStore = this.Transaction.objectStore(this.QueryStack[this.QueryStack.length - 1].Table);
                    //var CursorOpenRequest = Transaction.
                    console.log(this.QueryStack);

                }

                private doJoinLogic(join1: ITableJoin, join2: ITableJoin) {
                    var That = this,
                        Transaction = DbConnection.transaction([join1.Table, join2.Table], "readonly"),
                        CursorOpenRequest1 = Transaction.objectStore(join1.Table).index(join1.Column).openCursor(),
                        CursorOpenRequest2 = Transaction.objectStore(join2.Table).index(join2.Column).openCursor(),
                        onErrorCursorRequest = function (e) {
                            ++That.ErrorCount;
                            That.onErrorRequest(e);
                        }
                    CursorOpenRequest1.onerror = onErrorCursorRequest;
                    CursorOpenRequest2.onerror = onErrorCursorRequest;
                    CursorOpenRequest1.onsuccess = function (e) {

                    }
                    CursorOpenRequest2.onsuccess = function (e) {

                    }

                }
            }
        }
    }
}