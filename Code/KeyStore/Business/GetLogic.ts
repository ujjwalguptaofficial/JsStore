module KeyStore {
    export module Business {
        export class Get extends Base {
            Query: ISelect;

            private get = function () {
                var That: Get = this,
                    getData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        }
                    }

                for (var column in this.Query.Where) {
                    getData(column, this.Query.Where[column]);
                    break;
                }

            }

            constructor(query: ISelect, onSuccess: Function, onError: Function) {
                super();
                var That = this;
                this.Query = query;
                this.OnError = onError;
                this.Transaction = DbConnection.transaction([query.From], "readonly");
                this.ObjectStore = this.Transaction.objectStore(query.From);
                this.Transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(That.Results);
                    }
                }
                this.get();

            }

        }
    }
}
