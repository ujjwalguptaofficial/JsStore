module JsStore {
    export module Business {
        export class BaseSelectLogic extends BaseLogic {
            Results = [];
            SendResultFlag: Boolean = true;
            Sorted: boolean = false;
            protected getKeyRange = function (whereIn: IWhereIn) {
                var KeyRange: IDBKeyRange;
                switch (whereIn.Op) {
                    case '-': KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, true, true); break;
                    case '=-': KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, false, true); break;
                    case '-=': KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, true, false); break;
                    case '=-=': KeyRange = IDBKeyRange.bound(whereIn.Value.Low, whereIn.Value.High, false, false); break;
                    case '>': KeyRange = IDBKeyRange.lowerBound(whereIn.Value, true); break;
                    case '>=': KeyRange = IDBKeyRange.lowerBound(whereIn.Value); break;
                    case '<': KeyRange = IDBKeyRange.upperBound(whereIn.Value, true); break;
                    case '<=': KeyRange = IDBKeyRange.upperBound(whereIn.Value); break;
                    case '~': break;//IDBKeyRange.bound(whereIn.Value, whereIn.Value + '\uffff', false, false); break;
                    case '=': KeyRange = IDBKeyRange.only(whereIn.Value); break;
                    default: this.ErrorOccured = true; UtilityLogic.getError(ErrorType.InvalidOp, true, { Op: whereIn.Op });
                }
                return KeyRange;

            }

            protected filterResultBasedOnOp = function (whereIn: IWhereIn) {
                var That = this,
                    Column = whereIn.Column,
                    Value = whereIn.Value,
                    ValuesFound = [],
                    executeGreaterThan = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] > Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    },
                    executeLessThan = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] > Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    },
                    executeContains = function () {
                        if (typeof That.Results[0][Column] == 'string') {
                            Value = (Value as any).toLowerCase();
                            That.Results.forEach(function (item) {
                                if (item[Column].toLowerCase().indexOf(Value) >= 0) {
                                    ValuesFound.push(item);
                                }
                            });
                            That.Results = ValuesFound;
                        }
                        else {
                            executeEqualTo();
                        }

                    },
                    executeEqualTo = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] == Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    },
                    executeBetweenIn = function () {
                        var LowValue = Value.Low, Highvalue = Value.High;
                        if (whereIn.Op == '-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] > LowValue && item[Column] < Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] <= Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] < Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }
                        else if (whereIn.Op == '=-=') {
                            That.Results.forEach(function (item) {
                                if (item[Column] >= LowValue && item[Column] <= Highvalue) {
                                    ValuesFound.push(item);
                                }
                            });
                        }

                        That.Results = ValuesFound;
                    },
                    executeGreaterThanEqual = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] >= Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    },
                    executeLessThanEqual = function () {
                        That.Results.forEach(function (item) {
                            if (item[Column] <= Value) {
                                ValuesFound.push(item);
                            }
                        });
                        That.Results = ValuesFound;
                    };
                switch (whereIn.Op) {
                    case '-':
                    case '=-':
                    case '-=':
                    case '=-=': executeBetweenIn(); break;
                    case '>': executeGreaterThan(); break;
                    case '>=': executeGreaterThanEqual(); break;
                    case '<': executeLessThan(); break;
                    case '<=': executeLessThanEqual(); break;
                    case '~': executeContains(); break;
                    case '=': executeEqualTo(); break;
                    default: this.ErrorOccured = true; UtilityLogic.getError(ErrorType.InvalidOp, true, { Op: whereIn.Op });
                }
            }

        }
    }
}
