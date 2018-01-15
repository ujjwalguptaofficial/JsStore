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
                            if (query.Where !== undefined) {
                                if (query.Where.Or || Array.isArray(query.Where)) {
                                    var select_object = new Select.Instance(query as any,
                                        function (results) {
                                            this._resultCount = results.length;
                                            this.onTransactionCompleted();
                                        }.bind(this), this._onError);
                                }
                                else {
                                    this.initTransaction();
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                this.initTransaction();
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

                private initTransaction = function () {
                    createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                    this._objectStore = db_transaction.objectStore(this._query.From);
                };

                private onTransactionCompleted = function () {
                    this._onSuccess(this._resultCount);
                };
            }
        }

    }
}
