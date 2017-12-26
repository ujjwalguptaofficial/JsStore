namespace JsStore {
    export namespace Business {
        export class BulkInsert extends Base {
            _query: IInsert;
            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                try {
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    if (this.getTable(query.Into)) {
                        this.bulkinsertData();
                    }
                    else {
                        var error = new Error(Error_Type.TableNotExist, { TableName: query.Into });
                        error.throw();
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }

            private bulkinsertData = function () {
                this._transaction = db_connection.transaction([this._query.Into], "readwrite");
                this._objectStore = this._transaction.objectStore(this._query.Into);
                this._transaction.oncomplete = function (e) {
                    this._onSuccess();
                }.bind(this);
                this._query.Values.forEach(function (value) {
                    this._objectStore.add(value);
                }, this);
            };
        }
    }
}
