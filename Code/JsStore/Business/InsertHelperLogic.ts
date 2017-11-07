module JsStore {
    export module Business {
        export class InsertHelper extends Base {
            ValuesAffected = [];
            Query: IInsert;

            public onTransactionCompleted = function () {
                this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
            }

            protected checkModifyInsertValues = function (table, values) {
                var That = this,
                    ValueIndex = 0,
                    Value,
                    TableName = table.Name,
                    checkDatas = function () {
                        Value = values[ValueIndex++];
                        checkInternal();
                    },
                    checkInternal = function () {
                        if (Value) {
                            checkAndModifyValue();
                        }
                        else {
                            That.insertData(values);
                        }
                    },
                    checkAndModifyValue = function () {
                        var Index = 0,
                            checkAndModifyColumn = function (column) {
                                if (column) {
                                    var onValidationError = function (error: ErrorType, details: any) {
                                        That.ErrorOccured = true;
                                        That.Error = Utils.getError(error, details);
                                    },
                                        CheckNotNullAndDataType = function () {
                                            //check not null schema
                                            if (column.NotNull && isNull(Value[column.Name])) {
                                                onValidationError(ErrorType.NullValue, { ColumnName: column.Name });
                                            }
                                            //check datatype
                                            else if (column.DataType && typeof Value[column.Name] != column.DataType) {
                                                onValidationError(ErrorType.BadDataType, { ColumnName: column.Name });
                                            }
                                            checkAndModifyColumn(table.Columns[Index++]);
                                        };
                                    if (!That.ErrorOccured) {
                                        //check auto increment scheme
                                        if (column.AutoIncrement) {
                                            KeyStore.get("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue: number) {
                                                Value[column.Name] = ++columnValue;
                                                KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", columnValue);
                                                CheckNotNullAndDataType();
                                            });
                                        }
                                        else if (column.Default && Value[column.Name] == null) { //check Default Schema
                                            Value[column.Name] = column.Default;
                                            CheckNotNullAndDataType();
                                        }
                                        else {
                                            CheckNotNullAndDataType();
                                        }
                                    }
                                    else {
                                        That.onErrorOccured(That.Error, true);
                                    }
                                }
                                else {
                                    checkDatas();
                                }
                            }
                        checkAndModifyColumn(table.Columns[Index++]);
                    }
                checkDatas();
            }
        }
    }
}
