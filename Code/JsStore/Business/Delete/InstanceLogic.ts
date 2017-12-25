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
                        this._query = query;
                        this._onSuccess = onSuccess;
                        this._onError = onError;
                        this._transaction = db_connection.transaction([query.From], "readwrite");
                        this._objectStore = this._transaction.objectStore(query.From);
                        this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                        this._transaction.onerror = this.onErrorOccured.bind(this);

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
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readwrite");
                        this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                        (this._transaction).ontimeout = this.onTransactionTimeout.bind(this);
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
                    (this as any).TmpQry = {
                        From: this._query.From,
                        Where: {}
                    } as ISelect;
                    var onSuccess = function () {
                        var key = getObjectFirstKey((this as any).OrInfo.OrQuery);
                        if (key != null) {
                            (this as any).TmpQry['Where'][key] = (this as any).OrInfo.OrQuery[key];
                            delete (this as any).OrInfo.OrQuery[key];
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