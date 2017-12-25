namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class Instance extends Where {
                constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
                    super();
                    try {
                        this._onSuccess = onSuccess;
                        this._onError = onError;
                        this.checkSchema(query.Set, query.In);
                        if (!this._errorOccured) {
                            this._query = query;
                            var that = this;
                            var createTransaction = function () {
                                that._transaction = db_connection.transaction([query.In], "readwrite");
                                that._objectStore = that._transaction.objectStore(query.In);
                                that._transaction.oncomplete = function (e) {
                                    that.onTransactionCompleted();
                                };
                                (that._transaction as any).ontimeout = that.onTransactionTimeout;
                            };

                            if (query.Where) {
                                if (query.Where.Or) {
                                    this.executeOrLogic();
                                }
                                else {
                                    createTransaction();
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                createTransaction();
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        else {
                            this.onErrorOccured(this._error, true);
                        }
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.In });
                    }
                }

                protected onTransactionCompleted = function () {
                    this._onSuccess(this._rowAffected);
                };

                private createtransactionForOrLogic = function (query) {
                    var that = this;
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.In], "readwrite");
                        this._transaction.oncomplete = function (e) {
                            that.onTransactionCompleted();
                        };
                        this._transaction.ontimeout = this.onTransactionCompleted;
                        this._objectStore = this._transaction.objectStore(query.In);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                };

                private executeOrLogic = function () {
                    var that = this,
                        select_object = new Select.Instance({
                            From: this._query.In,
                            Where: this._query.Where
                        } as ISelect, function (results: any[]) {
                            var key = that.getPrimaryKey(that._query.In),
                                in_query = [],
                                where_qry = {};
                            results.forEach(function (value) {
                                in_query.push(value[key]);
                            });
                            where_qry[key] = { In: in_query };
                            that.createtransactionForOrLogic({
                                In: that._query.In,
                                Where: where_qry,
                                Set: that._query.Set
                            });
                        }, this.OnError);
                };

                private checkSchema(suppliedValue, tableName: string) {
                    if (suppliedValue) {
                        var current_table: Table = this.getTable(tableName),
                            that = this;
                        if (current_table) {
                            var onValidationError = function (err: ErrorType, details: any) {
                                that._errorOccured = true;
                                that._error = Utils.getError(err, details);
                            };
                            // loop through table column and find data is valid
                            current_table._columns.every(function (column: Model.Column) {
                                if (!that._errorOccured) {
                                    if (column._name in suppliedValue) {
                                        var executeCheck = function (value) {
                                            // check not null schema
                                            if (column._notNull && isNull(value)) {
                                                onValidationError(ErrorType.NullValue, { ColumnName: column._name });
                                            }

                                            // check datatype
                                            if (column._dataType) {
                                                var type = typeof value;
                                                if (type !== column._dataType) {
                                                    if (type !== 'object') {
                                                        onValidationError(ErrorType.BadDataType,
                                                            { ColumnName: column._name }
                                                        );
                                                    }
                                                    else {
                                                        var allowed_prop = ['+', '-', '*', '/'];
                                                        for (var prop in value) {
                                                            if (allowed_prop.indexOf(prop) < 0) {
                                                                onValidationError(
                                                                    ErrorType.BadDataType,
                                                                    { ColumnName: column._name }
                                                                );
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        executeCheck(suppliedValue[column._name]);
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                        }
                        else {
                            var error = Utils.getError(ErrorType.TableNotExist, { TableName: tableName });
                            throwError(Error);
                        }
                    }
                    else {
                        this._errorOccured = true;
                    }
                }
            }
        }
    }
}
