import { Error_Type } from "./enums";
import { Config } from "./config";
var LogHelper = /** @class */ (function () {
    function LogHelper(type, info) {
        if (info === void 0) { info = null; }
        this._type = type;
        this._info = info;
        this._message = this.getMsg();
    }
    LogHelper.prototype.throw = function () {
        throw this.get();
    };
    LogHelper.log = function (msg) {
        if (Config._isLogEnabled) {
            console.log(msg);
        }
    };
    LogHelper.prototype.logError = function () {
        console.error(this.get());
    };
    LogHelper.prototype.logWarning = function () {
        console.warn(this.get());
    };
    LogHelper.prototype.get = function () {
        return {
            _message: this._message,
            _type: this._type
        };
    };
    LogHelper.prototype.getMsg = function () {
        var err_msg;
        switch (this._type) {
            case Error_Type.NotArray:
                err_msg = "Supplied value is not an array";
                break;
            case Error_Type.UndefinedColumn:
                err_msg = "Column is undefined in Where";
                break;
            case Error_Type.UndefinedValue:
                err_msg = "Value is undefined in Where";
                break;
            case Error_Type.UndefinedColumnName:
                err_msg = "Column name is undefined '" + this._info['TableName'] + "'";
                break;
            case Error_Type.UndefinedDbName:
                err_msg = "Database name is not supplied";
                break;
            case Error_Type.UndefinedColumnValue:
                err_msg = "Column value is undefined";
                break;
            case Error_Type.NoValueSupplied:
                err_msg = "No value supplied";
                break;
            case Error_Type.InvalidOp:
                err_msg = "Invalid Op Value '" + this._info['Op'] + "'";
                break;
            case Error_Type.ColumnNotExist:
                err_msg = "Column '" + this._info['ColumnName'] + "' does not exist";
                break;
            case Error_Type.EnableSearchOff:
                err_msg = "Search is turned off for the Column '" + this._info['ColumnName'] + "'";
                break;
            case Error_Type.NullValue:
                err_msg = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                break;
            case Error_Type.BadDataType:
                err_msg = "Supplied value for column '" + this._info['ColumnName'] +
                    "' does not have valid type";
                break;
            case Error_Type.NextJoinNotExist:
                err_msg = "Next join details not supplied";
                break;
            case Error_Type.TableNotExist:
                err_msg = "Table '" + this._info['TableName'] + "' does not exist";
                break;
            case Error_Type.DbNotExist:
                err_msg = "Database '" + this._info['DbName'] + "' does not exist";
                break;
            case Error_Type.NotObject:
                err_msg = "supplied value is not object";
                break;
            case Error_Type.InvalidOp:
                err_msg = "Invalid Config '" + this._info['Config'] + " '";
            case Error_Type.DbBlocked:
                err_msg = "database is blocked, cant be deleted right now";
            default:
                err_msg = this._message;
                break;
        }
        return err_msg;
    };
    return LogHelper;
}());
export { LogHelper };
//# sourceMappingURL=log_helper.js.map