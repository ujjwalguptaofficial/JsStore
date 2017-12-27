namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Instance extends Helper {
                constructor(query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
                    super();
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._skipRecord = this._query.Skip;
                    this._limitRecord = this._query.Limit;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readonly");
                        this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                        (this._transaction as any).ontimeout = this.onTransactionTimeout.bind(this);
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
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: query.From });
                    }
                }

                public onTransactionCompleted = function () {
                    if (this._sendResultFlag) {
                        this.processOrderBy();
                        if (this._query.Distinct) {
                            var group_by = [];
                            var result = this._results[0];
                            for (var key in result) {
                                group_by.push(key);
                            }
                            var primary_key = this.getPrimaryKey(this._query.From),
                                index = group_by.indexOf(primary_key);
                            group_by.splice(index, 1);
                            this._query.GroupBy = group_by.length > 0 ? group_by : null;
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
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.From], "readonly");
                        this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                        this._transaction.ontimeout = this.onTransactionTimeout.bind(this);
                        this._objectStore = this._transaction.objectStore(query.From);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: query.From });
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
                            var key = getObjectFirstKey((this as any).OrInfo.OrQuery);
                            if (key != null) {
                                (this as any).TmpQry['Where'][key] = (this as any).OrInfo.OrQuery[key];
                                delete (this as any).OrInfo.OrQuery[key];
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
