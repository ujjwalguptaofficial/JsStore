namespace JsStore {
    export namespace Business {
        export class InsertHelper extends Base {
            _valuesAffected = [];
            _query: IInsert;

            public onTransactionCompleted = function () {
                this.OnSuccess(this._query.Return ? this._valuesAffected : this.RowAffected);
            };

            protected checkModifyInsertValues = function (table: Table, values) {
                var that = this,
                    value_index = 0,
                    value,
                    table_name = table._name,
                    checkDatas = function () {
                        value = values[value_index++];
                        checkInternal();
                    },
                    checkInternal = function () {
                        if (value) {
                            checkAndModifyValue();
                        }
                        else {
                            that.insertData(values);
                        }
                    };
                var checkAndModifyValue = function () {
                    var index = 0,
                        onValidationError = function (error: ErrorType, details: any) {
                            that.ErrorOccured = true;
                            that.Error = Utils.getError(error, details);
                        };
                    var checkAndModifyColumn = function (column: Column) {
                        var checkNotNullAndDataType = function () {
                            // check not null schema
                            if (column._notNull && isNull(value[column._name])) {
                                onValidationError(ErrorType.NullValue, { ColumnName: column._name });
                            }
                            // check datatype
                            else if (column._dataType && typeof value[column._name] !== column._dataType) {
                                onValidationError(ErrorType.BadDataType, { ColumnName: column._name });
                            }
                            checkAndModifyColumn(table._columns[index++]);
                        };
                        var saveAutoIncrementValue = function () {
                            KeyStore.get(
                                "JsStore_" + active_db._name + "_" + table_name + "_" + column._name + "_Value",
                                function (columnValue: number) {
                                    value[column._name] = ++columnValue;
                                    KeyStore.set(
                                        "JsStore_" + active_db._name + "_" + table_name + "_" + column._name + "_Value",
                                        columnValue
                                    );
                                    checkNotNullAndDataType();
                                }
                            );
                        };

                        if (column) {
                            if (!that.ErrorOccured) {
                                // check auto increment scheme
                                if (column._autoIncrement) {
                                    saveAutoIncrementValue();
                                }
                                // check Default Schema
                                else if (column._default && isNull(value[column._name])) {
                                    value[column._name] = column._default;
                                    checkNotNullAndDataType();
                                }
                                else {
                                    checkNotNullAndDataType();
                                }
                            }
                            else {
                                that.onErrorOccured(that.Error, true);
                            }
                        }
                        else {
                            checkDatas();
                        }
                    };
                    checkAndModifyColumn(table._columns[index++]);
                };
                checkDatas();
            };
        }
    }
}
