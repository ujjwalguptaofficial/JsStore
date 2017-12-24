namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Instance extends Where {

                private onTransactionCompleted = function () {
                    this.OnSuccess(this.RowAffected);
                }

                private createtransactionForOrLogic = function (query) {
                    var That = this;
                    this.Query = query;
                    try {
                        this.Transaction = db_connection.transaction([query.From], "readwrite");
                        this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        (<any>this.Transaction).ontimeout = That.onTransactionCompleted;
                        this.ObjectStore = this.Transaction.objectStore(query.From);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                }

                private executeOrLogic = function () {
                    (this as any).OrInfo = {
                        OrQuery: this.Query.Where.Or,
                        OnSucess: this.OnSuccess
                    };
                    (this as any).TmpQry = <ISelect>{
                        From: this.Query.From,
                        Where: {}
                    };
                    var onSuccess = function () {
                        var Key = getObjectFirstKey((this as any).OrInfo.OrQuery);
                        if (Key != null) {
                            (this as any).TmpQry['Where'][Key] = (this as any).OrInfo.OrQuery[Key];
                            delete (this as any).OrInfo.OrQuery[Key];
                            this.createtransactionForOrLogic((this as any).TmpQry);
                        }
                        else {
                            (this as any).OrInfo.OnSucess(this.RowAffected);
                        }
                    }
                    //free or memory
                    this.Query.Where.Or = undefined;
                    this.OnSuccess = onSuccess;
                }

                constructor(query: IDelete, onSuccess: Function, onError: Function) {
                    super();
                    try {
                        var That = this;
                        this.Query = query;
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        this.Transaction = db_connection.transaction([query.From], "readwrite");
                        this.ObjectStore = this.Transaction.objectStore(query.From);
                        this.Transaction.oncomplete = function () {
                            That.onTransactionCompleted();
                        }
                        this.Transaction.onerror = function (e) {
                            That.onErrorOccured(e);
                        }

                        if (query.Where) {
                            if (query.Where.Or) {
                                this.executeOrLogic();
                            }
                            this.goToWhereLogic();
                        }
                        else {
                            this.executeWhereUndefinedLogic();
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