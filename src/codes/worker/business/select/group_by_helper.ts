import { Where } from "./where";
import { DATA_TYPE } from "../../enums";

export class GroupByHelper extends Where {
    constructor() {
        super();
    }

    protected processGroupBy() {
        const grpQry = this.query.GroupBy;
        let datas = this.results;
        const lookUpObj = {};
        // free results memory
        this.results = this.query.GroupBy = undefined;
        if (typeof grpQry === 'string') {
            for (const i of Object.keys(datas)) {
                lookUpObj[datas[i][grpQry]] = datas[i];
            }
        }
        else {
            let objKey;
            for (const i of Object.keys(datas)) {
                objKey = "";
                for (const column of Object.keys(grpQry)) {
                    objKey += datas[i][grpQry[column]];
                }
                lookUpObj[objKey] = datas[i];
            }
        }
        // free datas memory
        datas = [];
        for (const i of Object.keys(lookUpObj)) {
            datas.push(lookUpObj[i]);
        }
        this.results = datas;
    }

    protected executeAggregateGroupBy() {
        const grpQry = this.query.GroupBy;
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
        let aggrColumn;
        const calculateAggregate = () => {
            for (const prop of Object.keys(aggregateQry)) {
                switch (prop) {
                    case 'Count':
                        const getCount = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["Count(" + aggrColumn + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggrColumn] ? 1 : 0;
                            return value;
                        };
                        if (typeof aggregateQry[prop] === 'string') {
                            aggrColumn = aggregateQry[prop];
                            datas[index]["Count(" + aggrColumn + ")"] = getCount();
                        }
                        else if (Array.isArray(aggregateQry[prop])) {
                            for (const item in aggregateQry[prop]) {
                                aggrColumn = aggregateQry[prop][item];
                                datas[index]["Count(" + aggrColumn + ")"] = getCount();
                            }
                        }
                        break;
                    case 'max':
                        const getMax = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["max(" + aggrColumn + ")"] : 0;
                            datas[index][aggrColumn] = datas[index][aggrColumn] ?
                                datas[index][aggrColumn] : 0;
                            // compare between old value and new value
                            return value > datas[index][aggrColumn] ? value : datas[index][aggrColumn];
                        };

                        if (typeof aggregateQry[prop] === 'string') {
                            aggrColumn = aggregateQry[prop];
                            datas[index]["max(" + aggrColumn + ")"] = getMax();
                        }
                        else if (Array.isArray(aggregateQry[prop])) {
                            for (const item in aggregateQry[prop]) {
                                aggrColumn = aggregateQry[prop][item];
                                datas[index]["max(" + aggrColumn + ")"] = getMax();
                            }
                        }
                        break;
                    case 'min':
                        const getMin = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["min(" + aggrColumn + ")"] : Infinity;
                            datas[index][aggrColumn] = datas[index][aggrColumn] ?
                                datas[index][aggrColumn] : Infinity;
                            // compare between old value and new value
                            return value < datas[index][aggrColumn] ? value : datas[index][aggrColumn];
                        };

                        if (typeof aggregateQry[prop] === 'string') {
                            aggrColumn = aggregateQry[prop];
                            datas[index]["min(" + aggrColumn + ")"] = getMin();
                        }
                        else if (Array.isArray(aggregateQry[prop])) {
                            for (const item in aggregateQry[prop]) {
                                aggrColumn = aggregateQry[prop][item];
                                datas[index]["min(" + aggrColumn + ")"] = getMin();
                            }
                        }
                        break;
                    case 'Sum':
                        const getSum = () => {
                            value = lookUpObj[objKey];
                            // get old value
                            value = value ? value["Sum(" + aggrColumn + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggrColumn] ? datas[index][aggrColumn] : 0;
                            return value;
                        };
                        if (typeof aggregateQry[prop] === 'string') {
                            aggrColumn = aggregateQry[prop];
                            datas[index]["Sum(" + aggrColumn + ")"] = getSum();
                        }
                        else if (this.getType(aggregateQry[prop]) === DATA_TYPE.Array) {
                            for (const item in aggregateQry[prop]) {
                                aggrColumn = aggregateQry[prop][item];
                                datas[index]["Sum(" + aggrColumn + ")"] = getSum();
                            }
                        }
                        break;
                    case 'Avg':
                        const getAvg = () => {
                            value = lookUpObj[objKey];
                            // get old sum value
                            let sumOfColumn = value ? value["Sum(" + aggrColumn + ")"] : 0;
                            // add with old value if data exist
                            sumOfColumn += datas[index][aggrColumn] ? datas[index][aggrColumn] : 0;
                            datas[index]["Sum(" + aggrColumn + ")"] = sumOfColumn;
                            // get old count value
                            value = value ? value["Count(" + aggrColumn + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggrColumn] ? 1 : 0;
                            datas[index]["Count(" + aggrColumn + ")"] = value;
                        };

                        if (typeof aggregateQry[prop] === 'string') {
                            aggrColumn = aggregateQry[prop];
                            getAvg();
                        }
                        else if (this.getType(aggregateQry[prop]) === DATA_TYPE.Array) {
                            for (const item of Object.keys(aggregateQry[prop])) {
                                aggrColumn = aggregateQry[prop][item];
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
        if (aggregateQry.Avg) {
            if (this.getType(aggregateQry.Avg) === DATA_TYPE.String) {
                for (index in datas) {
                    const sumForAvg = datas[index]["Sum(" + aggregateQry.Avg + ")"],
                        countForAvg = datas[index]["Count(" + aggregateQry.Avg + ")"];
                    datas[index]["Avg(" + aggregateQry.Avg + ")"] = sumForAvg / countForAvg;
                    if (aggregateQry.Count !== aggregateQry.Avg) {
                        delete datas[index]["Count(" + aggregateQry.Avg + ")"];
                    }
                    if (aggregateQry.Sum !== aggregateQry.Avg) {
                        delete datas[index]["Sum(" + aggregateQry.Avg + ")"];
                    }
                }
            }
            else {
                const isCountTypeString = this.getType(aggregateQry.Count) === DATA_TYPE.String;
                const isSumTypeString = this.getType(aggregateQry.Count) === DATA_TYPE.String;
                for (index in datas) {
                    for (const column in aggregateQry.Avg) {
                        const avgColumn = aggregateQry.Avg[column],
                            sum = datas[index]["Sum(" + avgColumn + ")"],
                            count = datas[index]["Count(" + avgColumn + ")"];
                        datas[index]["Avg(" + avgColumn + ")"] = sum / count;

                        if (isCountTypeString) {
                            if (aggregateQry.Count !== avgColumn) {
                                delete datas[index]["Count(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.Count.indexOf(avgColumn) === -1) {
                                delete datas[index]["Count(" + avgColumn + ")"];
                            }
                        }

                        if (isSumTypeString) {
                            if (aggregateQry.Sum !== avgColumn) {
                                delete datas[index]["Sum(" + avgColumn + ")"];
                            }
                            else if (aggregateQry.Sum.indexOf(avgColumn) === -1) {
                                delete datas[index]["Sum(" + avgColumn + ")"];
                            }
                        }
                    }
                }
            }
        }
        this.results = datas;
    }
}