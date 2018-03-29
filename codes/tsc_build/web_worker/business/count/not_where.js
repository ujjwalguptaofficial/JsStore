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
import { BaseCount } from "./base_count";
var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        if (this._objectStore.count) {
            var count_request = this._objectStore.count();
            count_request.onsuccess = function () {
                this._resultCount = count_request.result;
                this.onQueryFinished();
            }.bind(this);
            count_request.onerror = function (e) {
                this._errorOccured = true;
                this.onErrorOccured(e);
            }.bind(this);
        }
        else {
            var cursor, cursor_request = this._objectStore.openCursor();
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    ++this._resultCount;
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
            cursor_request.onerror = function (e) {
                this._errorOccured = true;
                this.onErrorOccured(e);
            }.bind(this);
        }
    };
    return NotWhere;
}(BaseCount));
export { NotWhere };
//# sourceMappingURL=not_where.js.map