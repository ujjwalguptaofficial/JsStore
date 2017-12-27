namespace KeyStore {
    export namespace Business {
        export class Set extends Base {

            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                try {
                    this._onError = onError;
                    this._transaction = db_connection.transaction([query.TableName], "readwrite");
                    this._objectStore = this._transaction.objectStore(query.TableName);
                    this._transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    this.setData(query.Set);
                }
                catch (ex) {
                    console.error(ex);
                }
            }

            private setData = function (value) {
                var updateIfExistElseInsert = function () {
                    var cursor_request = this._objectStore.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                    cursor_request.onsuccess = function (e) {
                        var cursor: IDBCursorWithValue = e.target.result;
                        if (cursor) {
                            cursor.value['Value'] = value['Value'];
                            cursor.update(cursor.value);
                        }
                        else {
                            insertData();
                        }
                    }.bind(this);

                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.on_errorOccured(e);
                    }.bind(this);

                }.bind(this),
                    insertData = function () {
                        var add_result = this._objectStore.add(value);
                        add_result.onerror = function (e) {
                            this._errorOccured = true;
                            this.on_errorOccured(e);
                        }.bind(this);
                    }.bind(this);
                updateIfExistElseInsert();
            };
        }
    }
}
