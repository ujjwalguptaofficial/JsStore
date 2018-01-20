namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class ValueChecker {
                _table: Table;
                _value: object;
                _index: number;
                _errorOccured: boolean = false;
                _error: IError;
                _onFinish: () => void;
                _onError: (err: IError) => void;
                _autoIncrementValue = {};

                constructor(table: Table, onFinish: () => void, onError: (err: IError) => void) {
                    this._table = table;
                    this._onFinish = onFinish;
                    this._onError = onError;
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
                        this._onFinish();
                    }
                };

                private checkNotNullAndDataType(column: Column, value) {
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
                }

                private checkAndModifyColumnValue = function (column: Column, value) {
                    if (this._errorOccured === true) {
                        this._onError(this._error);
                    }
                    else {
                        // check auto increment scheme
                        if (column._autoIncrement) {
                            value[column._name] = this.getAutoIncrementValue(column._name);
                            this.checkNotNullAndDataType(column, value);
                        }
                        // check Default Schema
                        else if (column._default && isNull(value[column._name])) {
                            value[column._name] = column._default;
                            this.checkNotNullAndDataType(column, value);
                        }
                        else {
                            this.checkNotNullAndDataType(column, value);
                        }
                    }
                };

                private getAutoIncrementValue(columnName) {
                    return ++this._autoIncrementValue[columnName];
                }

                private onValidationError(error: Error_Type, details: any) {
                    this._errorOccured = true;
                    this._error = new Error(error, details).get();
                    this._onError(this._error);
                }
            }
        }
    }
}