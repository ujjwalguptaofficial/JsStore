module JsStorage {
    export module Business {
        export module IndexDb {
            export class UpdateLogic {
                constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                    try {
                        var That = this,
                            ErrorOccured: boolean = false,
                            ErrorCount = 0,
                            RowAffected = 0,
                            Transaction: IDBTransaction = DbConnection.transaction([query.In], "readwrite"),
                            ObjectStore: IDBObjectStore = Transaction.objectStore(query.In),
                            onErrorGetRequest = function (e) {
                                if (ErrorCount == 1) {
                                    if (onError != null) {
                                        onError((e as any).target.error);
                                    }
                                }
                            };
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(RowAffected);
                            }
                        },
                            (<any>Transaction).ontimeout = function () {
                                console.log('transaction timed out');
                            }
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


                            }
                            CursorOpenRequest.onerror = onErrorGetRequest;
                        }
                        else {
                           
                            for (var TmpColumn in query.Where) {
                                if (!ErrorOccured) {
                                    if (ObjectStore.indexNames.contains(TmpColumn)) {
                                        var CursorOpenRequest = ObjectStore.index(TmpColumn).openCursor(IDBKeyRange.only(query.Where[TmpColumn]));
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
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            console.error('The tablename does not exist');
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }

            }
        }

    }
}