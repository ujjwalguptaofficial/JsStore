module JsStore {
    export module Business {
        export class SelectLogic extends SelectHelperLogic {
            private executeWhereInLogic = function () {
                if (Array.isArray(this.Query.WhereIn)) {
                    if (this.Query.WhereIn.length > 0) {
                        this.executeMultipleWhereInLogic(this.Query.WhereIn);
                    }
                    else {
                        this.executeWhereUndefinedLogic();
                    }
                }
                else {
                    this.executeSingleWhereInLogic(this.Query.WhereIn);
                }
            }

            private executeWhereLogic = function () {
                var Column,
                    SkipRecord = this.Query.Skip,
                    LimitRecord = this.Query.Limit,
                    That: SelectLogic = this;

                var executeInnerWhereLogic = function (column, value) {

                    if (That.ObjectStore.indexNames.contains(column)) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
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
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(SkipRecord - 1);
                                    }
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
                            }
                        }
                        else if (LimitRecord) {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor && That.Results.length != LimitRecord) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            }
                        }
                        else {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            }
                        }
                    }
                    else {
                        UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                        return false;
                    }

                }

                for (Column in this.Query.Where) {
                    if (Array.isArray(this.Query.Where[Column])) {
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

            private executeWhereUndefinedLogic = function () {
                var That: SelectLogic = this,
                    CursorOpenRequest;
                if (this.Query.Order && this.Query.Order.By) {
                    // this.Query.Order.Type = this.Query.Order.Type ? this.Query.Order.Type.toLowerCase() : 'asc';
                    var Order = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                    this.Sorted = true;
                    CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, Order);
                }
                else {
                    CursorOpenRequest = this.ObjectStore.openCursor();
                }
                CursorOpenRequest.onsuccess = function (e) {
                    var Cursor = (<any>e).target.result;
                    if (Cursor) {
                        That.Results.push(Cursor.value);
                        (Cursor as any).continue();
                    }

                }
                CursorOpenRequest.onerror = function (e) {
                    That.onErrorOccured(e);
                }
            }

            constructor(query: ISelect, onSuccess: Function, onError: Function) {
                super();
                var That = this;
                this.Query = query;
                this.OnSuccess = onSuccess;
                this.OnError = onError;
                try {
                    this.Transaction = DbConnection.transaction([query.From], "readonly");
                    this.Transaction.oncomplete = function (e) {
                        if (query.Order && query.Order.By && !That.Sorted) {
                            query.Order.Type = query.Order.Type ? query.Order.Type.toLowerCase() : 'asc';
                            var OrderColumn = query.Order.By,
                                sortNumberInAsc = function () {
                                    That.Results.sort(function (a, b) {
                                        return a[OrderColumn] - b[OrderColumn];
                                    });
                                },
                                sortNumberInDesc = function () {
                                    That.Results.sort(function (a, b) {
                                        return b[OrderColumn] - a[OrderColumn];
                                    });
                                },
                                sortAlphabetInAsc = function () {
                                    That.Results.sort(function (a, b) {
                                        return a[OrderColumn].toLowerCase().localeCompare(b[OrderColumn].toLowerCase());
                                    });
                                },
                                sortAlphabetInDesc = function () {
                                    That.Results.sort(function (a, b) {
                                        return b[OrderColumn].toLowerCase().localeCompare(a[OrderColumn].toLowerCase());
                                    });
                                };
                            if (typeof That.Results[0][OrderColumn] == 'string') {
                                if (query.Order.Type == 'asc') {
                                    sortAlphabetInAsc();
                                }
                                else {
                                    sortAlphabetInDesc();
                                }
                            }
                            else if (typeof That.Results[0][OrderColumn] == 'number') {
                                if (query.Order.Type == 'asc') {
                                    sortNumberInAsc();
                                }
                                else {
                                    sortNumberInDesc();
                                }
                            }
                            onSuccess(That.Results);

                        }
                        else if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    };
                    (<any>this.Transaction).ontimeout = function () {
                        console.log('transaction timed out');
                    }
                    this.ObjectStore = this.Transaction.objectStore(query.From);
                    if (query.WhereIn != undefined) {
                        this.executeWhereInLogic();
                    }
                    else if (query.Where != undefined) {
                        this.executeWhereLogic();
                    }
                    else {
                        this.executeWhereUndefinedLogic();
                    }
                }
                catch (ex) {
                    if (ex.name == "NotFoundError") {
                        UtilityLogic.getError(ErrorType.TableNotExist, true, { TableName: query.From });
                    }
                    else {
                        console.error(ex);
                    }
                }
            }

        }
    }

}
