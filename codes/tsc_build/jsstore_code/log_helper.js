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
            case Error_Type.WorkerNotSupplied:
                err_msg = "Worker object is not passed in instance constructor";
                break;
            case Error_Type.IndexedDbUndefined:
                err_msg = "Browser does not support indexeddb";
                break;
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