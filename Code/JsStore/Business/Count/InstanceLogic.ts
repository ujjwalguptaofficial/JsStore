namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Instance extends Where {

                constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
                    super();
                    this._onError = onError;
                    this._onSuccess = onSuccess;
                    this._query = query;
                }

                execute() {
                    if (this.isTableExist(this._query.From)) {
                        try {
                            if (this._query.Where !== undefined) {
                                if (this._query.Where.Or || Array.isArray(this._query.Where)) {
                                    var select_object = new Select.Instance(this._query as any,
                                        function (results) {
                                            this._resultCount = results.length;
                                            this.onTransactionCompleted();
                                        }.bind(this), this._onError);
                                    select_object.execute();
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
                            this.onExceptionOccured(ex, { TableName: this._query.From });
                        }
                    }
                    else {
                        this._errorOccured = true;
                        this.onErrorOccured(
                            new Error(Error_Type.TableNotExist, { TableName: this._query.From }).get(),
                            true
                        );
                    }
                }

                private initTransaction() {
                    createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
                    this._objectStore = db_transaction.objectStore(this._query.From);
                }

                private onQueryFinished = function () {
                    if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                };

                private onTransactionCompleted() {
                    this._onSuccess(this._resultCount);
                }
            }
        }

    }
}
