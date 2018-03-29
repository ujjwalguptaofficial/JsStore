var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GroupByHelper } from "./group_by_helper";
var Helper = /** @class */ (function (_super) {
    __extends(Helper, _super);
    function Helper() {
        return _super.call(this) || this;
    }
    Helper.prototype.processOrderBy = function () {
        var Order = this._query.Order;
        if (Order && this._results.length > 0 && !this._sorted && Order.By) {
            Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
            var order_column = Order.By, sortNumberInAsc = function () {
                this._results.sort(function (a, b) {
                    return a[order_column] - b[order_column];
                });
            }.bind(this), sortNumberInDesc = function () {
                this._results.sort(function (a, b) {
                    return b[order_column] - a[order_column];
                });
            }.bind(this), sortAlphabetInAsc = function () {
                this._results.sort(function (a, b) {
                    return a[order_column].toLowerCase().localeCompare(b[order_column].toLowerCase());
                });
            }.bind(this), sortAlphabetInDesc = function () {
                this._results.sort(function (a, b) {
                    return b[order_column].toLowerCase().localeCompare(a[order_column].toLowerCase());
                });
            }.bind(this);
            if (typeof this._results[0][order_column] === 'string') {
                if (Order.Type === 'asc') {
                    sortAlphabetInAsc();
                }
                else {
                    sortAlphabetInDesc();
                }
            }
            else if (typeof this._results[0][order_column] === 'number') {
                if (Order.Type === 'asc') {
                    sortNumberInAsc();
                }
                else {
                    sortNumberInDesc();
                }
            }
        }
    };
    Helper.prototype.processAggregateQry = function () {
        var datas = this._results, results = {}, column_to_aggregate;
        // free results memory
        this._results = undefined;
        for (var prop in this._query.Aggregate) {
            switch (prop) {
                case 'Count':
                    var getCount = function () {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate] ? 1 : 0;
                        }
                        return result;
                    };
                    if (typeof this._query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this._query.Aggregate[prop];
                        results["Count(" + column_to_aggregate + ")"] = getCount();
                    }
                    else if (Array.isArray(this._query.Aggregate[prop])) {
                        for (var key in this._query.Aggregate[prop]) {
                            column_to_aggregate = this._query.Aggregate[prop][key];
                            results["Count(" + column_to_aggregate + ")"] = getCount();
                        }
                    }
                    break;
                case 'Max':
                    var getMax = function () {
                        var result = 0;
                        for (var i in datas) {
                            result = result > datas[i][column_to_aggregate] ?
                                result : datas[i][column_to_aggregate];
                        }
                        return result;
                    };
                    if (typeof this._query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this._query.Aggregate[prop];
                        results["Max(" + column_to_aggregate + ")"] = getMax();
                    }
                    else if (Array.isArray(this._query.Aggregate[prop])) {
                        for (var key in this._query.Aggregate[prop]) {
                            column_to_aggregate = this._query.Aggregate[prop][key];
                            results["Max(" + column_to_aggregate + ")"] = getMax();
                        }
                    }
                    break;
                case 'Min':
                    var getMin = function () {
                        var result = Infinity, value = Infinity;
                        for (var i in datas) {
                            value = datas[i][column_to_aggregate] ?
                                datas[i][column_to_aggregate] : Infinity;
                            result = result < value ? result : value;
                        }
                        return result;
                    };
                    if (typeof this._query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this._query.Aggregate[prop];
                        results["Min(" + column_to_aggregate + ")"] = getMin();
                    }
                    else if (Array.isArray(this._query.Aggregate[prop])) {
                        for (var key in this._query.Aggregate[prop]) {
                            column_to_aggregate = this._query.Aggregate[prop][key];
                            results["Min(" + column_to_aggregate + ")"] = getMin();
                        }
                    }
                    break;
                case 'Sum':
                    var getSum = function () {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate];
                        }
                        return result;
                    };
                    if (typeof this._query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this._query.Aggregate[prop];
                        results["Sum(" + column_to_aggregate + ")"] = getSum();
                    }
                    else if (Array.isArray(this._query.Aggregate[prop])) {
                        for (var key in this._query.Aggregate[prop]) {
                            column_to_aggregate = this._query.Aggregate[prop][key];
                            results["Sum(" + column_to_aggregate + ")"] = getSum();
                        }
                    }
                    break;
                case 'Avg':
                    var getAvg = function () {
                        var result = 0;
                        for (var i in datas) {
                            result += datas[i][column_to_aggregate];
                        }
                        return result / datas.length;
                    };
                    if (typeof this._query.Aggregate[prop] === 'string') {
                        column_to_aggregate = this._query.Aggregate[prop];
                        results["Avg(" + column_to_aggregate + ")"] = getAvg();
                    }
                    else if (Array.isArray(this._query.Aggregate[prop])) {
                        for (var key in this._query.Aggregate[prop]) {
                            column_to_aggregate = this._query.Aggregate[prop][key];
                            results["Avg(" + column_to_aggregate + ")"] = getAvg();
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
    };
    return Helper;
}(GroupByHelper));
export { Helper };
//# sourceMappingURL=helper.js.map