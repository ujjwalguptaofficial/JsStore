module JsStore {
    export module Business {
        export module Delete {
            export class Instance extends Where {

                private onTransactionCompleted = function () {
                    if (this.OnSuccess != null) {
                        this.OnSuccess(this.RowAffected);
                    }
                }

                constructor(query: IDelete, onSuccess: Function, onError: Function) {
                    super();
                    try {
                        var That = this;
                        this.Query = query;
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        this.Transaction = DbConnection.transaction([query.From], "readwrite");
                        this.ObjectStore = this.Transaction.objectStore(query.From);
                        this.Transaction.oncomplete = function () {
                            That.onTransactionCompleted();
                        }
                        this.Transaction.onerror = function (e) {
                            That.onErrorOccured(e);
                        }

                        if (query.Where == undefined) {
                            this.executeWhereUndefinedLogic();
                        }
                        else {
                            this.goToWhereLogic();
                        }

                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                }
            }
        }
    }

}