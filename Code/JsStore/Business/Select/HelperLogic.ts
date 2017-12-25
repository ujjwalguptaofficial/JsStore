namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Helper extends GroupByHelper {
                processOrderBy = function () {
                    var Order = this._query.Order;
                    if (Order && this._results.length > 0 && !this._sorted && Order.By) {
                        Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
                        var That = this, OrderColumn = Order.By,
                            sortNumberInAsc = function () {
                                That._results.sort(function (a, b) {
                                    return a[OrderColumn] - b[OrderColumn];
                                });
                            },
                            sortNumberInDesc = function () {
                                That._results.sort(function (a, b) {
                                    return b[OrderColumn] - a[OrderColumn];
                                });
                            },
                            sortAlphabetInAsc = function () {
                                That._results.sort(function (a, b) {
                                    return a[OrderColumn].toLowerCase().localeCompare(b[OrderColumn].toLowerCase());
                                });
                            },
                            sortAlphabetInDesc = function () {
                                That._results.sort(function (a, b) {
                                    return b[OrderColumn].toLowerCase().localeCompare(a[OrderColumn].toLowerCase());
                                });
                            };
                        if (typeof this._results[0][OrderColumn] == 'string') {
                            if (Order.Type == 'asc') {
                                sortAlphabetInAsc();
                            }
                            else {
                                sortAlphabetInDesc();
                            }
                        }
                        else if (typeof this._results[0][OrderColumn] == 'number') {
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
                    var Datas = this._results,
                        _results = {},
                        Key;
                    //free results memory
                    this._results = undefined;
                    for (var prop in this._query.Aggregate) {
                        switch (prop) {
                            case 'Count':
                                var getCount = function () {
                                    var Result = 0;
                                    for (var i in Datas) {
                                        Result += Datas[i][Key] ? 1 : 0;
                                    };
                                    return Result;
                                }
                                if (typeof this._query.Aggregate[prop] == 'string') {
                                    Key = this._query.Aggregate[prop];
                                    _results["Count(" + Key + ")"] = getCount();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        Key = this._query.Aggregate[prop][key];
                                        _results["Count(" + Key + ")"] = getCount();
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
                                if (typeof this._query.Aggregate[prop] == 'string') {
                                    Key = this._query.Aggregate[prop];
                                    _results["Max(" + Key + ")"] = getMax();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        Key = this._query.Aggregate[prop][key];
                                        _results["Max(" + Key + ")"] = getMax();
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
                                if (typeof this._query.Aggregate[prop] == 'string') {
                                    Key = this._query.Aggregate[prop];
                                    _results["Min(" + Key + ")"] = getMin();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        Key = this._query.Aggregate[prop][key];
                                        _results["Min(" + Key + ")"] = getMin();
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
                                if (typeof this._query.Aggregate[prop] == 'string') {
                                    Key = this._query.Aggregate[prop];
                                    _results["Sum(" + Key + ")"] = getSum();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        Key = this._query.Aggregate[prop][key];
                                        _results["Sum(" + Key + ")"] = getSum();
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
                                if (typeof this._query.Aggregate[prop] == 'string') {
                                    Key = this._query.Aggregate[prop];
                                    _results["Avg(" + Key + ")"] = getAvg();
                                }
                                else if (Array.isArray(this._query.Aggregate[prop])) {
                                    for (var key in this._query.Aggregate[prop]) {
                                        Key = this._query.Aggregate[prop][key];
                                        _results["Avg(" + Key + ")"] = getAvg();
                                    }
                                }
                                break;
                        }
                    }

                    //add results to the first index of result
                    for (var prop in _results) {
                        Datas[0][prop] = _results[prop];
                    }
                    this._results = Datas;
                }

                constructor() {
                    super();
                }
            }
        }
    }
}