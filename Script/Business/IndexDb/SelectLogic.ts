module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectLogic {
                Query: ISelect;
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Results = [];
                Transaction: IDBTransaction;
                ObjectStore: IDBObjectStore;
                SendResultFlag: Boolean = true;

                private onSuccessRequest = function () {
                    if (this.SendResultFlag && this.OnSuccess != null) {
                        this.OnSuccess(this.Results);
                    }
                }

                private onErrorRequest = function (e) {
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError((e as any).target.error);
                        }
                    }
                }

                private getKeyRange = function (whereIn: IWhereIn) {
                    var KeyRange: IDBKeyRange;
                    switch (this.Query.WhereIn.Op) {
                        case '-': KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End); break;
                        case '>': KeyRange = IDBKeyRange.lowerBound(whereIn.Value, true); break;
                        case '>=': KeyRange = IDBKeyRange.lowerBound(whereIn.Value); break;
                        case '<': KeyRange = IDBKeyRange.upperBound(whereIn.Value, true); break;
                        case '<=': KeyRange = IDBKeyRange.upperBound(whereIn.Value); break;
                        default: this.ErrorOccured = true; UtilityLogic.getError(ErrorType.InvalidOp, true, { Op: whereIn.Op });
                    }
                    return KeyRange;

                }

                private executeMultipleWhereInLogic = function (whereInArray: Array<IWhereIn>) {
                    var That = this,
                        WhereIn,
                        ExecutionNo = 0,
                        ConditionLength = Object.keys(this.Query.WhereIn).length,
                        KeyRange: IDBKeyRange,
                        OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                this.OnSuceessRequest();
                            }
                        };

                    for (WhereIn in whereInArray) {
                        KeyRange = this.getKeyRange();
                        if (!this.ErrorOccured) {
                            var CursorOpenRequest,
                                OnCursorSuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                },
                                OnCursorError = function (e) {
                                    That.ErrorOccured = true; ++That.ErrorCount;
                                    That.OnErrorRequest(e);
                                };
                            if (this.Query.WhereIn.Op == '-') {
                                CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else if (this.ObjectStore.indexNames.contains(WhereIn.Column)) {
                                CursorOpenRequest = this.ObjectStore.index(WhereIn.Column).openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else {
                                UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            }
                        }
                        else {
                            return;
                        }
                    }
                }

                private executeSingleWhereInLogic = function (whereIn: IWhereIn) {
                    var That: SelectLogic = this,
                        KeyRange: IDBKeyRange = this.getKeyRange(whereIn);

                    if (!this.ErrorOccured) {
                        var CursorOpenRequest,
                            OnCursorSuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                                else {
                                    That.onSuccessRequest();
                                }
                            },
                            OnCursorError = function (e) {
                                this.ErrorOccured = true; ++this.ErrorCount;
                                this.OnErrorRequest(e);
                            };
                        if (whereIn.Op == '-') {
                            CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = OnCursorSuccess;
                            CursorOpenRequest.onerror = OnCursorError;
                        }
                        else if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                            CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = OnCursorSuccess;
                            CursorOpenRequest.onerror = OnCursorError;
                        }
                        else {
                            UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                        }
                    }
                }

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

                constructor(query: ISelect, onSuccess: Function, onError: Function) {
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