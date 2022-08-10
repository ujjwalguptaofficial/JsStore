import { Select } from ".";
import { getDataType, getObjectFirstKey } from "@/worker/utils";
import { QUERY_OPTION, DATA_TYPE } from "@/common";

export const processGroupBy = function (this: Select) {
    const groupBy = this.query.groupBy as any;
    let datas = this.results;
    const lookUpObj = new Map<string, any>();
    // free results memory
    this.results = this.query.groupBy = null;
    const groupByDataType = getDataType(groupBy);
    if (groupByDataType !== DATA_TYPE.Object) {
        if (groupByDataType === DATA_TYPE.String) {
            for (const i in datas) {
                lookUpObj.set(datas[i][groupBy as string], datas[i]);
            }
        }
        else {
            let objKey;
            for (const i in datas) {
                objKey = "";
                for (const column in groupBy) {
                    objKey += datas[i][groupBy[column]];
                }
                lookUpObj.set(objKey, datas[i]);
            }
        }
    }
    else {
        const caseQueryLength = Object.keys(groupBy).length;
        if (caseQueryLength === 1) {
            const groupByColumn = getObjectFirstKey(groupBy);
            this.thenEvaluator.setCaseAndColumn(groupBy, groupByColumn);
            for (const i in datas) {
                lookUpObj.set(this.thenEvaluator.setValue(datas[i]).evaluate(), datas[i]);
            }
        }
        else {
            let objKey;
            for (const i in datas) {
                objKey = "";
                this.thenEvaluator.setCaseAndValue(groupBy, datas[i]);
                for (const column in groupBy) {
                    objKey += this.thenEvaluator.setColumn(column).evaluate();
                }
                lookUpObj.set(objKey, datas[i]);
            }
        }
    }

    this.results = Array.from(lookUpObj.values());
}

export const executeAggregateGroupBy = function (this: Select) {
    const grpQry = this.query.groupBy as any;
    let datas = this.results;
    // free results memory
    this.results = undefined;
    const lookUpObj = new Map<string, any>();
    // assign aggregate
    const aggregateQry = this.query.aggregate;

    let index;
    let objKey;
    let value;
    let columnToAggregate;
    const calculateAggregate = () => {
        const getCount = () => {
            value = lookUpObj.get(objKey);
            // get old value
            value = value ? value["count(" + columnToAggregate + ")"] : 0;
            // add with old value if data exist
            value += datas[index][columnToAggregate] ? 1 : 0;
            return value;
        };
        const getMax = () => {
            value = lookUpObj.get(objKey);
            // get old value
            value = value ? value["max(" + columnToAggregate + ")"] : 0;
            datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                datas[index][columnToAggregate] : 0;
            // compare between old value and new value
            return value > datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
        };
        const getMin = () => {
            value = lookUpObj.get(objKey);
            // get old value
            value = value ? value["min(" + columnToAggregate + ")"] : Infinity;
            datas[index][columnToAggregate] = datas[index][columnToAggregate] ?
                datas[index][columnToAggregate] : Infinity;
            // compare between old value and new value
            return value < datas[index][columnToAggregate] ? value : datas[index][columnToAggregate];
        };
        const getSum = () => {
            value = lookUpObj.get(objKey);
            // get old value
            value = value ? value["sum(" + columnToAggregate + ")"] : 0;
            // add with old value if data exist
            value += datas[index][columnToAggregate] ? datas[index][columnToAggregate] : 0;
            return value;
        };
        const getAvg = () => {
            value = lookUpObj.get(objKey)
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
        for (const prop in aggregateQry) {
            const aggregateColumn = aggregateQry[prop];
            const aggregateValType = getDataType(aggregateColumn);
            let aggregateCalculator;
            switch (prop) {
                case QUERY_OPTION.Count:
                    aggregateCalculator = getCount;
                    break;
                case QUERY_OPTION.Max:
                    aggregateCalculator = getMax;
                    break;
                case QUERY_OPTION.Min:
                    aggregateCalculator = getMin;
                    break;
                case QUERY_OPTION.Sum:
                    aggregateCalculator = getSum;
                    break;
                case QUERY_OPTION.Avg:
                    aggregateCalculator = getAvg;
                    break;
            }
            switch (aggregateValType) {
                case DATA_TYPE.String:
                    columnToAggregate = aggregateColumn;
                    datas[index][`${prop}(${columnToAggregate})`] = aggregateCalculator();
                    break;
                case DATA_TYPE.Array:
                    for (const item in aggregateColumn) {
                        columnToAggregate = aggregateColumn[item];
                        datas[index][`${prop}(${columnToAggregate})`] = aggregateCalculator();
                    }
            }
        }
    };

    if (getDataType(grpQry) === DATA_TYPE.String) {
        for (index in datas) {
            objKey = datas[index][grpQry];
            calculateAggregate();
            lookUpObj.set(objKey, datas[index]);
        }
    }
    else {
        for (index in datas) {
            objKey = "";
            for (const column in grpQry) {
                objKey += datas[index][grpQry[column]];
            }
            calculateAggregate();
            lookUpObj.set(objKey, datas[index]);
        }

    }
    datas = Array.from(lookUpObj.values());

    // Checking for avg and if exist then fill the datas;
    const avgQuery = aggregateQry.avg;
    if (avgQuery) {
        if (getDataType(avgQuery) === DATA_TYPE.String) {
            for (index in datas) {
                const sumForAvg = datas[index]["sum(" + avgQuery + ")"],
                    countForAvg = datas[index]["count(" + avgQuery + ")"];
                datas[index]["avg(" + avgQuery + ")"] = sumForAvg / countForAvg;
                if (aggregateQry.count !== avgQuery) {
                    delete datas[index]["count(" + avgQuery + ")"];
                }
                if (aggregateQry.sum !== avgQuery) {
                    delete datas[index]["sum(" + avgQuery + ")"];
                }
            }
        }
        else {
            const isCountTypeString = getDataType(aggregateQry.count) === DATA_TYPE.String;
            const isSumTypeString = getDataType(aggregateQry.sum) === DATA_TYPE.String;
            for (index in datas) {
                for (const column in avgQuery as any) {
                    const avgColumn = avgQuery[column],
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
