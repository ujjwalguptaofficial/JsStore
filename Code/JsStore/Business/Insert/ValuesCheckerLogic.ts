namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class ValuesChecker {
                _table: Table;
                _values: any[];
                _error: IError;
                _onFinish: (isError: boolean) => void;
                _valueCheckerObj: ValueChecker;

                constructor(table: Table, values: any[]) {
                    this._table = table;
                    this._values = values;
                }

                public checkAndModifyValues(onFinish: (isError: boolean) => void) {
                    this._onFinish = onFinish;
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
                        this._valueCheckerObj = new ValueChecker(this._table, auto_inc_values);
                        this.startChecking();
                    }.bind(this), function (err) {
                        this._error = err;
                        this._onFinish(true);
                    }.bind(this));

                }

                private startChecking() {
                    var is_error: boolean = false;
                    this._values.every(function (item) {
                        is_error = this._valueCheckerObj.checkAndModifyValue(item);
                        return !is_error;
                    }, this);
                    if (is_error) {
                        this._error = this._valueCheckerObj._error;
                        this._onFinish(true);
                    }
                    else {
                        for (var prop in this._valueCheckerObj._autoIncrementValue) {
                            var auto_increment_key =
                                "JsStore_" + active_db._name + "_" + this._table._name + "_" + prop + "_Value";
                            KeyStore.set(auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
                        }
                        KeyStore.get('dumy_key', function (val) {
                            this._onFinish(false);
                        }.bind(this),
                            function (err) {
                                this._error = err;
                                this._onFinish(true);
                            }.bind(this));
                    }
                }
            }
        }
    }
}