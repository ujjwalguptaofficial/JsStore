namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class ValuesChecker {
                _table: Table;
                _values: any[];
                _index: number = 0;
                _error: Error;
                onFinish: (isError: boolean) => void;
                _valueCheckerObj: ValueChecker;

                constructor(table: Table, values: any[]) {
                    this._table = table;
                    this._values = values;
                    this._valueCheckerObj = new ValueChecker(
                        this._table,
                        this.onFinishValueChecking.bind(this),
                        function (err: IError) {
                            this._error = err;
                            this.onFinish(true);
                        }.bind(this)
                    );
                }

                public checkAndModifyValues(onFinish: (isError: boolean) => void) {
                    this.onFinish = onFinish;
                    var auto_inc_columns = this._table._columns.filter(function (col) {
                        return col._autoIncrement;
                    });
                    var auto_inc_values = {};
                    auto_inc_columns.forEach(function (column) {
                        var auto_increment_key =
                            "JsStore_" + active_db._name + "_" + this._table._name + "_" + column._name + "_Value";
                        KeyStore.get(auto_increment_key, function (val) {
                            auto_inc_values[column._name] = val;
                        });
                    }, this);
                    KeyStore.get('dumy_key', function (val) {
                        this._valueCheckerObj._autoIncrementValue = auto_inc_values;
                        this.checkRowValue();
                    }.bind(this));

                }

                private onFinishValueChecking() {
                    this._values[this._index++] = this._valueCheckerObj._value;
                    this.checkRowValue();
                }

                private checkRowValue() {
                    var row_value = this._values[this._index];
                    if (row_value) {
                        this._valueCheckerObj.checkAndModifyValue(row_value);
                    }
                    else {
                        for (var prop in this._valueCheckerObj._autoIncrementValue) {
                            var auto_increment_key =
                                "JsStore_" + active_db._name + "_" + this._table._name + "_" + prop + "_Value";
                            KeyStore.set(auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
                        }
                        KeyStore.get('dumy_key', function (val) {
                            this.onFinish(false);
                        }.bind(this));

                    }
                }
            }
        }
    }
}