module JsStore {
    export module Business {
        export class Select extends SelectHelper {
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
                    That: Select = this,
                    executeInnerWhereLogic = function (column, value) {
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

                for (Column in this.Query.Where) {
                    if (!this.ErrorOccured) {
                        if (this.ObjectStore.indexNames.contains(Column)) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    executeInnerWhereLogic(Column, this.Query.Where[Column][i])
                                }
                            }
                            else {
                                executeInnerWhereLogic(Column, this.Query.Where[Column]);
                            }
                        }
                        else {
                            That.ErrorOccured = true;
                            That.Error = Utils.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorOccured(That.Error, true);
                        }
                        break;

                    }
                    else {
                        return;
                    }
                }
            }

            private executeWhereUndefinedLogic = function () {
                var That: Select = this,
                    CursorOpenRequest;
                if (this.Query.Order && this.Query.Order.By) {
                    if (That.ObjectStore.indexNames.contains(this.Query.Order.By)) {
                        var OrderType = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                        this.Sorted = true;
                        CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, OrderType);
                    }
                    else {
                        Utils.getError(ErrorType.ColumnNotExist, true, { ColumnName: this.Query.Order.By });
                        return false;
                    }
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
                        if (That.Results.length > 0 && !That.Sorted && query.Order && query.Order.By) {
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
                            if (That.OnSuccess) {
                                That.OnSuccess(That.Results);
                            }

                        }
                        else if (That.SendResultFlag) {
                            if (That.OnSuccess) {
                                That.OnSuccess(That.Results);
                            }
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
                    this.onExceptionOccured(ex, { TableName: query.From });
                }
            }

        }
    }

}
