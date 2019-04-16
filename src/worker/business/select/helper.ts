import { GroupByHelper } from "./group_by_helper";
import { DATA_TYPE, ERROR_TYPE } from "../../enums";
import { LogHelper } from "../../log_helper";

export class Helper extends GroupByHelper {

    constructor() {
        super();
    }

    protected processOrderBy() {
        const order = this.query.order;
        if (order && this.results.length > 0 && !this.sorted && order.by) {
            order.type = order.type ? order.type.toLowerCase() : 'asc';
            const orderColumn = order.by;
            const sortNumberInAsc = () => {
                this.results.sort((a, b) => {
                    return a[orderColumn] - b[orderColumn];
                });
            };
            const sortNumberInDesc = () => {
                this.results.sort((a, b) => {
                    return b[orderColumn] - a[orderColumn];
                });
            };
            const sortDateInAsc = () => {
                this.results.sort((a, b) => {
                    return a[orderColumn].getTime() - b[orderColumn].getTime();
                });
            };
            const sortDateInDesc = () => {
                this.results.sort((a, b) => {
                    return b[orderColumn].getTime() - a[orderColumn].getTime();
                });
            };
            const sortAlphabetInAsc = () => {
                this.results.sort((a, b) => {
                    return a[orderColumn].localeCompare(b[orderColumn]);
                });
            };
            const sortAlphabetInDesc = () => {
                this.results.sort((a, b) => {
                    return b[orderColumn].localeCompare(a[orderColumn]);
                });
            };
            const column = this.getColumnInfo(orderColumn);
            if (column == null) {
                this.onErrorOccured(new LogHelper(ERROR_TYPE.InvalidColumn, { column: orderColumn }), true);
            }
            else if (column.dataType === DATA_TYPE.String) {
                if (order.type === 'asc') {
                    sortAlphabetInAsc();
                }
                else {
                    sortAlphabetInDesc();
                }
            }
            else if (column.dataType === DATA_TYPE.Number) {
                if (order.type === 'asc') {
                    sortNumberInAsc();
                }
                else {
                    sortNumberInDesc();
                }
            }
            else if (column.dataType === DATA_TYPE.DateTime) {
                if (order.type === 'asc') {
                    sortDateInAsc();
                }
                else {
                    sortDateInDesc();
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
        for (const prop in this.query.aggregate) {
            const aggregateColumn = this.query.aggregate[prop];
            const aggregateValType = this.getType(aggregateColumn);
            switch (prop) {
                case 'count':
                    const getCount = () => {
                        let result = 0;
                        for (const i in datas) {
                            result += datas[i][columnToAggregate] ? 1 : 0;
                        }
                        return result;
                    };
                    if (aggregateValType === DATA_TYPE.String) {
                        columnToAggregate = aggregateColumn;
                        results["count(" + columnToAggregate + ")"] = getCount();
                    }
                    else if (aggregateValType === DATA_TYPE.Array) {
                        for (const key in aggregateColumn) {
                            columnToAggregate = aggregateColumn[key];
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
                    if (aggregateValType === DATA_TYPE.String) {
                        columnToAggregate = aggregateColumn;
                        results["max(" + columnToAggregate + ")"] = getMax();
                    }
                    else if (aggregateValType === DATA_TYPE.Array) {
                        for (const key in aggregateColumn) {
                            columnToAggregate = aggregateColumn[key];
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
                    if (aggregateValType === DATA_TYPE.String) {
                        columnToAggregate = aggregateColumn;
                        results["min(" + columnToAggregate + ")"] = getMin();
                    }
                    else if (aggregateValType === DATA_TYPE.Array) {
                        for (const key in aggregateColumn) {
                            columnToAggregate = aggregateColumn[key];
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
                    if (aggregateValType === DATA_TYPE.String) {
                        columnToAggregate = aggregateColumn;
                        results["sum(" + columnToAggregate + ")"] = getSum();
                    }
                    else if (aggregateValType === DATA_TYPE.Array) {
                        for (const key in aggregateColumn) {
                            columnToAggregate = aggregateColumn[key];
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
                    if (aggregateValType === DATA_TYPE.String) {
                        columnToAggregate = aggregateColumn;
                        results["avg(" + columnToAggregate + ")"] = getAvg();
                    }
                    else if (aggregateValType === DATA_TYPE.Array) {
                        for (const key in aggregateColumn) {
                            columnToAggregate = aggregateColumn[key];
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