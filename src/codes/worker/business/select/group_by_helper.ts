import { Where } from "./where";

export class GroupByHelper extends Where {
    constructor() {
        super();
    }

    protected processGroupBy() {
        var grp_qry = this._query.GroupBy,
            datas = this._results,
            look_up_obj = {};
        // free results memory
        this._results = this._query.GroupBy = undefined;
        if (typeof grp_qry === 'string') {
            for (var i in datas) {
                look_up_obj[datas[i][grp_qry]] = datas[i];
            }
        }
        else {
            var obj_key;
            for (var i in datas) {
                obj_key = "";
                for (var column in grp_qry) {
                    obj_key += datas[i][grp_qry[column]];
                }
                look_up_obj[obj_key] = datas[i];
            }
        }
        // free datas memory
        datas = [];
        for (i in look_up_obj) {
            datas.push(look_up_obj[i]);
        }
        this._results = datas;
    }

    protected executeAggregateGroupBy() {
        var grp_qry = this._query.GroupBy,
            datas = this._results,
            look_up_obj = {},
            // assign aggregate and free aggregate memory
            aggregate_qry = this._query.aggregate;
        this._query.aggregate = undefined;
        // free results memory
        this._results = undefined;

        var index, obj_Key, value, aggr_column;
        var calculateAggregate = () => {
            for (var prop in aggregate_qry) {
                switch (prop) {
                    case 'Count':
                        var getCount = () => {
                            value = look_up_obj[obj_Key];
                            // get old value
                            value = value ? value["Count(" + aggr_column + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggr_column] ? 1 : 0;
                            return value;
                        };
                        if (typeof aggregate_qry[prop] === 'string') {
                            aggr_column = aggregate_qry[prop];
                            datas[index]["Count(" + aggr_column + ")"] = getCount();
                        }
                        else if (Array.isArray(aggregate_qry[prop])) {
                            for (var item in aggregate_qry[prop]) {
                                aggr_column = aggregate_qry[prop][item];
                                datas[index]["Count(" + aggr_column + ")"] = getCount();
                            }
                        }
                        break;
                    case 'max':
                        var getMax = () => {
                            value = look_up_obj[obj_Key];
                            // get old value
                            value = value ? value["max(" + aggr_column + ")"] : 0;
                            datas[index][aggr_column] = datas[index][aggr_column] ?
                                datas[index][aggr_column] : 0;
                            // compare between old value and new value
                            return value > datas[index][aggr_column] ? value : datas[index][aggr_column];
                        };

                        if (typeof aggregate_qry[prop] === 'string') {
                            aggr_column = aggregate_qry[prop];
                            datas[index]["max(" + aggr_column + ")"] = getMax();
                        }
                        else if (Array.isArray(aggregate_qry[prop])) {
                            for (var item in aggregate_qry[prop]) {
                                aggr_column = aggregate_qry[prop][item];
                                datas[index]["max(" + aggr_column + ")"] = getMax();
                            }
                        }
                        break;
                    case 'min':
                        var getMin = () => {
                            value = look_up_obj[obj_Key];
                            // get old value
                            value = value ? value["min(" + aggr_column + ")"] : Infinity;
                            datas[index][aggr_column] = datas[index][aggr_column] ?
                                datas[index][aggr_column] : Infinity;
                            // compare between old value and new value
                            return value < datas[index][aggr_column] ? value : datas[index][aggr_column];
                        };

                        if (typeof aggregate_qry[prop] === 'string') {
                            aggr_column = aggregate_qry[prop];
                            datas[index]["min(" + aggr_column + ")"] = getMin();
                        }
                        else if (Array.isArray(aggregate_qry[prop])) {
                            for (var item in aggregate_qry[prop]) {
                                aggr_column = aggregate_qry[prop][item];
                                datas[index]["min(" + aggr_column + ")"] = getMin();
                            }
                        }
                        break;
                    case 'Sum':
                        var getSum = () => {
                            value = look_up_obj[obj_Key];
                            // get old value
                            value = value ? value["Sum(" + aggr_column + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggr_column] ? datas[index][aggr_column] : 0;
                            return value;
                        };
                        if (typeof aggregate_qry[prop] === 'string') {
                            aggr_column = aggregate_qry[prop];
                            datas[index]["Sum(" + aggr_column + ")"] = getSum();
                        }
                        else if (Array.isArray(aggregate_qry[prop])) {
                            for (var item in aggregate_qry[prop]) {
                                aggr_column = aggregate_qry[prop][item];
                                datas[index]["Sum(" + aggr_column + ")"] = getSum();
                            }
                        }
                        break;
                    case 'Avg':
                        var getAvg = () => {
                            value = look_up_obj[obj_Key];
                            // get old sum value
                            var sum_of_column = value ? value["Sum(" + aggr_column + ")"] : 0;
                            // add with old value if data exist
                            sum_of_column += datas[index][aggr_column] ? datas[index][aggr_column] : 0;
                            datas[index]["Sum(" + aggr_column + ")"] = sum_of_column;
                            // get old count value
                            value = value ? value["Count(" + aggr_column + ")"] : 0;
                            // add with old value if data exist
                            value += datas[index][aggr_column] ? 1 : 0;
                            datas[index]["Count(" + aggr_column + ")"] = value;
                        };

                        if (typeof aggregate_qry[prop] === 'string') {
                            aggr_column = aggregate_qry[prop];
                            getAvg();
                        }
                        else if (Array.isArray(aggregate_qry[prop])) {
                            for (var item in aggregate_qry[prop]) {
                                aggr_column = aggregate_qry[prop][item];
                                getAvg();
                            }
                        }
                        break;
                }
            }
        };

        if (typeof grp_qry === 'string') {
            for (index in datas) {
                obj_Key = datas[index][grp_qry];
                calculateAggregate();
                look_up_obj[obj_Key] = datas[index];
            }
        }
        else {
            for (index in datas) {
                obj_Key = "";
                for (var column in grp_qry) {
                    obj_Key += datas[index][grp_qry[column]];
                }
                calculateAggregate();
                look_up_obj[obj_Key] = datas[index];
            }

        }
        // free datas memory
        datas = [];
        for (var i in look_up_obj) {
            datas.push(look_up_obj[i]);
        }
        // Checking for avg and if exist then fill the datas;
        if (aggregate_qry.Avg) {
            if (typeof aggregate_qry.Avg === 'string') {
                for (index in datas) {
                    var sum_for_avg = datas[index]["Sum(" + aggregate_qry.Avg + ")"],
                        count_for_avg = datas[index]["Count(" + aggregate_qry.Avg + ")"];
                    datas[index]["Avg(" + aggregate_qry.Avg + ")"] = sum_for_avg / count_for_avg;
                    if (aggregate_qry.Count !== aggregate_qry.Avg) {
                        delete datas[index]["Count(" + aggregate_qry.Avg + ")"];
                    }
                    if (aggregate_qry.Sum !== aggregate_qry.Avg) {
                        delete datas[index]["Sum(" + aggregate_qry.Avg + ")"];
                    }
                }
            }
            else {
                var is_count_type_string = typeof aggregate_qry.Count,
                    is_sum_type_string = typeof aggregate_qry.Count;
                for (index in datas) {
                    for (var column in aggregate_qry.Avg) {
                        var avg_column = aggregate_qry.Avg[column],
                            sum = datas[index]["Sum(" + avg_column + ")"],
                            count = datas[index]["Count(" + avg_column + ")"];
                        datas[index]["Avg(" + avg_column + ")"] = sum / count;

                        if (is_count_type_string) {
                            if (aggregate_qry.Count !== avg_column) {
                                delete datas[index]["Count(" + avg_column + ")"];
                            }
                            else if (aggregate_qry.Count.indexOf(avg_column) === -1) {
                                delete datas[index]["Count(" + avg_column + ")"];
                            }
                        }

                        if (is_sum_type_string) {
                            if (aggregate_qry.Sum !== avg_column) {
                                delete datas[index]["Sum(" + avg_column + ")"];
                            }
                            else if (aggregate_qry.Sum.indexOf(avg_column) === -1) {
                                delete datas[index]["Sum(" + avg_column + ")"];
                            }
                        }
                    }
                }
            }
        }
        this._results = datas;
    }
}