module JsStore {
    export module Business {
        export module Count {
            export class Instance extends Where {

                public onTransactionCompleted = function () {
                    if (this.SendResultFlag && this.OnSuccess != null) {
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
                        this.Transaction = DbConnection.transaction([query.From], "readonly");
                        this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        }
                        this.ObjectStore = this.Transaction.objectStore(query.From);
                        if (query.Where != undefined) {
                            this.executeWhereLogic();
                        }
                        else {
                            this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            Utils.getError(ErrorType.TableNotExist, true, { TableName: query.From });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }

            }
        }

    }
}
