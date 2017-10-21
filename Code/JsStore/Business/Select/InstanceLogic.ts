module JsStore {
    export module Business {
        export module Select {
            export class Instance extends Helper {
                public onTransactionCompleted = function () {
                    if (this.SendResultFlag) {
                        this.processOrderBy();
                        if (this.Query.GroupBy) {
                            if (this.Query.Aggregate) {
                                this.executeAggregateGroupBy();
                            }
                            else {
                                this.processGroupBy();
                            }
                        }
                        else if (this.Query.Aggregate) {
                            this.processAggregateQry();
                        }
                        this.OnSuccess(this.Results);
                    }
                }

                private createtransactionForOrLogic = function (query) {
                    var That = this;
                    this.Query = query;
                    try {
                        this.Transaction = DbConnection.transaction([query.From], "readonly");
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

                private orQuerySuccess = function () {
                    this.Results = (this as any).OrInfo.Results;
                    //free var memory
                    (this as any).OrInfo.Results = undefined;
                    this.removeDuplicates();
                    (this as any).OrInfo.OnSucess(this.Results);
                }

                private executeOrLogic = function () {
                    (this as any).OrInfo = {
                        OrQuery: this.Query.Where.Or,
                        OnSucess: this.OnSuccess,
                        Results: []
                    };
                    (this as any).TmpQry = <ISelect>{
                        From: this.Query.From,
                        Where: {}
                    };
                    var onSuccess = function () {
                        (this as any).OrInfo.Results = (this as any).OrInfo.Results.concat(this.Results);
                        if (!this.Query.Limit || (this.Query.Limit > (this as any).OrInfo.Results.length)) {
                            this.Results = [];
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
                    }
                    //free or memory
                    this.Query.Where.Or = undefined;
                    this.OnSuccess = onSuccess;
                }

                constructor(query: ISelect, onSuccess: Function, onError: Function) {
                    super();
                    var That = this;
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    this.SkipRecord = this.Query.Skip;
                    this.LimitRecord = this.Query.Limit;

                    try {
                        this.Transaction = DbConnection.transaction([query.From], "readonly");
                        this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        (<any>this.Transaction).ontimeout = That.onTransactionCompleted;
                        this.ObjectStore = this.Transaction.objectStore(query.From);
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
