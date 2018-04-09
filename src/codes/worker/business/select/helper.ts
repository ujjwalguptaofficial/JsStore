import { GroupByHelper } from "./group_by_helper";
import { DATA_TYPE } from "../../enums";

export class Helper extends GroupByHelper {

    constructor() {
        super();
    }

    processOrderBy() {
        const order = this.query.order;
        if (order && this.results.length > 0 && !this.sorted && order.by) {
            order.Type = order.Type ? order.Type.toLowerCase() : 'asc';
            const orderColumn = order.by,
                sortNumberInAsc = () => {
                    this.results.sort((a, b) => {
                        return a[orderColumn] - b[orderColumn];
                    });
                },
                sortNumberInDesc = () => {
                    this.results.sort((a, b) => {
                        return b[orderColumn] - a[orderColumn];
                    });
                },
                sortAlphabetInAsc = () => {
                    this.results.sort((a, b) => {
                        return a[orderColumn].toLowerCase().localeCompare(b[orderColumn].toLowerCase());
                    });
                },
                sortAlphabetInDesc = () => {
                    this.results.sort((a, b) => {
                        return b[orderColumn].toLowerCase().localeCompare(a[orderColumn].toLowerCase());
                    });
                };
            if (typeof this.results[0][orderColumn] === DATA_TYPE.String) {
                if (order.Type === 'asc') {
                    sortAlphabetInAsc();
                }
                else {
                    sortAlphabetInDesc();
                }
            }
            else if (typeof this.results[0][orderColumn] === DATA_TYPE.Number) {
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
        var datas = this.results,
            results = {},
            column_to_aggregate;
        // free results memory
        this.results = undefined;
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
        this.results = datas;
    }
}