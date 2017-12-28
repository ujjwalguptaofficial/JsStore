namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class ValueChecker {
                _table: Table;
                _value: object;
                _index: number;
                _errorOccured: boolean = false;
                _error: IError;
                onFinish: () => void;
                onError: (err: IError) => void;

                constructor(table: Table, onFinish: () => void, onError: (err: IError) => void) {
                    this._table = table;
                    this.onFinish = onFinish;
                    this.onError = onError;
                }

                public checkAndModifyValue = function (value) {
                    this._value = value;
                    this._index = 0;
                    this.checkColumnValue();
                };

                private checkColumnValue = function () {
                    var column = this._table._columns[this._index++];
                    if (column) {
                        this.checkAndModifyColumnValue(
                            column,
                            this._value
                        );
                    }
                    else {
                        this.onFinish();
                    }
                };

                private checkAndModifyColumnValue = function (column: Column, value) {
                    if (this._errorOccured === true) {
                        this.onError(this._error);
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
                            else { // check next column value
                                this.checkColumnValue();
                            }
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
                                        columnValue
                                    );
                                    checkNotNullAndDataType();
                                }
                            );
                        }.bind(this);

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
                };

                private onValidationError = function (error: Error_Type, details: any) {
                    this._errorOccured = true;
                    this._error = new Error(error, details).get();
                    this.onError(this._error);
                };
            }
        }
    }
}