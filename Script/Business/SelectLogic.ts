module JsStore {
    export module Business {
        export class SelectLogic extends SelectHelperLogic {
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
                    ConditionLength = 0,
                    OnSuccessGetRequest = function () {
                        --ConditionLength;
                        // if (ConditionLength == 0)
                        //     That.onSuccessRequest();
                    };

                var executeInnerWhereLogic = function (column, value) {

                    if (That.ObjectStore.indexNames.contains(column)) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
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
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
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
                        return false;
                    }

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

            private executeWhereUndefinedLogic = function () {
                var That: SelectLogic = this,
                    CursorOpenRequest = this.ObjectStore.openCursor();

                CursorOpenRequest.onsuccess = function (e) {
                    var Cursor = (<any>e).target.result;
                    if (Cursor) {
                        That.Results.push(Cursor.value);
                        (Cursor as any).continue();
                    }

                }
                CursorOpenRequest.onerror = That.onErrorRequest;
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
                        if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    }
                    // (<any>(this.Transaction)).ontimeout = function () {
                    //     console.log('transaction timed out');
                    // }
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
                catch (ex) {
                    if (ex.name == "NotFoundError") {
                        UtilityLogic.getError(ErrorType.TableNotExist, true, { TableName: query.From });
                    }
                    else {
                        console.warn(ex);
                    }
                }
            }

        }
    }

}
