namespace JsStore {
    export namespace Business {
        export class Base extends BaseHelper {
            _error: IError;
            _errorOccured: boolean = false;
            _errorCount = 0;
            _rowAffected = 0;
            _onSuccess: (result?) => void;
            _onError: (err: IError) => void;
            _transaction: IDBTransaction;
            _objectStore: IDBObjectStore;
            _query;
            _sendResultFlag: boolean = true;

            protected onErrorOccured = function (e, customError = false) {
                ++this._errorCount;
                if (this._errorCount === 1) {
                    if (this._onError != null) {
                        if (!customError) {
                            var error = {
                                _message: (e as any).target.error.message,
                                _type: (e as any).target.error.name
                            } as IError;
                            this._onError(error);
                        }
                        else {
                            this._onError(e);
                        }
                        logError(Error);
                    }
                }
            };

            protected onTransactionTimeout = function (e) {
                console.error('transaction timed out');
            };

            protected onExceptionOccured = function (ex: DOMException, info) {
                switch (ex.name) {
                    case 'NotFoundError':
                        var error = new Error(Error_Type.TableNotExist, info);
                        this.onErrorOccured(error.get(), true);
                        break;
                    default: console.error(ex);
                }
            };

            /**
             * For matching the different column value existance
             * 
             * @protected
             * @param {any} rowValue 
             * @returns 
             * @memberof Base
             */
            protected checkForWhereConditionMatch(rowValue) {
                var where = this._query.Where,
                    status = true;
                var checkIn = function (column, value) {
                    var values = where[column].In;
                    for (var i = 0, length = values.length; i < length; i++) {
                        if (values[i] === value) {
                            status = true;
                            break;
                        }
                        else {
                            status = false;
                        }
                    }
                },
                    checkLike = function (column, value) {
                        var values = where[column].Like.split('%'),
                            comp_symbol: Occurence,
                            comp_value,
                            symbol_index;
                        if (values[1]) {
                            comp_value = values[1];
                            comp_symbol = values.length > 2 ? Occurence.Any : Occurence.Last;
                        }
                        else {
                            comp_value = values[0];
                            comp_symbol = Occurence.First;
                        }
                        value = value.toLowerCase();

                        switch (comp_symbol) {
                            case Occurence.Any:
                                symbol_index = value.indexOf(comp_value.toLowerCase());
                                if (symbol_index < 0) {
                                    status = false;
                                } break;
                            case Occurence.First:
                                symbol_index = value.indexOf(comp_value.toLowerCase());
                                if (symbol_index > 0 || symbol_index < 0) {
                                    status = false;
                                } break;
                            default:
                                symbol_index = value.lastIndexOf(comp_value.toLowerCase());
                                if (symbol_index < value.length - comp_value.length) {
                                    status = false;
                                }
                        }
                    },
                    checkComparisionOp = function (column, value, symbol) {
                        var compare_value = where[column][symbol];
                        switch (symbol) {
                            // greater than
                            case '>': if (value <= compare_value) {
                                status = false;
                            } break;
                            // less than
                            case '<': if (value >= compare_value) {
                                status = false;
                            } break;
                            // less than equal
                            case '<=': if (value > compare_value) {
                                status = false;
                            } break;
                            // greather than equal
                            case '>=': if (value < compare_value) {
                                status = false;
                            } break;
                            // between
                            case '-': if (value < compare_value.Low || value > compare_value.High) {
                                status = false;
                            } break;
                        }
                    };
                for (var columnValue in where) {
                    var column_value = where[columnValue];
                    if (status) {
                        if (typeof column_value === 'object') {
                            for (var key in column_value) {
                                if (status) {
                                    switch (key) {
                                        case 'In': checkIn(columnValue, rowValue[columnValue]); break;
                                        case 'Like': checkLike(columnValue, rowValue[columnValue]); break;
                                        case '-':
                                        case '>':
                                        case '<':
                                        case '>=':
                                        case '<=':
                                            checkComparisionOp(columnValue, rowValue[columnValue], key);
                                            break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        else {
                            if (column_value !== rowValue[columnValue]) {
                                status = false;
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                return status;
            }

            protected goToWhereLogic = function () {
                var column = getObjectFirstKey(this._query.Where);
                if (this._query.IgnoreCase === true) {
                    this._query.Where = this.makeQryInCaseSensitive(this._query.Where);
                }
                if (this._objectStore.indexNames.contains(column)) {
                    var value = this._query.Where[column];
                    if (typeof value === 'object') {
                        this._checkFlag = Boolean(
                            Object.keys(value).length > 1 ||
                            Object.keys(this._query.Where).length > 1
                        );
                        var key = getObjectFirstKey(value);
                        switch (key) {
                            case 'Like': {
                                var filter_value = value.Like.split('%');
                                if (filter_value[1]) {
                                    if (filter_value.length > 2) {
                                        this.executeLikeLogic(column, filter_value[1], Occurence.Any);
                                    }
                                    else {
                                        this.executeLikeLogic(column, filter_value[1], Occurence.Last);
                                    }
                                }
                                else {
                                    this.executeLikeLogic(column, filter_value[0], Occurence.First);
                                }
                            } break;
                            case 'In':
                                this.executeInLogic(column, value['In']);
                                break;
                            case '-':
                            case '>':
                            case '<':
                            case '>=':
                            case '<=':
                                this.executeWhereLogic(column, value, key);
                                break;
                            case 'Aggregate': break;
                            default: this.executeWhereLogic(column, value);
                        }
                    }
                    else {
                        this._checkFlag = Boolean(Object.keys(this._query.Where).length > 1);
                        this.executeWhereLogic(column, value);
                    }
                }
                else {
                    this._errorOccured = true;
                    this.Error = new Error(Error_Type.ColumnNotExist, { ColumnName: column });
                    this.Error.throw();
                }
            };

            protected makeQryInCaseSensitive = function (qry) {
                var results = [],
                    column_value,
                    key_value;
                for (var column in qry) {
                    column_value = qry[column];
                    if (typeof column_value === 'object') {
                        for (var key in column_value) {
                            key_value = column_value[key];
                            switch (key) {
                                case WhereQryOption.In:
                                    results = results.concat(this.getAllCombinationOfWord(key_value, true));
                                    break;
                                case WhereQryOption.Like:
                                    break;
                                default:
                                    results = results.concat(this.getAllCombinationOfWord(key_value));
                            }
                        }
                        qry[column]['In'] = results;
                    }
                    else {
                        results = results.concat(this.getAllCombinationOfWord(column_value));
                        qry[column] = {
                            In: results
                        };
                    }
                }
                return qry;
            };
        }
    }
}
