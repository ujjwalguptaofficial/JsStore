namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Instance extends Where {
                constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
                    super();
                    this._onError = onError;
                    if (this.getTable(query.From)) {
                        this._onSuccess = onSuccess;
                        this._query = query;
                        try {
                            var createTransaction = function () {
                                this._transaction = db_connection.transaction([query.From], "readonly");
                                this._objectStore = this._transaction.objectStore(query.From);
                                this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                                this._transaction.ontimeout = this.onTransactionTimeout.bind(this);
                            };
                            if (query.Where !== undefined) {
                                if (query.Where.Or || Array.isArray(query.Where)) {
                                    var select_object = new Select.Instance(query as any,
                                        function (results) {
                                            this._resultCount = results.length;
                                            this.onTransactionCompleted();
                                        }.bind(this), this._onError);
                                }
                                else {
                                    createTransaction.call(this);
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                createTransaction.call(this);
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: query.From });
                        }
                    }
                    else {
                        this._errorOccured = true;
                        this.onErrorOccured(
                            new Error(Error_Type.TableNotExist, { TableName: query.From }).get(),
                            true
                        );
                    }
                }

                private onTransactionCompleted = function () {
                    this._onSuccess(this._resultCount);
                };
            }
        }

    }
}
