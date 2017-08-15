module JsStore {
    export module Business {
        export class Base {
            Error: IError;
            ErrorOccured: boolean = false;
            ErrorCount = 0;
            RowAffected = 0;
            OnSuccess: Function;
            OnError: Function;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;
            Query;

            protected onErrorOccured = function (e, customError = false) {
                ++this.ErrorCount;
                if (this.ErrorCount == 1) {
                    if (this.OnError != null) {
                        if (!customError) {
                            this.OnError((e as any).target.error);
                        }
                        else {
                            this.OnError(e);
                        }
                    }
                }
            }

            protected onTransactionTimeout = function (e) {
                console.log('transaction timed out');
            }

            protected isNull = function (value) {
                return value == null || value.length == 0;
            }

            protected onExceptionOccured = function (ex: DOMException, info) {
                if (ex.name == "NotFoundError") {
                    Utils.getError(ErrorType.TableNotExist, true, info);
                }
                else {
                    console.error(ex);
                }
            }

            /**
            * For matching the different column value existance
            * 
            * @private
            * @param {any} where 
            * @param {any} value 
            * @returns 
            * 
            * @memberOf SelectLogic
            */
            protected checkForWhereConditionMatch(rowValue) {
                var Where = this.Query.Where,
                    Status = true;


                var checkIn = function (column, value) {
                    var Values = Where[column].In;
                    for (var i = 0, length = Values.length; i < length; i++) {
                        if (Values[i] == value) {
                            Status = true;
                            break;
                        }
                        else {
                            Status = false;
                        }
                    };
                },
                    checkLike = function (column, value) {
                        var Values = Where[column].Like.split('%'),
                            CompSymbol: Occurence,
                            CompValue,
                            SymbolIndex;
                        if (Values[1]) {
                            CompValue = Values[1];
                            CompSymbol = Values.length > 2 ? Occurence.Any : Occurence.Last;
                        }
                        else {
                            CompValue = Values[0];
                            CompSymbol = Occurence.First;
                        }
                        value = value.toLowerCase();
                        SymbolIndex = value.indexOf(CompValue.toLowerCase())
                        switch (CompSymbol) {
                            case Occurence.Any: if (SymbolIndex < 0) {
                                Status = false;
                            }; break;
                            case Occurence.First: if (SymbolIndex > 0 || SymbolIndex < 0) {
                                Status = false;
                            }; break;
                            default: if (SymbolIndex(CompValue) < value.length - 1) {
                                Status = false;
                            };
                        }
                    },
                    checkComparisionOp = function (column, value, symbol) {
                        var CompareValue = Where[column][symbol];
                        switch (symbol) {
                            //greater than
                            case '>': if (value <= CompareValue) {
                                Status = false;
                            }; break;
                            //less than
                            case '<': if (value >= CompareValue) {
                                Status = false;
                            }; break;
                            //less than equal
                            case '<=': if (value > CompareValue) {
                                Status = false;
                            }; break;
                            //greather than equal
                            case '<': if (value < CompareValue) {
                                Status = false;
                            }; break;
                            //between
                            case '-': if (value < CompareValue.Low || value > CompareValue.High) {
                                Status = false;
                            }; break;
                        }
                    }
                for (var Column in Where) {
                    var ColumnValue = Where[Column];
                    if (Status) {
                        var CompareValue = rowValue[Column];
                        if (typeof ColumnValue == 'string' && ColumnValue != CompareValue) {
                            Status = false;
                        }
                        else {
                            for (var key in ColumnValue) {
                                if (Status) {
                                    switch (key) {
                                        case 'In': checkIn(Column, rowValue[Column]); break;
                                        case 'Like': checkLike(Column, rowValue[Column]); break;
                                        case '-':
                                        case '>':
                                        case '<':
                                        case '>=':
                                        case '<=':
                                            checkComparisionOp(Column, rowValue[Column], key); break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                        }

                    }
                    else {
                        break;
                    }

                }
                return Status;
            }

            protected getTable = function (tableName: string) {
                var CurrentTable: Table,
                    That = this;
                ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                return CurrentTable;
            }

            protected getKeyRange = function (value, op) {
                var KeyRange: IDBKeyRange;
                switch (op) {
                    case '-': KeyRange = IDBKeyRange.bound(value.Low, value.High, false, false); break;
                    case '>': KeyRange = IDBKeyRange.lowerBound(value, true); break;
                    case '>=': KeyRange = IDBKeyRange.lowerBound(value); break;
                    case '<': KeyRange = IDBKeyRange.upperBound(value, true); break;
                    case '<=': KeyRange = IDBKeyRange.upperBound(value); break;
                    default: KeyRange = IDBKeyRange.only(value); break;
                }
                return KeyRange;

            }
        }
    }

}
