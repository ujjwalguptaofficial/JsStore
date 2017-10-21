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
                        Results = {},
                        Key;
                    //free results memory
                    this.Results = undefined;
                    for (var prop in this.Query.Aggregate) {
                        switch (prop) {
                            case 'Count':
                                var getCount = function () {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key] ? 1 : 0;
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    Key = this.Query.Aggregate[prop];
                                    Results["Count(" + Key + ")"] = getCount();
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        Key = this.Query.Aggregate[prop][key];
                                        Results["Count(" + Key + ")"] = getCount();
                                    }
                                }
                                break;
                            case 'Max':
                                var getMax = function () {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result = Result > Datas[i][Key] ? Result : Datas[i][Key];
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    Key = this.Query.Aggregate[prop];
                                    Results["Max(" + Key + ")"] = getMax();
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        Key = this.Query.Aggregate[prop][key];
                                        Results["Max(" + Key + ")"] = getMax();
                                    }
                                }
                                break;
                            case 'Min':
                                var getMin = function () {
                                    var Result = Infinity, Value = Infinity;
                                    for (var i in Datas) {
                                        Value = Datas[i][Key] ? Datas[i][Key] : Infinity;
                                        Result = Result < Value ? Result : Value;
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    Key = this.Query.Aggregate[prop];
                                    Results["Min(" + Key + ")"] = getMin();
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        Key = this.Query.Aggregate[prop][key];
                                        Results["Min(" + Key + ")"] = getMin();
                                    }
                                }
                                break;
                            case 'Sum':
                                var getSum = function () {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key];
                                    };
                                    return Result;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    Key = this.Query.Aggregate[prop];
                                    Results["Sum(" + Key + ")"] = getSum();
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        Key = this.Query.Aggregate[prop][key];
                                        Results["Sum(" + Key + ")"] = getSum();
                                    }
                                }
                                break;
                            case 'Avg':
                                var getAvg = function () {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key];
                                    };
                                    return Result / Datas.length;
                                }
                                if (typeof this.Query.Aggregate[prop] == 'string') {
                                    Key = this.Query.Aggregate[prop];
                                    Results["Avg(" + Key + ")"] = getAvg();
                                }
                                else if (Array.isArray(this.Query.Aggregate[prop])) {
                                    for (var key in this.Query.Aggregate[prop]) {
                                        Key = this.Query.Aggregate[prop][key];
                                        Results["Avg(" + Key + ")"] = getAvg();
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

                constructor() {
                    super();
                }
            }
        }
    }
}