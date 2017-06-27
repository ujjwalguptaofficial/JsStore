module JsStore {
    export module KeyStores {
        export module Business {
            export class RemoveLogic {
                constructor(query: IDelete, onSuccess: Function, onError: Function) {

                    var That = this,
                        Transaction: IDBTransaction = DbConnection.transaction([query.From], "readwrite"),
                        ObjectStore: IDBObjectStore = Transaction.objectStore(query.From),
                        ErrorOccured: boolean = false,
                        ErrorCount = 0,
                        RowAffected = 0,
                        onErrorGetRequest = function (e) {
                            ++ErrorCount;
                            if (onError != null && this.ErrorCount == 1) {
                                onError((e as any).target.error);
                            }
                            console.error(e);
                        };

                    Transaction.oncomplete = function () {
                        if (onSuccess != null) {
                            onSuccess(RowAffected);
                        }
                    }

                    Transaction.onerror = onErrorGetRequest;

                    var Column,
                        ExecutionNo = 0,
                        ConditionLength = Object.keys(query.Where).length;
                    for (Column in query.Where) {
                        if (!ErrorOccured) {
                            var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])),
                                ExecutionNo = 0;

                            CursorOpenRequest.onerror = function (e) {
                                ErrorOccured = true;
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
                            return;
                        }
                    }

                }

            }
        }
    }
}