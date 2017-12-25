namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Instance extends Helper {

                constructor(query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
                    super();
                    var That = this;
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._skipRecord = this._query.Skip;
                    this._limitRecord = this._query.Limit;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readonly");
                        this._transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        (this._transaction as any).ontimeout = That.onTransactionCompleted;
                        this._objectStore = this._transaction.objectStore(query.From);
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

                public onTransactionCompleted = function () {
                    if (this._sendResultFlag) {
                        this.processOrderBy();
                        if (this._query.Distinct) {
                            var GroupBy = [];
                            var Result = this._results[0];
                            for (var key in Result) {
                                GroupBy.push(key);
                            }
                            var PrimaryKey = this.getPrimaryKey(this._query.From),
                                Index = GroupBy.indexOf(PrimaryKey);
                            GroupBy.splice(Index, 1);
                            this._query.GroupBy = GroupBy.length > 0 ? GroupBy : null;
                        }
                        if (this._query.GroupBy) {
                            if (this._query.Aggregate) {
                                this.executeAggregateGroupBy();
                            }
                            else {
                                this.processGroupBy();
                            }
                        }
                        else if (this._query.Aggregate) {
                            this.processAggregateQry();
                        }
                        this._onSuccess(this._results);
                    }
                };

                private createtransactionForOrLogic = function (query) {
                    var That = this;
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readonly");
                        this._transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        this._transaction.ontimeout = That.onTransactionCompleted;
                        this._objectStore = this._transaction.objectStore(query.From);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                };

                private orQuerySuccess = function () {
                    this._results = (this as any).OrInfo._results;
                    // free var memory
                    (this as any).OrInfo._results = undefined;
                    this.removeDuplicates();
                    (this as any).OrInfo.OnSucess(this._results);
                };

                private executeOrLogic = function () {
                    (this as any).OrInfo = {
                        OrQuery: this._query.Where.Or,
                        OnSucess: this._onSuccess,
                        _results: []
                    };
                    (this as any).TmpQry = {
                        From: this._query.From,
                        Where: {}
                    } as ISelect;
                    var onSuccess = function () {
                        (this as any).OrInfo._results = (this as any).OrInfo._results.concat(this._results);
                        if (!this._query.Limit || (this._query.Limit > (this as any).OrInfo._results.length)) {
                            this._results = [];
                            var Key = getObjectFirstKey((this as any).OrInfo.OrQuery);
                            if (Key != null) {
                                (this as any).TmpQry['Where'][Key] = (this as any).OrInfo.OrQuery[Key];
                                delete (this as any).OrInfo.OrQuery[Key];
                                this.createtransactionForOrLogic((this as any).TmpQry);
                            }
                            else {
                                this.orQuerySuccess();
                            }
                        }
                        else {
                            this.orQuerySuccess();
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
