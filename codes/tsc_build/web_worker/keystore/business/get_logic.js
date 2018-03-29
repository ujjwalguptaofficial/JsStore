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
var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get(key, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._key = key;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Get.prototype.execute = function () {
        var _this = this;
        var getData = function (column, value) {
            var cursor_request = _this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = function (e) {
                this._errorOccured = true;
                this.on_errorOccured(e);
            }.bind(_this);
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    this._results = cursor.value['Value'];
                }
            }.bind(_this);
        };
        this.initTransaction();
        getData(QueryExecutor._columnName, this._key);
    };
    Get.prototype.initTransaction = function () {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    };
    Get.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._results);
        }
    };
    return Get;
}(Base));
export { Get };
//# sourceMappingURL=get_logic.js.map