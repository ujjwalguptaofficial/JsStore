module JsStore {
    export module Business {
        export class DeleteLogic extends BaseLogic {
            Query: IDelete;
            private executeWhereUndefinedLogic = function () {
                var That: DeleteLogic = this,
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
                var That = this;
                for (var Column in this.Query.Where) {
                    if (!That.ErrorOccured) {
                        if (That.ObjectStore.indexNames.contains(Column)) {
                            var CursorOpenRequest = That.ObjectStore.index(Column).openCursor(IDBKeyRange.only(this.Query.Where[Column]));

                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            };
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    Cursor.delete();
                                    ++That.RowAffected;
                                    Cursor.continue();
                                }

                            }
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

