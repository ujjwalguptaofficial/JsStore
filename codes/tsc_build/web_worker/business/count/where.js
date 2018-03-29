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
import { Like } from "./like_logic";
var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeWhereLogic = function (column, value, op) {
        value = op ? value[op] : value;
        var cursor_request, cursor;
        if (this._checkFlag) {
            cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this._whereChecker.check(cursor.value)) {
                        ++this._resultCount;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            if (this._objectStore.count) {
                cursor_request = this._objectStore.index(column).count(this.getKeyRange(value, op));
                cursor_request.onsuccess = function () {
                    this._resultCount = cursor_request.result;
                    this.onQueryFinished();
                }.bind(this);
            }
            else {
                cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
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
            }
        }
        cursor_request.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
    };
    return Where;
}(Like));
export { Where };
//# sourceMappingURL=where.js.map