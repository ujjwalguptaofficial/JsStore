module JsStore {
    export module Business {
        export module Select {
            export class Helper extends GroupByHelper {
                processOrderBy = function () {
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
                    }
                }

                private processAggregateQry = function () {
                    var Datas = this.Results,
                        lookupObject = {};
                    //free results memory
                    this.Results = undefined;
                    var Results = {};
                    for (var prop in this.Query.Aggregate) {
                        switch (prop) {
                            case 'Count':
                                var getCount = function (key) {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][key] ? 1 : 0;
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    var Key = this.Query.Aggregate[prop];
                                    Results["Count(" + Key + ")"] = getCount(Key);
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        var Key = this.Query.Aggregate[prop][key];
                                        Results["Count(" + Key + ")"] = getCount(Key);
                                    }
                                }
                                break;
                            case 'Max':
                                var getMax = function (key) {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result = Result > Datas[i][Key] ? Result : Datas[i][Key];
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    var Key = this.Query.Aggregate[prop];
                                    Results["Max(" + Key + ")"] = getMax(Key);
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        var Key = this.Query.Aggregate[prop][key];
                                        Results["Max(" + Key + ")"] = getMax(Key);
                                    }
                                }
                                break;
                            case 'Min':
                                var getMin = function (key) {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result = Result < Datas[i][Key] ? Result : Datas[i][Key];
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    var Key = this.Query.Aggregate[prop];
                                    Results["Min(" + Key + ")"] = getMin(Key);
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        var Key = this.Query.Aggregate[prop][key];
                                        Results["Min(" + Key + ")"] = getMin(Key);
                                    }
                                }
                                break;
                            case 'Sum':
                                var getSum = function (key) {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key];
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    var Key = this.Query.Aggregate[prop];
                                    Results["Sum(" + Key + ")"] = getSum(Key);
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        var Key = this.Query.Aggregate[prop][key];
                                        Results["Sum(" + Key + ")"] = getSum(Key);
                                    }
                                }
                                break;
                            case 'Avg':
                                var getAvg = function (key) {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key];
                                    };
                                    return Result / Datas.length;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    var Key = this.Query.Aggregate[prop];
                                    Results["Avg(" + Key + ")"] = getAvg(Key);
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        var Key = this.Query.Aggregate[prop][key];
                                        Results["Avg(" + Key + ")"] = getAvg(Key);
                                    }
                                }
                                break;
                        }
                    }

                    //add results to the first index of result
                    for (var prop in Results) {
                        Datas[0][prop] = Results[prop];
                    }
                    this.Results = Datas;
                }

                protected processGroupBy = function () {
                    var GroupBy = this.Query.GroupBy;
                    this.Query.GroupBy = undefined;
                    if (typeof GroupBy == 'string') {
                        this.executeSimpleGroupBy(GroupBy);
                    }
                    else {
                        for (var column in GroupBy) {
                            this.executeSimpleGroupBy(GroupBy[column]);
                        };
                    }
                }

                constructor() {
                    super();
                }
            }
        }
    }
}