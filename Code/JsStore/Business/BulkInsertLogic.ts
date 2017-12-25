namespace JsStore {
    export namespace Business {
        export class BulkInsert extends Base {
            ValuesAffected = [];
            _query: IInsert;
            ValuesIndex = 0;
            Table: Model.Table;

            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                try {
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    var That = this;
                    this.Table = this.getTable(query.Into);
                    if (this.Table) {
                        this.bulkinsertData();
                    }
                    else {
                        var Error = Utils.getError(ErrorType.TableNotExist, { TableName: query.Into })
                        throwError(Error);
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }

            public onTransactionCompleted = function () {
                this._onSuccess(this._query.Return ? this.ValuesAffected : this._rowAffected);
            }

            private bulkinsertData = function () {
                var That = this;
                this._transaction = db_connection.transaction([this._query.Into], "readwrite");
                this._objectStore = this._transaction.objectStore(this._query.Into);
                this._transaction.oncomplete = function (e) {
                    That._onSuccess();
                }
                this._query.Values.forEach(function (value) {
                    That._objectStore.add(value);
                });
            }
        }
    }
}
