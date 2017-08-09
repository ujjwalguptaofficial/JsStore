module JsStore {
    export module Business {
        export class Count extends BaseCount {

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
                    That: Count = this;

                var executeInnerWhereLogic = function (column, value) {

                    if (That.ObjectStore.indexNames.contains(column)) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }

                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                    ++That.ResultCount;
                                }
                                Cursor.continue();
                            }
                        }

                    }
                    else {
                        Utils.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                        return false;
                    }

                }

                for (Column in this.Query.Where) {
                    if (Array.isArray(this.Query.Where[Column])) {
                        for (var i = 0, length = this.Query.Where[Column].length; i < length; i++) {
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
                var That: Count = this;
                if (this.ObjectStore.count) {
                    var CountRequest = this.ObjectStore.count();
                    CountRequest.onsuccess = function () {
                        That.ResultCount += CountRequest.result;
                    }
                }
                else {
                    var CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            ++That.ResultCount;
                            (Cursor as any).continue();
                        }

                    }
                    CursorOpenRequest.onerror = function (e) {
                        That.onErrorOccured(e);
                    }
                }
            }

            constructor(query: ICount, onSuccess: Function, onError: Function) {
                super();
                var That = this;
                this.Query = query;
                this.OnSuccess = onSuccess;
                this.OnError = onError;
                try {
                    this.Transaction = DbConnection.transaction([query.From], "readonly");
                    this.Transaction.oncomplete = function (e) {
                        if (That.SendResultFlag && onSuccess != null) {
                            onSuccess(That.ResultCount);
                        }
                    }
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
                        Utils.getError(ErrorType.TableNotExist, true, { TableName: query.From });
                    }
                    else {
                        console.warn(ex);
                    }
                }
            }

        }
    }

}
