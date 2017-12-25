namespace JsStore {
    export namespace Business {
        export class BulkInsert extends Base {
            ValuesAffected = [];
            Query: IInsert;
            ValuesIndex = 0;
            Table: Model.Table;

            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                try {
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
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
                this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
            }

            private bulkinsertData = function () {
                var That = this;
                this.Transaction = db_connection.transaction([this.Query.Into], "readwrite");
                this.ObjectStore = this.Transaction.objectStore(this.Query.Into);
                this.Transaction.oncomplete = function (e) {
                    That.OnSuccess();
                }
                this.Query.Values.forEach(function (value) {
                    That.ObjectStore.add(value);
                });
            }


        }
    }
}
