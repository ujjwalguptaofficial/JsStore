module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectJoinLogic extends BaseSelectLogic {
                ObjectStoreForJoin: IDBObjectStore;
                private executeWhereInLogic = function () {
                    if (Array.isArray(this.Query.WhereIn)) {
                        this.executeMultipleWhereInLogic(this.Query.WhereIn);
                    }
                    else {
                        this.executeSingleWhereInLogic(this.Query.WhereIn);
                    }
                }

                private executeWhereLogic = function () {
                    var Column,
                        SkipRecord = this.Query.Skip,
                        LimitRecord = this.Query.Limit,
                        That: SelectLogic = this,
                        ExecutionNo = 0,
                        ConditionLength = Object.keys(this.Query.Where).length,
                        OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                That.onSuccessRequest();
                            }
                        };
                    for (Column in this.Query.Where) {
                        if (!this.ErrorOccured) {
                            if (this.ObjectStore.keyPath != null && this.ObjectStore.keyPath == Column) {
                                var GetRequest = this.ObjectStore.get(this.Query.Where[Column]);
                                GetRequest.onerror = function (e) {
                                    That.ErrorOccured = true; ++That.ErrorCount;
                                    That.onErrorRequest(e);
                                }
                                GetRequest.onsuccess = function (e) {
                                    var Result = (<any>e).target.result
                                    if (Result) {
                                        That.Results.push();
                                    }
                                    OnSuccessGetRequest();
                                }

                            }
                            else if (this.ObjectStore.indexNames.contains(Column)) {
                                var CursorOpenRequest = this.ObjectStore.index(Column).openCursor(IDBKeyRange.only(this.Query.Where[Column]));
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true; ++this.ErrorCount;
                                    That.onErrorRequest(e);
                                }
                                if (SkipRecord && LimitRecord) {
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == SkipRecord) {
                                                if (That.Results.length != LimitRecord) {
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
                                else if (SkipRecord) { //skip exist
                                    var RecordSkipped = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            if (RecordSkipped == SkipRecord) {
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
                                else if (LimitRecord) {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor && That.Results.length != LimitRecord) {
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
                                            That.Results.push(Cursor);
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

                constructor(query: ISelect, isArray: boolean, onSuccess: Function, onError: Function) {
                    super();
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    this.Transaction = DbConnection.transaction([query.From], "readonly");
                    this.ObjectStore = this.Transaction.objectStore(query.From);

                    if (query.WhereIn != undefined) {
                        if (query.Where != undefined) {
                            this.SendResultFlag = false;
                            this.executeWhereLogic();
                        }
                        this.SendResultFlag = true;
                        this.executeWhereInLogic();

                    }
                    else if (query.Where != undefined) {
                        this.executeWhereLogic();
                    }
                    else {

                        this.executeWhereUndefinedLogic();
                    }
                }
            }
        }
    }
}