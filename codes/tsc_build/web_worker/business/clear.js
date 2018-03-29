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
import { Base } from "./base";
import { IdbHelper } from './idb_helper';
import * as KeyStore from "../keystore/index";
var Clear = /** @class */ (function (_super) {
    __extends(Clear, _super);
    function Clear(tableName, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._query = tableName;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Clear.prototype.execute = function () {
        var _this = this;
        IdbHelper.createTransaction([this._query], function () {
            if (_this._errorOccured === false) {
                _this._onSuccess();
            }
        });
        var clear_request = IdbHelper._transaction.objectStore(this._query).clear();
        clear_request.onsuccess = function (e) {
            var current_table = _this.getTable(_this._query);
            current_table._columns.forEach(function (column) {
                if (column._autoIncrement) {
                    KeyStore.set("JsStore_" + IdbHelper._activeDb._name + "_" + _this._query + "_" + column._name + "_Value", 0);
                }
            });
        };
        clear_request.onerror = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
    };
    return Clear;
}(Base));
export { Clear };
//# sourceMappingURL=clear.js.map