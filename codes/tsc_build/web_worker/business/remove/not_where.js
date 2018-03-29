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
import { BaseRemove } from "./base_remove";
var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        var _this = this;
        var cursor, cursor_request = this._objectStore.openCursor();
        cursor_request.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                ++_this._rowAffected;
                cursor.continue();
            }
            else {
                _this.onQueryFinished();
            }
        };
        cursor_request.onerror = function (e) {
            _this._errorOccured = true;
            _this.onErrorOccured(e);
        };
    };
    return NotWhere;
}(BaseRemove));
export { NotWhere };
//# sourceMappingURL=not_where.js.map