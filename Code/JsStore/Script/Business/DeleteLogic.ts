module JsStore {
    export module Business {
        export class Delete extends Base {
            Query: IDelete;
            private executeWhereUndefinedLogic = function () {
                var That: Delete = this,
                    CursorOpenRequest = this.ObjectStore.openCursor();
                CursorOpenRequest.onsuccess = function (e) {
                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                    if (Cursor) {
                        Cursor.delete();
                        ++That.RowAffected;
                        (Cursor as any).continue();
                    }
                }
                CursorOpenRequest.onerror = function (e) {
                    That.onErrorOccured(e);
                }
            }

            private executeWhereDefinedLogic = function () {
                var That = this,
                    executeInnerDeleteLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                    Cursor.delete();
                                    ++That.RowAffected;
                                }
                                Cursor.continue();
                            }

                        }
                    };

                for (var Column in this.Query.Where) {
                    if (!That.ErrorOccured) {
                        if (That.ObjectStore.indexNames.contains(Column)) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    executeInnerDeleteLogic(Column, this.Query.Where[Column][i])
                                }
                            }
                            else {
                                executeInnerDeleteLogic(Column, this.Query.Where[Column]);
                            }
                        }
                        else {
                            That.ErrorOccured = true;
                            That.Error = Utils.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorOccured(That.Error, true);
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }
            }

            constructor(query: IDelete, onSuccess: Function, onError: Function) {
                super();
                try {
                    var That = this;
                    this.Query = query;
                    this.Transaction = DbConnection.transaction([query.From], "readwrite");
                    this.ObjectStore = this.Transaction.objectStore(query.From);
                    this.Transaction.oncomplete = function () {
                        if (onSuccess != null) {
                            onSuccess(That.RowAffected);
                        }
                    }
                    this.Transaction.onerror = function (e) {
                        That.onErrorOccured(e);
                    }

                    if (query.Where == undefined) {
                        this.executeWhereUndefinedLogic();
                    }
                    else {
                        this.executeWhereDefinedLogic();
                    }

                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.From });
                }
            }
        }
    }
}

