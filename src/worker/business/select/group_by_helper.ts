import { Where } from "./where";
import { DATA_TYPE, QUERY_OPTION } from "../../enums";

export class GroupByHelper extends Where {
    constructor() {
        super();
    }

    protected processGroupBy() {
        const grpQry = this.query.groupBy as any;
        let datas = this.results;
        const lookUpObj = {};
        // free results memory
        this.results = this.query.groupBy = undefined;
        if (this.getType(grpQry) === DATA_TYPE.String) {
            for (const i in datas) {
                lookUpObj[datas[i][grpQry as string]] = datas[i];
            }
        }
        else {
            let objKey;
            for (const i in datas) {
                objKey = "";
                for (const column in grpQry) {
                    objKey += datas[i][grpQry[column]];
                }
                lookUpObj[objKey] = datas[i];
            }
        }
        // free datas memory
        datas = [];
        for (const i in lookUpObj) {
            datas.push(lookUpObj[i]);
        }
        this.results = datas;
    }

    protected executeAggregateGroupBy() {
        const grpQry = this.query.groupBy as any;
        let datas = this.results;
        const lookUpObj = {};
        // assign aggregate and free aggregate memory
        const aggregateQry = this.query.aggregate;
        this.query.aggregate = undefined;
        // free results memory
        this.results = undefined;

        let index;
        let objKey;
        let value;
        let columnToAggregate;
        const calculateAggregate = () => {
            for (const prop in aggregateQry) {
                const aggregateColumn = aggregateQry[prop];
                const aggregateValType = this.getType(aggregateColumn);
                switch (prop) {
                    case QUERY_OPTION.Count:
                        const getCount = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["count(" + columnToAggregate + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][columnToAggregate] ? 1 : 0;
                            return value;
                        };
                        if (aggregateValType === DATA_TYPE.String) {
                            columnToAggregate = aggregateColumn;
                            datas[index]["count(" + columnToAggregate + ")"] = getCount();
                        }
                        else if (aggregateValType === DATA_TYPE.Array) {
                            for (const item in aggregateColumn) {
                                columnToAggregate = aggregateColumn[item];
                                datas[index]["count(" + columnToAggregate + ")"] = getCount();
                            }
                        }
                        break;
                    case QUERY_OPTION.Max:
                        const getMax = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["max(" + columnToAggregate + ")"] : 0;
                            datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                                datas[index][columnToAggregate] : 0;
                            // compare between old value and new value
                            return value > datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
                        };

                        if (aggregateValType === DATA_TYPE.String) {
                            columnToAggregate = aggregateColumn;
                            datas[index]["max(" + columnToAggregate + ")"] = getMax();
                        }
                        else if (aggregateValType === DATA_TYPE.Array) {
                            for (const item in aggregateColumn) {
                                columnToAggregate = aggregateColumn[item];
                                datas[index]["max(" + columnToAggregate + ")"] = getMax();
                            }
                        }
                        break;
                    case QUERY_OPTION.Min:
                        const getMin = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["min(" + columnToAggregate + ")"] : Infinity;
                            datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                                datas[index][columnToAggregate] : Infinity;
                            // compare between old value and new value
                            return value < datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
                        };

                        if (aggregateValType === DATA_TYPE.String) {
                            columnToAggregate = aggregateColumn;
                            datas[index]["min(" + columnToAggregate + ")"] = getMin();
                        }
                        else if (aggregateValType === DATA_TYPE.Array) {
                            for (const item in aggregateColumn) {
                                columnToAggregate = aggregateColumn[item];
                                datas[index]["min(" + columnToAggregate + ")"] = getMin();
                            }
                        }
                        break;
                    case QUERY_OPTION.Sum:
                        const getSum = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["sum(" + columnToAggregate + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][columnToAggregate] ? datas[index][columnToAggregate] : 0;
                            return value;
                        };
                        if (aggregateValType === DATA_TYPE.String) {
                            columnToAggregate = aggregateColumn;
                            datas[index]["sum(" + columnToAggregate + ")"] = getSum();
                        }
                        else if (aggregateValType === DATA_TYPE.Array) {
                            for (const item in aggregateColumn) {
                                columnToAggregate = aggregateColumn[item];
                                datas[index]["sum(" + columnToAggregate + ")"] = getSum();
                            }
                        }
                        break;
                    case QUERY_OPTION.Avg:
                        const getAvg = () => {
                            value = lookUpObj[objKey];
                            // get old sum value
                            let sumOfColumn = value ? value["sum(" + columnToAggregate + ")"] : 0;
                            // add with old value if data exist
                            sumOfColumn += datas[index][columnToAggregate] ? datas[index][columnToAggregate] : 0;
                            datas[index]["sum(" + columnToAggregate + ")"] = sumOfColumn;
                            // get old count value
                            value = value ? value["count(" + columnToAggregate + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][columnToAggregate] ? 1 : 0;
                            datas[index]["count(" + columnToAggregate + ")"] = value;
                        };

