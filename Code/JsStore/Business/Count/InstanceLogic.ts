namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Instance extends Where {
                constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
                    super();
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    try {
                        var createTransaction = function () {
                            this.Transaction = db_connection.transaction([query.From], "readonly");
                            this.ObjectStore = this.Transaction.objectStore(query.From);
                            this.Transaction.oncomplete = function (e) {
                                this.onTransactionCompleted();
                            };
                            this.Transaction.ontimeout = this.onTransactionTimeout;
                        };
                        if (query.Where !== undefined) {
                            if (query.Where.Or) {
                                var select_object = new Select.Instance(query as any, function (results) {
                                    this.ResultCount = results.length;
                                    this.onTransactionCompleted();
                                }, this.OnError);
                            }
                            else {
                                createTransaction.call(this);
                                this.goToWhereLogic();
                            }
                        }
                        else {
                            createTransaction();
                            this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From })
                    }
                }

                public onTransactionCompleted = function () {
                    if (this.SendResultFlag) {
                        this.OnSuccess(this.ResultCount);
                    }
                }
            }
        }

    }
}
