import { ValueChecker } from "./value_checker";
import { IdbHelper } from "../../index";
import * as KeyStore from "../../keystore/index";
var ValuesChecker = /** @class */ (function () {
    function ValuesChecker(table, values) {
        this._table = table;
        this._values = values;
    }
    ValuesChecker.prototype.checkAndModifyValues = function (onFinish) {
        var _this = this;
        this._onFinish = onFinish;
        var auto_inc_columns = this._table._columns.filter(function (col) {
            return col._autoIncrement;
        });
        var auto_inc_values = {};
        auto_inc_columns.forEach(function (column) {
            var auto_increment_key = "JsStore_" + IdbHelper._activeDb._name + "_" + _this._table._name + "_" + column._name + "_Value";
            KeyStore.get(auto_increment_key, function (val) {
                auto_inc_values[column._name] = val;
            });
        });
        KeyStore.get('dumy_key', function (val) {
            _this._valueCheckerObj = new ValueChecker(_this._table, auto_inc_values);
            _this.startChecking();
        }, function (err) {
            _this._error = err;
            _this._onFinish(true);
        });
    };
    ValuesChecker.prototype.startChecking = function () {
        var _this = this;
        var is_error = false;
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
                var auto_increment_key = "JsStore_" + IdbHelper._activeDb._name + "_" + this._table._name + "_" + prop + "_Value";
                KeyStore.set(auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
            }
            KeyStore.get('dumy_key', function (val) {
                _this._onFinish(false);
            }, function (err) {
                _this._error = err;
                _this._onFinish(true);
            });
        }
    };
    return ValuesChecker;
}());
export { ValuesChecker };
//# sourceMappingURL=values_checker.js.map