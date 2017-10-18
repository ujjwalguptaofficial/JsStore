module JsStore {
    export module Business {
        export module Count {
            export class Instance extends Where {

                public onTransactionCompleted = function () {
                    if (this.SendResultFlag) {
                        this.OnSuccess(this.ResultCount);
                    }
                }

                constructor(query: ICount, onSuccess: Function, onError: Function) {
                    super();
                    var That = this;
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    try {
                        var createTransaction = function () {
                            That.Transaction = DbConnection.transaction([query.From], "readonly");
                            That.ObjectStore = That.Transaction.objectStore(query.From);
                            That.Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted();
                            };
                            (<any>That.Transaction).ontimeout = That.onTransactionTimeout;
                        }
                        if (query.Where != undefined) {
                            if (query.Where.Or) {
                                new Select.Instance(query as ISelect, function (results) {
                                    That.ResultCount = results.length;
                                    That.onTransactionCompleted()
                                }, this.OnError);
                            }
                            else {
                                createTransaction();
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

            }
        }

    }
}
