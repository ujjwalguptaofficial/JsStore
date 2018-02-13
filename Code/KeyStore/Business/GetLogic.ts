namespace KeyStore {
    export namespace Business {
        export class Get extends Base {
            _query: ISelect;
            constructor(query: ISelect, onSuccess: (result) => void, onError: (err: IError) => void) {
                super();
                this._query = query;
                this._onSuccess = onSuccess;
                this._onError = onError;
            }

            public execute() {
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
                this.initTransaction();
                for (var prop in this._query.Where) {
                    getData(prop, this._query.Where[prop]);
                    break;
                }
            }

            private initTransaction() {
                createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                this._objectStore = db_transaction.objectStore(this._query.From);
            }

            private onTransactionCompleted() {
                if (this._errorOccured === false) {
                    this._onSuccess(this._results);
                }
            }
        }
    }
}
