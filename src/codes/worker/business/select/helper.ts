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
        const datas = this.results,
            results = {};
        let columnToAggregate;
        // free results memory
        this.results = undefined;
        for (const prop in this.query.Aggregate) {
            switch (prop) {
                case 'count':
                    const getCount = () => {
                        let result = 0;
                        for (const i in datas) {
                            result += datas[i][columnToAggregate] ? 1 : 0;
                        }
                        return result;
                    };
                    if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.String) {
                        columnToAggregate = this.query.Aggregate[prop];
                        results["count(" + columnToAggregate + ")"] = getCount();
                    }
                    else if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.Array) {
                        for (const key in this.query.Aggregate[prop]) {
                            columnToAggregate = this.query.Aggregate[prop][key];
                            results["count(" + columnToAggregate + ")"] = getCount();
                        }
                    }
                    break;
                case 'max':
                    const getMax = () => {
                        let result = 0;
                        for (const i in datas) {
                            result = result > datas[i][columnToAggregate] ?
                                result : datas[i][columnToAggregate];
                        }
                        return result;
                    };
                    if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.String) {
                        columnToAggregate = this.query.Aggregate[prop];
                        results["max(" + columnToAggregate + ")"] = getMax();
                    }
                    else if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.Array) {
                        for (const key in this.query.Aggregate[prop]) {
                            columnToAggregate = this.query.Aggregate[prop][key];
                            results["max(" + columnToAggregate + ")"] = getMax();
                        }
                    }
                    break;
                case 'min':
                    const getMin = () => {
                        let result = Infinity, value = Infinity;
                        for (const i in datas) {
                            value = datas[i][columnToAggregate] ?
                                datas[i][columnToAggregate] : Infinity;
                            result = result < value ? result : value;
                        }
                        return result;
                    };
                    if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.String) {
                        columnToAggregate = this.query.Aggregate[prop];
                        results["min(" + columnToAggregate + ")"] = getMin();
                    }
                    else if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.Array) {
                        for (const key in this.query.Aggregate[prop]) {
                            columnToAggregate = this.query.Aggregate[prop][key];
                            results["min(" + columnToAggregate + ")"] = getMin();
                        }
                    }
                    break;
                case 'sum':
                    const getSum = () => {
                        let result = 0;
                        for (const i in datas) {
                            result += datas[i][columnToAggregate];
                        }
                        return result;
                    };
                    if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.String) {
                        columnToAggregate = this.query.Aggregate[prop];
                        results["sum(" + columnToAggregate + ")"] = getSum();
                    }
                    else if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.Array) {
                        for (const key in this.query.Aggregate[prop]) {
                            columnToAggregate = this.query.Aggregate[prop][key];
                            results["sum(" + columnToAggregate + ")"] = getSum();
                        }
                    }
                    break;
                case 'avg':
                    const getAvg = () => {
                        let result = 0;
                        for (const i in datas) {
                            result += datas[i][columnToAggregate];
                        }
                        return result / datas.length;
                    };
                    if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.String) {
                        columnToAggregate = this.query.Aggregate[prop];
                        results["avg(" + columnToAggregate + ")"] = getAvg();
                    }
                    else if (this.getType(this.query.Aggregate[prop]) === DATA_TYPE.Array) {
                        for (const key in this.query.Aggregate[prop]) {
                            columnToAggregate = this.query.Aggregate[prop][key];
                            results["avg(" + columnToAggregate + ")"] = getAvg();
                        }
                    }
                    break;
            }
        }

        // add results to the first index of result
        for (const prop in results) {
            datas[0][prop] = results[prop];
        }
        this.results = datas;
    }
}