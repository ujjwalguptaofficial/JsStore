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
                            var createTransaction = function () {
                                this._transaction = db_connection.transaction([query.In], "readwrite");
                                this._objectStore = this._transaction.objectStore(query.In);
                                this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                                (this._transaction as any).ontimeout = this.onTransactionTimeout;
                            }.bind(this);

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
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: query.In });
                    }
                }

                protected onTransactionCompleted = function () {
                    this._onSuccess(this._rowAffected);
                };

                private createtransactionForOrLogic = function (query) {
                    this._query = query;
                    try {
                        this._transaction = db_connection.transaction([query.In], "readwrite");
                        this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                        this._transaction.ontimeout = this.onTransactionTimeout.bind(this);
                        this._objectStore = this._transaction.objectStore(query.In);
                        this.goToWhereLogic();
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: query.From });
                    }
                };

                private executeOrLogic = function () {
                    var select_object = new Select.Instance({
                        From: this._query.In,
                        Where: this._query.Where
                    } as ISelect, function (results: any[]) {
                        var key = this.getPrimaryKey(this._query.In),
                            in_query = [],
                            where_qry = {};
                        results.forEach(function (value) {
                            in_query.push(value[key]);
                        });
                        where_qry[key] = { In: in_query };
                        this.createtransactionForOrLogic({
                            In: this._query.In,
                            Where: where_qry,
                            Set: this._query.Set
                        });
                    }.bind(this), this.OnError);
                };

                private checkSchema(suppliedValue, tableName: string) {
                    if (typeof suppliedValue === 'object') {
                        var current_table: Table = this.getTable(tableName);
                        if (current_table) {
                            var onValidationError = function (err: Error_Type, details: any) {
                                this._errorOccured = true;
                                this._error = new Error(err, details);
                            }.bind(this);
                            // loop through table column and find data is valid
                            current_table._columns.every(function (column: Model.Column) {
                                if (!this._errorOccured) {
                                    if (column._name in suppliedValue) {
                                        var executeCheck = function (value) {
                                            // check not null schema
                                            if (column._notNull && isNull(value)) {
                                                onValidationError(
                                                    Error_Type.NullValue, { ColumnName: column._name }
                                                );
                                            }

                                            // check datatype
                                            if (column._dataType) {
                                                var type = typeof value;
                                                if (type !== column._dataType) {
                                                    if (type !== 'object') {
                                                        onValidationError(Error_Type.BadDataType,
                                                            { ColumnName: column._name }
                                                        );
                                                    }
                                                    else {
                                                        var allowed_prop = ['+', '-', '*', '/'];
                                                        for (var prop in value) {
                                                            if (allowed_prop.indexOf(prop) < 0) {
                                                                onValidationError(
                                                                    Error_Type.BadDataType,
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
                            }, this);
                        }
                        else {
                            this._error = new Error(Error_Type.TableNotExist, { TableName: tableName }).get();
                            this._errorOccured = true;
                        }
                    }
                    else {
                        this._error = new Error(Error_Type.NotObject).get();
                        this._errorOccured = true;
                    }
                }
            }
        }
    }
}
