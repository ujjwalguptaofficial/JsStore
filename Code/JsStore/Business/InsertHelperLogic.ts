namespace JsStore {
    export namespace Business {
        export class InsertHelper {
            _table: Table;
            _values: any[];
            _valueIndex: number = 0;
            _errorOccured: boolean = false;
            _error: Error;
            onFinish: (isError: boolean) => void;

            constructor(table: Table, values: any[]) {
                this._table = table;
                this._values = values;
            }

            public checkAndModifyValues = function (onFinish: (isError: boolean) => void) {
                this.onFinish = onFinish;
                this.checkRowValue();
            };

            private checkRowValue = function () {
                var value = this._values[this._valueIndex];
                if (value) {
                    this.checkAndModifyValue(value);
                }
                else {
                    this.onFinish(false);
                }
            };

            private checkAndModifyValue = function (value) {
                var column_index = 0;
                var checkAndModifyColumn = function (column: Column) {
                    if (this._errorOccured === true) {
                        this.onFinish(true);
                    }
                    else {
                        var checkNotNullAndDataType = function () {
                            // check not null schema
                            if (column._notNull && isNull(value[column._name])) {
                                this.onValidationError(Error_Type.NullValue, { ColumnName: column._name });
                            }
                            // check datatype
                            else if (column._dataType && typeof value[column._name] !== column._dataType) {
                                this.onValidationError(Error_Type.BadDataType, { ColumnName: column._name });
                            }
                            checkAndModifyColumn(this._table._columns[column_index++]);
                        }.bind(this);
                        var saveAutoIncrementValue = function () {
                            var auto_increment_key =
                                "JsStore_" + active_db._name + "_" + this._table._name + "_" + column._name + "_Value";
                            KeyStore.get(
                                auto_increment_key,
                                function (columnValue: number) {
                                    value[column._name] = ++columnValue;
                                    KeyStore.set(
                                        auto_increment_key,
                                        columnValue,
                                        checkNotNullAndDataType);
                                }
                            );
                        }.bind(this);
                        if (column) {
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
                            this._values[this._valueIndex++] = value;
                            this.checkRowValue();
                        }
                    }
                }.bind(this);
                checkAndModifyColumn(this._table._columns[column_index++]);
            };

            private onValidationError = function (error: Error_Type, details: any) {
                this._errorOccured = true;
                this._error = new Error(error, details).get();
            };
        }
    }
}
