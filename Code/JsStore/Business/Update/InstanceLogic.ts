namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class Instance extends Where {
                constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
                    super();
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        this.checkSchema(query.Set, query.In);
                        if (!this.ErrorOccured) {
                            this.Query = query;
                            var that = this;
                            var createTransaction = function () {
                                that.Transaction = db_connection.transaction([query.In], "readwrite");
                                that.ObjectStore = that.Transaction.objectStore(query.In);
                                that.Transaction.oncomplete = function (e) {
                                    that.onTransactionCompleted();
                                };
                                (that.Transaction as any).ontimeout = that.onTransactionTimeout;
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
                            this.onErrorOccured(this.Error, true);
                        }
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.In });
                    }
                }

                protected onTransactionCompleted = function () {
                    this.OnSuccess(this.RowAffected);
                };

                private createtransactionForOrLogic = function (query) {
                    var that = this;
                    this.Query = query;
                    try {
                        this.Transaction = db_connection.transaction([query.In], "readwrite");
                        this.Transaction.oncomplete = function (e) {
                            that.onTransactionCompleted();
                        };
                        this.Transaction.ontimeout = this.onTransactionCompleted;
                        this.ObjectStore = this.Transaction.objectStore(query.In);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                };

                private executeOrLogic = function () {
                    var that = this,
                        select_object = new Select.Instance({
                            From: this.Query.In,
                            Where: this.Query.Where
                        } as ISelect, function (results: any[]) {
                            var key = that.getPrimaryKey(that.Query.In),
                                in_query = [],
                                where_qry = {};
                            results.forEach(function (value) {
                                in_query.push(value[key]);
                            });
                            where_qry[key] = { In: in_query };
                            that.createtransactionForOrLogic({
                                In: that.Query.In,
                                Where: where_qry,
                                Set: that.Query.Set
                            });
                        }, this.OnError);
                };



                private checkSchema(suppliedValue, tableName: string) {
                    if (suppliedValue) {
                        var current_table: Table = this.getTable(tableName),
                            that = this;
                        if (current_table) {
                            var onValidationError = function (error: ErrorType, details: any) {
                                that.ErrorOccured = true;
                                that.Error = Utils.getError(error, details);
                            };
                            // loop through table column and find data is valid
                            current_table._columns.every(function (column: Model.Column) {
                                if (!that.ErrorOccured) {
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
                        this.ErrorOccured = true;
                    }
                }
            }
        }
    }
}
