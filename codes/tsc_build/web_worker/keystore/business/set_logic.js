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
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";
var Set = /** @class */ (function (_super) {
    __extends(Set, _super);
    function Set(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        try {
            _this._query = query;
            _this._onSuccess = onSuccess;
            _this._onError = onError;
        }
        catch (ex) {
            console.error(ex);
        }
        return _this;
    }
    Set.prototype.execute = function () {
        var _this = this;
        var updateIfExistElseInsert = function () {
            var cursor_request = _this._objectStore.index(QueryExecutor._columnName).openCursor(IDBKeyRange.only(_this._query[QueryExecutor._columnName]));
            cursor_request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    cursor.update(_this._query);
                }
                else {
                    insertData();
                }
            };
            cursor_request.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        var insertData = function () {
            var add_result = _this._objectStore.add(_this._query);
            add_result.onerror = function (e) {
                _this._errorOccured = true;
                _this.onErrorOccured(e);
            };
        };
        this.initTransaction();
        updateIfExistElseInsert();
    };
    Set.prototype.initTransaction = function () {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    };
    Set.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false && this._onSuccess) {
            this._onSuccess(null);
        }
    };
    return Set;
}(Base));
export { Set };
//# sourceMappingURL=set_logic.js.map