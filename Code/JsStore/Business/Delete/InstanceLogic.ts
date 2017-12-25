namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Instance extends Where {

                constructor(
                    query: IDelete, onSuccess: (recordDeleted: number) => void,
                    onError: (err: IError) => void
                ) {
                    super();
                    try {
                        var That = this;
                        this._query = query;
                        this._onSuccess = onSuccess;
                        this._onError = onError;
                        this._transaction = db_connection.transaction([query.From], "readwrite");
                        this._objectStore = this._transaction.objectStore(query.From);
                        this._transaction.oncomplete = function () {
                            That.onTransactionCompleted();
                        };
                        this._transaction.onerror = function (e) {
                            That.onErrorOccured(e);
                        };

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

                private onTransactionCompleted = function () {
                    this._onSuccess(this._rowAffected);
                };

                private createtransactionForOrLogic = function (query) {
                    var That = this;
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readwrite");
                        this._transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        (this._transaction).ontimeout = That.onTransactionCompleted;
                        this._objectStore = this._transaction.objectStore(query.From);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                };

                private executeOrLogic = function () {
                    (this as any).OrInfo = {
                        OrQuery: this._query.Where.Or,
                        OnSucess: this._onSuccess
                    };
                    (this as any).TmpQry = <ISelect>{
                        From: this._query.From,
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
                            (this as any).OrInfo.OnSucess(this._rowAffected);
                        }
                    };
                    // free or memory
                    this._query.Where.Or = undefined;
                    this._onSuccess = onSuccess;
                };
            }
        }
    }

}