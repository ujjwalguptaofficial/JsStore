module JsStore {
    export module Business {
        export module Select {
            export class Instance extends Where {
                public onTransactionCompleted = function () {
                    var Order = this.Query.Order;
                    if (Order && this.Results.length > 0 && !this.Sorted && Order.By) {
                        Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
                        var That = this, OrderColumn = Order.By,
                            sortNumberInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn] - b[OrderColumn];
                                });
                            },
                            sortNumberInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn] - a[OrderColumn];
                                });
                            },
                            sortAlphabetInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn].toLowerCase().localeCompare(b[OrderColumn].toLowerCase());
                                });
                            },
                            sortAlphabetInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn].toLowerCase().localeCompare(a[OrderColumn].toLowerCase());
                                });
                            };
                        if (typeof this.Results[0][OrderColumn] == 'string') {
                            if (Order.Type == 'asc') {
                                sortAlphabetInAsc();
                            }
                            else {
                                sortAlphabetInDesc();
                            }
                        }
                        else if (typeof this.Results[0][OrderColumn] == 'number') {
                            if (Order.Type == 'asc') {
                                sortNumberInAsc();
                            }
                            else {
                                sortNumberInDesc();
                            }
                        }
                        this.OnSuccess(this.Results);
                    }
                    else if (this.SendResultFlag) {
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
