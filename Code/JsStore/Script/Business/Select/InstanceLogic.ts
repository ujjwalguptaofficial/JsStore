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
                        if (this.OnSuccess) {
                            this.OnSuccess(this.Results);
                        }

                    }
                    else if (this.SendResultFlag) {
                        if (this.OnSuccess) {
                            this.OnSuccess(this.Results);
                        }
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
                        if (query.Where) {
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

                private executeOrLogic = function (query) {
                    (this as any).OrInfo = {
                        OrQuery: query.Where.Or,
                        OnSucess: this.OnSuccess,
                        Results: [],
                        Length: Object.keys(query.Where.Or).length
                    };
                    (this as any).TmpQry = <ISelect>{
                        From: query.From,
                        Where: {}
                    };
                    var onSuccess = function () {
                        (this as any).OrInfo.Results = (this as any).OrInfo.Results.concat(this.Results);
                        this.Results = [];
                        var Key = getObjectFirstKey((this as any).OrInfo.OrQuery);
                        if (Key != null) {
                            var Value = (this as any).OrInfo.OrQuery[Key];
                            delete (this as any).OrInfo.OrQuery[Key];
                            (this as any).TmpQry['Where'][Key] = Value;
                            this.createtransactionForOrLogic((this as any).TmpQry);
                        }
                        else {
                            var Datas = (this as any).OrInfo.Results;
                            //remove extra data
                            (this as any).OrInfo.Results = undefined;
                            var removeDuplicates = function () {
                                var PrimKey = getPrimaryKey(query.From);
                                var newArray = [];
                                var lookupObject = {};
                                for (var i in Datas) {
                                    lookupObject[Datas[i][PrimKey]] = Datas[i];
                                }
                                for (i in lookupObject) {
                                    newArray.push(lookupObject[i]);
                                }
                                Datas = newArray;
                            };
                            removeDuplicates();
                            (this as any).OrInfo.OnSucess(Datas);
                        }
                    }
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
                                this.executeOrLogic(query);
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