                        if (aggregateValType === DATA_TYPE.String) {
                            columnToAggregate = aggregateColumn;
                            getAvg();
                        }
                        else if (aggregateValType === DATA_TYPE.Array) {
                            for (const item in aggregateColumn) {
                                columnToAggregate = aggregateColumn[item];
                                getAvg();
                            }
                        }
                        break;
                }
            }
        };

        if (this.getType(grpQry) === DATA_TYPE.String) {
            for (index in datas) {
                objKey = datas[index][grpQry];
                calculateAggregate();
                lookUpObj[objKey] = datas[index];
            }
        }
        else {
            for (index in datas) {
                objKey = "";
                for (const column in grpQry) {
                    objKey += datas[index][grpQry[column]];
                }
                calculateAggregate();
                lookUpObj[objKey] = datas[index];
            }

        }
        // free datas memory
        datas = [];
        for (const i in lookUpObj) {
            datas.push(lookUpObj[i]);
        }
        // Checking for avg and if exist then fill the datas;
        if (aggregateQry.avg) {
            if (this.getType(aggregateQry.avg) === DATA_TYPE.String) {
                for (index in datas) {
                    const sumForAvg = datas[index]["sum(" + aggregateQry.avg + ")"],
                        countForAvg = datas[index]["count(" + aggregateQry.avg + ")"];
                    datas[index]["avg(" + aggregateQry.avg + ")"] = sumForAvg / countForAvg;
                    if (aggregateQry.count !== aggregateQry.avg) {
                        delete datas[index]["count(" + aggregateQry.avg + ")"];
                    }
                    if (aggregateQry.sum !== aggregateQry.avg) {
                        delete datas[index]["sum(" + aggregateQry.avg + ")"];
                    }
                }
            }
            else {
                const isCountTypeString = this.getType(aggregateQry.count) === DATA_TYPE.String;
                const isSumTypeString = this.getType(aggregateQry.sum) === DATA_TYPE.String;
                for (index in datas) {
                    for (const column in aggregateQry.avg as any) {
                        const avgColumn = aggregateQry.avg[column],
                            sum = datas[index]["sum(" + avgColumn + ")"],
                            count = datas[index]["count(" + avgColumn + ")"];
                        datas[index]["avg(" + avgColumn + ")"] = sum / count;

                        if (isCountTypeString) {
                            if (aggregateQry.count !== avgColumn) {
                                delete datas[index]["count(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.count.indexOf(avgColumn) === -1) {
                                delete datas[index]["count(" + avgColumn + ")"];
                            }
                        }

                        if (isSumTypeString) {
                            if (aggregateQry.sum !== avgColumn) {
                                delete datas[index]["sum(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.sum.indexOf(avgColumn) === -1) {
                                delete datas[index]["sum(" + avgColumn + ")"];
                            }
                        }
                    }
                }
            }
        }
        this.results = datas;
    }
}