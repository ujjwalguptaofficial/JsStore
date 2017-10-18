module JsStore {
    export module Business {
        export module Select {
            export class GroupByHelper extends Where {
                constructor() {
                    super();
                }

                private executeAggregateGroupBy = function (key = this.Query.GroupBy) {
                    var Datas = this.Results,
                        lookupObject = {};
                    var Results = [];
                    //free results memory
                    this.Results = undefined;
                    for (var i in Datas) {
                        for (var prop in this.Query.Aggregate) {
                            switch (prop) {
                                case 'Count':
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        var Key = this.Query.Aggregate[prop],
                                            Value = lookupObject[Datas[i][key]];
                                        Value = Value ? Value["Count(" + Key + ")"] : 0;
                                        Value += Datas[i][Key] ? 1 : 0;
                                        Datas[i]["Count(" + Key + ")"] = Value;
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var item in this.Query.Aggregate[prop]) {
                                            var Key = this.Query.Aggregate[prop][item],
                                                Value = lookupObject[Datas[i]["Count(" + Key + ")"]];
                                            Value = Value ? Value : 0;
                                            Value += Datas[i][Key] ? 1 : 0;
                                            lookupObject[Datas[i]["Count(" + Key + ")"]] = Value;
                                        }
                                    }
                                    break;
                                case 'Max':
                                    var getMax = function (key) {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result = Result > Datas[i][Key] ? Result : Datas[i][Key];
                                        };
                                        return Result;
                                    }
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        var Key = this.Query.Aggregate[prop];
                                        Results["Max(" + Key + ")"] = getMax(Key);
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var item in this.Query.Aggregate[prop]) {
                                            var Key = this.Query.Aggregate[prop][key];
                                            Results["Max(" + Key + ")"] = getMax(Key);
                                        }
                                    }
                                    break;
                                case 'Min':
                                    var getMin = function (key) {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result = Result < Datas[i][Key] ? Result : Datas[i][Key];
                                        };
                                        return Result;
                                    }
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        var Key = this.Query.Aggregate[prop];
                                        Results["Min(" + Key + ")"] = getMin(Key);
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var item in this.Query.Aggregate[prop]) {
                                            var Key = this.Query.Aggregate[prop][key];
                                            Results["Min(" + Key + ")"] = getMin(Key);
                                        }
                                    }
                                    break;
                                case 'Sum':
                                    var getSum = function (key) {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result += Datas[i][Key];
                                        };
                                        return Result;
                                    }
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        var Key = this.Query.Aggregate[prop];
                                        Results["Sum(" + Key + ")"] = getSum(Key);
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var item in this.Query.Aggregate[prop]) {
                                            var Key = this.Query.Aggregate[prop][key];
                                            Results["Sum(" + Key + ")"] = getSum(Key);
                                        }
                                    }
                                    break;
                                case 'Avg':
                                    var getAvg = function (key) {
                                        var Result = 0;
                                        for (var i in Datas) {
                                            Result += Datas[i][Key];
                                        };
                                        return Result / Datas.length;
                                    }
                                    if (typeof this.Query.Aggregate[prop] == 'string') {
                                        var Key = this.Query.Aggregate[prop];
                                        Results["Avg(" + Key + ")"] = getAvg(Key);
                                    }
                                    else if (Array.isArray(this.Query.Aggregate[prop])) {
                                        for (var item in this.Query.Aggregate[prop]) {
                                            var Key = this.Query.Aggregate[prop][key];
                                            Results["Avg(" + Key + ")"] = getAvg(Key);
                                        }
                                    }
                                    break;
                            }
                        }
                        lookupObject[Datas[i][key]] = Datas[i];
                    }
                    //free datas memory
                    Datas = [];
                    for (i in lookupObject) {
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