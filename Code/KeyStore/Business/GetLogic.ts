namespace KeyStore {
    export namespace Business {
        export class Get extends Base {
            _query: ISelect;
            constructor(query: ISelect, onSuccess: (result) => void, onError: (err: IError) => void) {
                super();
                this._query = query;
                this._onError = onError;
                this._transaction = db_connection.transaction([query.From], "readonly");
                this._objectStore = this._transaction.objectStore(query.From);
                this._transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(this._results);
                    }
                }.bind(this);
                this.get();
            }

            private get = function () {
                var getData = function (column, value) {
                    var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.on_errorOccured(e);
                    }.bind(this);
                    cursor_request.onsuccess = function (e) {
                        var cursor: IDBCursorWithValue = e.target.result;
                        if (cursor) {
                            this._results = cursor.value['Value'];
                        }
                    }.bind(this);
                }.bind(this);

                for (var prop in this._query.Where) {
                    getData(prop, this._query.Where[prop]);
                    break;
                }

            };
        }
    }
}
