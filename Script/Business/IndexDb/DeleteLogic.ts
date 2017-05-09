module JsStorage {
    export module Business {
        export module IndexDb {
            export class DeleteLogic {
                constructor(query: IDelete, onSuccess: Function, onError: Function) {
                    var That = this,
                        Transaction: IDBTransaction = DbConnection.transaction([query.From], "readwrite"),
                        ObjectStore: IDBObjectStore = Transaction.objectStore(query.From),
                        ErrorOccured: boolean = false,
                        ErrorCount = 0,
                        RowAffected = 0,
                        onErrorGetRequest = function (e) {
                            if (onError != null) {
                                onError((e as any).target.error);
                            }
                        };

                    Transaction.oncomplete = function () {
                        if (onSuccess != null) {
                            onSuccess(RowAffected);
                        }
                    }

                    Transaction.onerror = onErrorGetRequest;

                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++RowAffected;
                                (Cursor as any).continue();
                            }
                        }
                        CursorOpenRequest.onerror = onErrorGetRequest;
                    }
                    else {
                        var Column,
                            ExecutionNo = 0,
                            ConditionLength = Object.keys(query.Where).length;
                        for (Column in query.Where) {
                            if (!ErrorOccured) {
                                if (ObjectStore.indexNames.contains(Column)) {
                                    var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])),
                                        ExecutionNo = 0;

                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;

                                        if (Cursor) {
                                            Cursor.delete();
                                            ++RowAffected;
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


                }
            }
        }

    }
}