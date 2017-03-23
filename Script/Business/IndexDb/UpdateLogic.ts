module JsStorage {
    export module Business {
        export module IndexDb {
            export class UpdateLogic {
                constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                    var That = this,
                        ErrorOccured: boolean = false,
                        ErrorCount = 0,
                        RowAffected = 0,
                        Transaction: IDBTransaction = DbConnection.transaction([query.In], "readwrite"),
                        ObjectStore: IDBObjectStore = Transaction.objectStore(query.In),
                        onSuceessRequest = function (rowsAffected) {
                            if (onSuccess != null) {
                                onSuccess(rowsAffected);
                            }
                        },

                        onErrorGetRequest = function (e) {
                            if (ErrorCount == 1) {
                                if (onError != null) {
                                    onError((e as any).target.error);
                                }
                            }
                        };
                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                for (var key in query.Set) {
                                    Cursor.value[key] = query.Set[key];
                                }
                                Cursor.update(Cursor.value);
                                ++RowAffected;
                                (Cursor as any).continue();
                            }
                            else {
                                onSuceessRequest(RowAffected);
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
                                    var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            for (var key in query.Set) {
                                                Cursor.value[key] = query.Set[key];
                                            }
                                            Cursor.update(Cursor.value);
                                            ++RowAffected;
                                            Cursor.continue();
                                        }
                                        else {
                                            ++ExecutionNo;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                    }


                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorGetRequest(e);
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