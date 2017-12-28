namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class ValuesChecker {
                _table: Table;
                _values: any[];
                _index: number = 0;
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
                    var row_value = this._values[this._index];
                    if (row_value) {
                        var values_checker_obj = new ValueChecker(this._table, function () {
                            this._values[this._index++] = values_checker_obj._value;
                            this.checkRowValue();
                        }.bind(this), function (err: IError) {
                            this._error = err;
                            this.onFinish(true);
                        }.bind(this));
                        values_checker_obj.checkAndModifyValue(row_value);
                    }
                    else {
                        this.onFinish(false);
                    }
                };
            }
        }
    }
}