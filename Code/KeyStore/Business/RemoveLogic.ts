namespace KeyStore {
    export namespace Business {
        export class Remove extends Base {
            _query: IDelete;
            _rowAffected: number = 0;
            constructor(query: IDelete, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void) {
                super();
                this._query = query;
                this._onSuccess = onSuccess;
                this._onError = onError;
            }

            public execute() {
                this.initTransaction();
                var removeData = function (column, value) {
                    var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
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
            }

            private initTransaction() {
                createTransaction([this._query.From], this.onTransactionCompleted.bind(this));
                this._objectStore = db_transaction.objectStore(this._query.From);
            }

            private onTransactionCompleted() {
                if (this._errorOccured === false) {
                    this._onSuccess(this._rowAffected);
                }
            }
        }
    }
}
