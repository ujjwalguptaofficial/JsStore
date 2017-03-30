module JsStorage {
    export module Business {
        export module IndexDb {
            export class BaseSelectLogic extends DbHelperLogic {
               
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Transaction: IDBTransaction;
                ObjectStore: IDBObjectStore;
                SendResultFlag: Boolean = true;

                public onSuccessRequest = function () {
                    if (this.SendResultFlag && this.OnSuccess != null) {
                        this.OnSuccess(this.Results);
                    }
                }

                public onErrorRequest = function (e) {
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

                protected executeMultipleWhereInLogic = function (whereInArray: Array<IWhereIn>) {
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

                protected executeSingleWhereInLogic = function (whereIn: IWhereIn) {
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
            }
        }
    }
}