module JsStore {
    export module Business {
        export module Select {
            export class GroupByHelper extends Where {
                constructor() {
                    super();
                }

                private executeAggregateGroupBy = function () {
                    var GrpQry = this.Query.GroupBy,
                        IsGrpQryString = typeof GrpQry == 'string' ? true : false,
                        Datas = this.Results,
                        lookupObject = {};
                    //assign aggregate and free aggregate memory
                    var AggregateQry = this.Query.Aggregate;
                    this.Query.Aggregate = undefined;
                    //free results memory
                    this.Results = undefined;
                    var Index, GrpColumn;
                    var calculateAggregate = function () {
                        for (var prop in AggregateQry) {
                            switch (prop) {
                                case 'Count':
                                    var getCount = function (aggrColumn) {
                                        var Value = lookupObject[Datas[Index][GrpColumn]];
                                        //get old value
                                        Value = Value ? Value["Count(" + aggrColumn + ")"] : 0;
                                        //add with old value if data exist
                                        Value += Datas[Index][aggrColumn] ? 1 : 0;
                                        return Value;
                                    }
                                    if (typeof AggregateQry[prop] == 'string') {
                                        var AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Count(" + AggrColumn + ")"] = getCount(AggrColumn);
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            var AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Count(" + AggrColumn + ")"] = getCount(AggrColumn);
                                        }
                                    }
                                    break;
                                case 'Max':
                                    var getMax = function (aggrColumn) {
                                        var Value = lookupObject[Datas[Index][GrpColumn]];
                                        //get old value
                                        Value = Value ? Value["Max(" + aggrColumn + ")"] : 0;
                                        //compare between old value and new value
                                        return Value > Number(Datas[Index][aggrColumn]) ? Value : Datas[Index][aggrColumn];
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        var AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Max(" + AggrColumn + ")"] = getMax(AggrColumn);
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            var AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Max(" + AggrColumn + ")"] = getMax(AggrColumn);
                                        }
                                    }
                                    break;
                                case 'Min':
                                    var getMin = function (aggrColumn) {
                                        var Value = lookupObject[Datas[Index][GrpColumn]];
                                        //get old value
                                        Value = Value ? Value["Min(" + aggrColumn + ")"] : 0;
                                        //compare between old value and new value
                                        return Value < Number(Datas[Index][aggrColumn]) ? Value : Datas[Index][aggrColumn];
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        var AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Min(" + AggrColumn + ")"] = getMin(AggrColumn);
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            var AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Min(" + AggrColumn + ")"] = getMin(AggrColumn);
                                        }
                                    }
                                    break;
                                case 'Sum':
                                    var getSum = function (aggrColumn) {
                                        var Value = lookupObject[Datas[Index][GrpColumn]];
                                        //get old value
                                        Value = Value ? Value["Sum(" + aggrColumn + ")"] : 0;
                                        return Value + Number(Datas[Index][aggrColumn]);
                                    }
                                    if (typeof AggregateQry[prop] == 'string') {
                                        var AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Sum(" + AggrColumn + ")"] = getSum(AggrColumn);
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            var AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Sum(" + AggrColumn + ")"] = getSum(AggrColumn);
                                        }
                                    }
                                    break;
                                case 'Avg':
                                    var getAvg = function (aggrColumn) {
                                        var Value = lookupObject[Datas[Index][GrpColumn]];
                                        //get old value
                                        Value = Value ? Value["Sum(" + aggrColumn + ")"] : 0;
                                        return (Value + Number(Datas[Index][aggrColumn])) / Datas.length;
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        var AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Avg(" + AggrColumn + ")"] = getAvg(AggrColumn);
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            var AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Avg(" + AggrColumn + ")"] = getAvg(AggrColumn);
                                        }
                                    }
                                    break;
                            }
                        }
                    }

                    if (IsGrpQryString) {
                        GrpColumn = GrpQry;
                        for (Index in Datas) {
                            calculateAggregate();
                            lookupObject[Datas[Index][GrpColumn]] = Datas[Index];
                        }
                    }
                    else {
                        for (Index in Datas) {
                            for (var column in GrpQry) {
                                GrpColumn = GrpQry[column];
                                calculateAggregate();
                                lookupObject[Datas[Index][GrpColumn]] = Datas[Index];
                            }
                        }

                    }

                    //free datas memory
                    Datas = [];
                    for (var i in lookupObject) {
                        Datas.push(lookupObject[i]);
                    }
                    this.Results = Datas;
                };

                private executeSimpleGroupBy = function (key) {
                    var Datas = this.Results,
                        lookupObject = {};
                    //free results memory
                    this.Results = undefined;
                    for (var i in Datas) {
                        lookupObject[Datas[i][key]] = Datas[i];
                    }
                    //free datas memory
                    Datas = [];
                    for (i in lookupObject) {
                        Datas.push(lookupObject[i]);
                    }
                    this.Results = Datas;
                };
            }
        }
    }
}