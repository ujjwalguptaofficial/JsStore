import { Util } from "../../util";
import { Error_Type } from "../../enums";
import { LogHelper } from "../../log_helper";
var ValueChecker = /** @class */ (function () {
    function ValueChecker(table, autoIncrementValue) {
        this._errorOccured = false;
        this._autoIncrementValue = {};
        this._table = table;
        this._autoIncrementValue = autoIncrementValue;
    }
    ValueChecker.prototype.checkAndModifyValue = function (value) {
        this._value = value;
        this._table._columns.every(function (column) {
            this.checkAndModifyColumnValue(column, value);
            return !this._errorOccured;
        }, this);
        return this._errorOccured;
    };
    ValueChecker.prototype.checkNotNullAndDataType = function (column) {
        // check not null schema
        if (column._notNull && Util.isNull(this._value[column._name])) {
            this.onValidationError(Error_Type.NullValue, { ColumnName: column._name });
        }
        else if (column._dataType && !Util.isNull(this._value[column._name]) &&
            Util.getType(this._value[column._name]) !== column._dataType) {
            this.onValidationError(Error_Type.BadDataType, { ColumnName: column._name });
        }
    };
    ValueChecker.prototype.checkAndModifyColumnValue = function (column) {
        // check auto increment scheme
        if (column._autoIncrement) {
            this._value[column._name] = ++this._autoIncrementValue[column._name];
        }
        else if (column._default && Util.isNull(this._value[column._name])) {
            this._value[column._name] = column._default;
        }
        this.checkNotNullAndDataType(column);
    };
    ValueChecker.prototype.onValidationError = function (error, details) {
        this._errorOccured = true;
        this._error = new LogHelper(error, details).get();
    };
    return ValueChecker;
}());
export { ValueChecker };
//# sourceMappingURL=value_checker.js.map