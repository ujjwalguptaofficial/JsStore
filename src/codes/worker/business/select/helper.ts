import { GroupByHelper } from "./group_by_helper";

export class Helper extends GroupByHelper {

    constructor() {
        super();
    }

    processOrderBy() {
        var order = this.query.order;
        if (order && this._results.length > 0 && !this._sorted && order.by) {
            order.Type = order.Type ? order.Type.toLowerCase() : 'asc';
            var order_column = order.by,
                sortNumberInAsc = () => {
                    this._results.sort((a, b) => {
                        return a[order_column] - b[order_column];
                    });
                },
                sortNumberInDesc = () => {
                    this._results.sort((a, b) => {
                        return b[order_column] - a[order_column];
                    });
                },
                sortAlphabetInAsc = () => {
                    this._results.sort((a, b) => {
                        return a[order_column].toLowerCase().localeCompare(b[order_column].toLowerCase());
                    });
                },
                sortAlphabetInDesc = () => {
                    this._results.sort((a, b) => {
                        return b[order_column].toLowerCase().localeCompare(a[order_column].toLowerCase());
                    });
                };
            if (typeof this._results[0][order_column] === 'string') {
                if (order.Type === 'asc') {
                    sortAlphabetInAsc();
                }
                else {
                    sortAlphabetInDesc();
                }
            }
            else if (typeof this._results[0][order_column] === 'number') {
                if (order.Type === 'asc') {
                    sortNumberInAsc();
                }
                else {
                    sortNumberInDesc();
                }
            }
        }
    }

    protected processAggregateQry() {
        var datas = this._results,
            results = {},
            column_to_aggregate;
        // free results memory
        this._results = undefined;
        for (var prop in this.query.Aggregate) {
            switch (prop) {
                case 'count':
                    var getCount = () => {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate] ? 1 : 0;
                        }
                        return result;
                    };
                    if (typeof this.query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this.query.Aggregate[prop];
                        results["count(" + column_to_aggregate + ")"] = getCount();
                    }
                    else if (Array.isArray(this.query.Aggregate[prop])) {
                        for (var key in this.query.Aggregate[prop]) {
                            column_to_aggregate = this.query.Aggregate[prop][key];
                            results["count(" + column_to_aggregate + ")"] = getCount();
                        }
                    }
                    break;
                case 'max':
                    var getMax = () => {
                        var result = 0;
                        for (var i in datas) {
                            result = result > datas[i][column_to_aggregate] ?
                                result : datas[i][column_to_aggregate];
                        }
                        return result;
                    };
                    if (typeof this.query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this.query.Aggregate[prop];
                        results["max(" + column_to_aggregate + ")"] = getMax();
                    }
                    else if (Array.isArray(this.query.Aggregate[prop])) {
                        for (var key in this.query.Aggregate[prop]) {
                            column_to_aggregate = this.query.Aggregate[prop][key];
                            results["max(" + column_to_aggregate + ")"] = getMax();
                        }
                    }
                    break;
                case 'min':
                    var getMin = () => {
                        var result = Infinity, value = Infinity;
                        for (var i in datas) {
                            value = datas[i][column_to_aggregate] ?
                                datas[i][column_to_aggregate] : Infinity;
                            result = result < value ? result : value;
                        }
                        return result;
                    };
                    if (typeof this.query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this.query.Aggregate[prop];
                        results["min(" + column_to_aggregate + ")"] = getMin();
                    }
                    else if (Array.isArray(this.query.Aggregate[prop])) {
                        for (var key in this.query.Aggregate[prop]) {
                            column_to_aggregate = this.query.Aggregate[prop][key];
                            results["min(" + column_to_aggregate + ")"] = getMin();
                        }
                    }
                    break;
                case 'sum':
                    var getSum = () => {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate];
                        }
                        return result;
                    };
                    if (typeof this.query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this.query.Aggregate[prop];
                        results["sum(" + column_to_aggregate + ")"] = getSum();
                    }
                    else if (Array.isArray(this.query.Aggregate[prop])) {
                        for (var key in this.query.Aggregate[prop]) {
                            column_to_aggregate = this.query.Aggregate[prop][key];
                            results["sum(" + column_to_aggregate + ")"] = getSum();
                        }
                    }
                    break;
                case 'avg':
                    var getAvg = () => {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate];
                        }
                        return result / datas.length;
                    };
                    if (typeof this.query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this.query.Aggregate[prop];
                        results["avg(" + column_to_aggregate + ")"] = getAvg();
                    }
                    else if (Array.isArray(this.query.Aggregate[prop])) {
                        for (var key in this.query.Aggregate[prop]) {
                            column_to_aggregate = this.query.Aggregate[prop][key];
                            results["avg(" + column_to_aggregate + ")"] = getAvg();
                        }
                    }
                    break;
            }
        }

        // add results to the first index of result
        for (var prop in results) {
            datas[0][prop] = results[prop];
        }
        this._results = datas;
    }
}