var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Where } from "./where";
import * as Select from '../select/index';
import { LogHelper } from "../../log_helper";
import { Error_Type } from "../../enums";
import { IdbHelper } from '../idb_helper';
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onSuccess = onSuccess;
        _this._query = query;
        return _this;
    }
    Instance.prototype.execute = function () {
        var _this = this;
        if (this.isTableExist(this._query.from)) {
            try {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.where.Or || Array.isArray(this._query.where)) {
                        var select_object = new Select.Instance(this._query, function (results) {
                            _this._resultCount = results.length;
                            _this.onTransactionCompleted();
                        }, this._onError);
                        select_object.execute();
                    }
                    else {
                        this.initTransaction();
                        this.goToWhereLogic();
                    }
                }
                else {
                    this.initTransaction();
                    this.executeWhereUndefinedLogic();
                }
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._query.from });
            }
        }
        else {
            this._errorOccured = true;
            this.onErrorOccured(new LogHelper(Error_Type.TableNotExist, { TableName: this._query.From }).get(), true);
        }
    };
    Instance.prototype.initTransaction = function () {
        IdbHelper.createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = IdbHelper._transaction.objectStore(this._query.From);
    };
    Instance.prototype.onQueryFinished = function () {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    };
    Instance.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._resultCount);
        }
    };
    return Instance;
}(Where));
export { Instance };
//# sourceMappingURL=instance.js.map