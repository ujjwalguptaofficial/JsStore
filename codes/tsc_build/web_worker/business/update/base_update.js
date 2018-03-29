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
import { Base } from "../base";
import { IdbHelper } from "../idb_helper";
export var updateValue = function (suppliedValue, storedValue) {
    for (var key in suppliedValue) {
        if (typeof suppliedValue[key] !== 'object') {
            storedValue[key] = suppliedValue[key];
        }
        else {
            for (var op in suppliedValue[key]) {
                switch (op) {
                    case '+':
                        storedValue[key] += suppliedValue[key][op];
                        break;
                    case '-':
                        storedValue[key] -= suppliedValue[key][op];
                        break;
                    case '*':
                        storedValue[key] *= suppliedValue[key][op];
                        break;
                    case '/':
                        storedValue[key] /= suppliedValue[key][op];
                        break;
                    default: storedValue[key] = suppliedValue[key];
                }
                break;
            }
        }
    }
    return storedValue;
};
var BaseUpdate = /** @class */ (function (_super) {
    __extends(BaseUpdate, _super);
    function BaseUpdate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._checkFlag = false;
        return _this;
    }
    BaseUpdate.prototype.initTransaction = function () {
        IdbHelper.createTransaction([this._query.in], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(this._query.in);
    };
    BaseUpdate.prototype.onQueryFinished = function () {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    };
    BaseUpdate.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    };
    return BaseUpdate;
}(Base));
export { BaseUpdate };
//# sourceMappingURL=base_update.js.map