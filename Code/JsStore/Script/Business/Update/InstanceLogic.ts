module JsStore {
    export module Business {
        export module Update {
            export class Instance extends Where {

                public onTransactionCompleted = function () {
                    if (this.OnSuccess != null) {
                        this.OnSuccess(this.RowAffected);
                    }
                }

                constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                    super();
                    try {
                        var That = this;
                        this.checkSchema(query.Set, query.In);
                        if (!this.ErrorOccured) {
                            this.Query = query;
                            this.OnSuccess = onSuccess;
                            this.OnError = onError;
                            this.Transaction = DbConnection.transaction([query.In], "readwrite");
                            this.ObjectStore = this.Transaction.objectStore(query.In);
                            var That = this;
                            this.Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted();
                            };
                            (<any>this.Transaction).ontimeout = That.onTransactionTimeout;

                            if (query.Where == undefined) {
                                this.executeWhereUndefinedLogic();
                            }
                            else {
                                this.executeWhereLogic();
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
                    var CurrentTable: Table = this.getTable(tableName),
                        That = this;

                    //loop through table column and find data is valid
                    CurrentTable.Columns.every(function (column: Column) {
                        if (!That.ErrorOccured) {
                            if (column.Name in suppliedValue) {
                                var executeCheck = function (value) {
                                    //check not null schema
                                    if (column.NotNull && That.isNull(value)) {
                                        That.ErrorOccured = true;
                                        That.Error = Utils.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                                    }

                                    //check datatype
                                    if (column.DataType && typeof value != column.DataType) {
                                        That.ErrorOccured = true;
                                        That.Error = Utils.getError(ErrorType.BadDataType, false, { ColumnName: column.Name });
                                    }
                                };
                                executeCheck(suppliedValue[column.Name]);
                                return true;
                            }
                        }
                        else {
                            return false;
                        }
                    });
                }
            }
        }
    }
}
