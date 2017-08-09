module KeyStore {
    export module Business {
        export class Remove extends Base {
            Query: IDelete;
            RowAffected: number = 0;
            private remove = function () {
                var That = this,
                    removeData = function (column, value) {

                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
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

                for (var Column in this.Query.Where) {
                    if (!That.ErrorOccured) {
                        removeData(Column, That.Query.Where[Column]);
                    }
                    break;
                }
            }

            constructor(query: IDelete, onSuccess: Function, onError: Function) {
                super();
                var That = this;
                this.Query = query;
                this.OnError = onError;
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

                this.remove();
            }

        }
    }
}
