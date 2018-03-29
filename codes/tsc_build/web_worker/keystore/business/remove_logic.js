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
import { Base } from "./base_logic";
import { QueryExecutor } from "../query_executor";
import { IdbHelper } from "./idb_helper";
var Remove = /** @class */ (function (_super) {
    __extends(Remove, _super);
    function Remove(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._rowAffected = 0;
        _this._key = key;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Remove.prototype.execute = function () {
        this.initTransaction();
        var removeData = function (column, value) {
            var _this = this;
            var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++_this._rowAffected;
                    cursor.continue();
                }
            };
        }.bind(this);
        if (!this._errorOccured) {
            removeData(QueryExecutor._columnName, this._key);
        }
    };
    Remove.prototype.initTransaction = function () {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    };
    Remove.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    };
    return Remove;
}(Base));
export { Remove };
//# sourceMappingURL=remove_logic.js.map