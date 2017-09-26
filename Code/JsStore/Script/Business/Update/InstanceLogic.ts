module JsStore {
    export module Business {
        export module Update {
            export class Instance extends Where {

                protected onTransactionCompleted = function () {
                    if (this.OnSuccess != null) {
                        this.OnSuccess(this.RowAffected);
                    }
                }

                private createtransactionForOrLogic = function (query) {
                    var That = this;
                    this.Query = query;
                    try {
                        this.Transaction = DbConnection.transaction([query.In], "readwrite");
                        this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        (<any>this.Transaction).ontimeout = That.onTransactionCompleted;
                        this.ObjectStore = this.Transaction.objectStore(query.In);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                }

                private executeOrLogic = function () {
                    var That = this;
                    new Select.Instance(<ISelect>{
                        From: this.Query.In,
                        Where: this.Query.Where
                    }, function (results: Array<any>) {
                        var Key = That.getPrimaryKey(That.Query.In),
                            InQuery = [],
                            WhereQry = {};
                        results.forEach(function (value) {
                            InQuery.push(value[Key]);
                        })
                        WhereQry[Key] = { In: InQuery };
                        That.createtransactionForOrLogic({
                            In: That.Query.In,
                            Where: WhereQry,
                            Set: That.Query.Set
                        })
                    }, this.OnError);
                }

                constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                    super();
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        this.checkSchema(query.Set, query.In);
                        if (!this.ErrorOccured) {
                            this.Query = query;
                            var That = this;
                            var createTransaction = function () {
                                That.Transaction = DbConnection.transaction([query.In], "readwrite");
                                That.ObjectStore = That.Transaction.objectStore(query.In);
                                That.Transaction.oncomplete = function (e) {
                                    That.onTransactionCompleted();
                                };
                                (<any>That.Transaction).ontimeout = That.onTransactionTimeout;
                            }

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

                private checkSchema(suppliedValue, tableName: string) {
                    if (suppliedValue) {
                        var CurrentTable: Table = this.getTable(tableName),
                            That = this;
                        if (CurrentTable) {
                            var onValidationError = function (error: ErrorType, details: any) {
                                That.ErrorOccured = true;
                                That.Error = Utils.getError(error, details);
                            }
                            //loop through table column and find data is valid
                            CurrentTable.Columns.every(function (column: Column) {
                                if (!That.ErrorOccured) {
                                    if (column.Name in suppliedValue) {
                                        var executeCheck = function (value) {
                                            //check not null schema
                                            if (column.NotNull && isNull(value)) {
                                                onValidationError(ErrorType.NullValue, { ColumnName: column.Name });
                                            }

                                            //check datatype
                                            if (column.DataType) {
                                                var Type = typeof value;
                                                if (Type != column.DataType) {
                                                    if (Type != 'object') {
                                                        onValidationError(ErrorType.BadDataType, { ColumnName: column.Name });
                                                    }
                                                    else {
                                                        var AllowedProp = ['+', '-', '*', '/'];
                                                        for (var prop in value) {
                                                            if (AllowedProp.indexOf(prop) < 0) {
                                                                onValidationError(ErrorType.BadDataType, { ColumnName: column.Name });
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        executeCheck(suppliedValue[column.Name]);
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                        }
                        else {
                            var Error = Utils.getError(ErrorType.TableNotExist, { TableName: tableName });
                            throwError(Error);
                        }
                    }
                    else {
                        this.ErrorOccured = true;
                        //execute onSuccess with supplying 0 as rows affected
                        this.OnSuccess(0);
                    }
                }
            }
        }
    }
}
