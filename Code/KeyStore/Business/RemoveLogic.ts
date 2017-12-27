namespace KeyStore {
    export namespace Business {
        export class Remove extends Base {
            _query: IDelete;
            _rowAffected: number = 0;
            constructor(query: IDelete, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void) {
                super();
                this._query = query;
                this._onError = onError;
                this._transaction = db_connection.transaction([query.From], "readwrite");
                this._objectStore = this._transaction.objectStore(query.From);

                this._transaction.oncomplete = function () {
                    if (onSuccess != null) {
                        onSuccess(this._rowAffected);
                    }
                }.bind(this);

                this._transaction.onerror = function (e) {
                    this.on_errorOccured(e);
                }.bind(this);
                this.remove();
            }

            private remove = function () {
                var removeData = function (column, value) {
                    var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.on_errorOccured(e);
                    }.bind(this);
                    cursor_request.onsuccess = function (e) {
                        var cursor: IDBCursorWithValue = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this._rowAffected;
                            cursor.continue();
                        }
                    }.bind(this);
                }.bind(this);

                for (var prop in this._query.Where) {
                    if (!this._errorOccured) {
                        removeData(prop, this._query.Where[prop]);
                    }
                    break;
                }
            };
        }
    }
}
