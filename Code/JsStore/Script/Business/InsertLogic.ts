module JsStore {
    export module Business {
        export class Insert extends Base {
            ValuesAffected = [];
            Query: IInsert;
            ValuesIndex = 0;
            Table: Model.ITable;
            public onTransactionCompleted = function () {
                if (this.OnSuccess != null) {
                    this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
                }
            }

            private checkAndModifyValues = function (callBack) {
                var That = this,
                    checkInternal = function (value) {
                        if (value) {
                            That.checkAndModifyValue(value, function () {
                                if (!That.ErrorOccured) {
                                    checkInternal(That.Query.Values[That.ValuesIndex++]);
                                }
                                else {
                                    That.onErrorOccured(That.Error, true);
                                }
                            });
                        }
                        else {
                            callBack();
                        }
                    };
                checkInternal(this.Query.Values[this.ValuesIndex++]);
            }

            private insertData = function () {
                var That = this,
                    IsReturn = this.Query.Return,
                    insertDataintoTable = function (value) {
                        if (value) {
                            var AddResult = That.ObjectStore.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            }
                            AddResult.onsuccess = function (e) {
                                if (IsReturn) {
                                    That.ValuesAffected.push(value);
                                }
                                else {
                                    ++That.RowAffected;
                                }
                                insertDataintoTable(That.Query.Values[That.ValuesIndex++]);
                            }
                        }
                    }

                That.ValuesIndex = 0;
                That.Transaction = DbConnection.transaction([That.Query.Into], "readwrite");
                That.ObjectStore = That.Transaction.objectStore(That.Query.Into);
                That.Transaction.oncomplete = function (e) {
                    That.onTransactionCompleted();
                }
                insertDataintoTable(this.Query.Values[That.ValuesIndex++]);
            }

            constructor(query: IInsert, onSuccess: Function, onError: Function) {
                super();
                try {
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this;
                    this.Table = this.getTable(query.Into);
                    if (this.Table) {
                        if (!this.Query.SkipExtraCheck) {
                            this.checkAndModifyValues(function () {
                                That.insertData();
                            });
                        }
                        else {
                            this.insertData();
                        }
                    }
                    else {
                        var Error = Utils.getError(ErrorType.TableNotExist, { TableName: query.Into })
                        throwError(Error);
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }

            /**
             * check the value based on defined schema and modify or create the value
             * 
             * @private
             * @param {any} value 
             * @param {string} tableName 
             * 
             * @memberof InsertLogic
             */
            private checkAndModifyValue(value, callBack: Function) {
                var That = this,
                    TableName = this.Table.Name,
                    Index = 0,
                    checkAndModifyInternal = function (column) {
                        if (column) {
                            var onValidationError = function (error: ErrorType, details: any) {
                                That.ErrorOccured = true;
                                That.Error = Utils.getError(error, details);
                            },
                                CheckNotNullAndDataType = function () {
                                    //check not null schema
                                    if (column.NotNull && isNull(value[column.Name])) {
                                        onValidationError(ErrorType.NullValue, { ColumnName: column.Name });
                                    }
                                    //check datatype
                                    else if (column.DataType && typeof value[column.Name] != column.DataType) {
                                        onValidationError(ErrorType.BadDataType, { ColumnName: column.Name });
                                    }
                                    checkAndModifyInternal(That.Table.Columns[Index++]);
                                };
                            if (!That.ErrorOccured) {
                                //check auto increment scheme
                                if (column.AutoIncrement) {
                                    KeyStore.get("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue: number) {
                                        value[column.Name] = ++columnValue;
                                        KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", columnValue);
                                        CheckNotNullAndDataType();
                                    });
                                }
                                else if (column.Default && value[column.Name] == null) { //check Default Schema
                                    value[column.Name] = column.Default;
                                    CheckNotNullAndDataType();
                                }
                                else {
                                    CheckNotNullAndDataType();
                                }
                            }
                            else {
                                callBack();
                            }
                        }
                        else {
                            callBack();
                        }
                    }
                checkAndModifyInternal(That.Table.Columns[Index++]);
            }
        }
    }
}
