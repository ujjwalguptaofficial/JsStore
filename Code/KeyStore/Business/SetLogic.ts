namespace KeyStore {
    export namespace Business {
        export class Set extends Base {
            _query: IInsert;
            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                try {
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                }
                catch (ex) {
                    console.error(ex);
                }
            }

            public execute() {
                var updateIfExistElseInsert = function () {
                    var cursor_request = this._objectStore.index('Key').openCursor(
                        IDBKeyRange.only(this._query.Set['Key'])
                    );
                    cursor_request.onsuccess = function (e) {
                        var cursor: IDBCursorWithValue = e.target.result;
                        if (cursor) {
                            cursor.value['Value'] = this._query.Set['Value'];
                            cursor.update(cursor.value);
                        }
                        else {
                            insertData();
                        }
                    }.bind(this);

                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);

                }.bind(this),
                    insertData = function () {
                        var add_result = this._objectStore.add(this._query.Set);
                        add_result.onerror = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    }.bind(this);
                this.initTransaction();
                updateIfExistElseInsert();
            }

            private initTransaction() {
                createTransaction([this._query.TableName], this.onTransactionCompleted.bind(this));
                this._objectStore = db_transaction.objectStore(this._query.TableName);
            }

            private onTransactionCompleted() {
                if (this._errorOccured === false && this._onSuccess) {
                    this._onSuccess(null);
                }
            }
        }
    }
}
