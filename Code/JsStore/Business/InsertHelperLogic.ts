namespace JsStore {
    export namespace Business {
        export class InsertHelper extends Base {
            _valuesAffected = [];
            _query: IInsert;

            public onTransactionCompleted = function () {
                this._onSuccess(this._query.Return ? this._valuesAffected : this._rowAffected);
            };

            protected checkModifyInsertValues = function (table: Table, values) {
                var value_index = 0,
                    value,
                    table_name = table._name,
                    checkDatas = function () {
                        value = values[value_index++];
                        checkInternal();
                    }.bind(this),
                    checkInternal = function () {
                        if (value) {
                            checkAndModifyValue();
                        }
                        else {
                            this.insertData(values);
                        }
                    }.bind(this);
                var checkAndModifyValue = function () {
                    var index = 0,
                        onValidationError = function (error: Error_Type, details: any) {
                            this._errorOccured = true;
                            this.Error = new Error(error, details);
                        };
                    var checkAndModifyColumn = function (column: Column) {
                        var checkNotNullAndDataType = function () {
                            // check not null schema
                            if (column._notNull && isNull(value[column._name])) {
                                onValidationError(Error_Type.NullValue, { ColumnName: column._name });
                            }
                            // check datatype
                            else if (column._dataType && typeof value[column._name] !== column._dataType) {
                                onValidationError(Error_Type.BadDataType, { ColumnName: column._name });
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
                            if (!this._errorOccured) {
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
                                this.onErrorOccured(this.Error, true);
                            }
                        }
                        else {
                            checkDatas();
                        }
                    };
                    checkAndModifyColumn(table._columns[index++]);
                }.bind(this);
                checkDatas();
            };
        }
    }
}
