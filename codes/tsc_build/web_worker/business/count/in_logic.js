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
import { NotWhere } from "./not_where";
var In = /** @class */ (function (_super) {
    __extends(In, _super);
    function In() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    In.prototype.executeInLogic = function (column, values) {
        var cursor, column_store = this._objectStore.index(column), cursor_request, onCursorError = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
        if (this._checkFlag) {
            for (var i = 0, length = values.length; i < length; i++) {
                if (!this._errorOccured) {
                    cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this._whereChecker.check(cursor.value)) {
                                ++this._resultCount;
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                    cursor_request.onerror = onCursorError;
                }
            }
        }
        else {
            if (this._objectStore.count) {
                for (var i = 0, length = values.length; i < length; i++) {
                    if (!this._errorOccured) {
                        cursor_request = column_store.count(IDBKeyRange.only(values[i]));
                        cursor_request.onsuccess = function (e) {
                            this._resultCount += e.target.result;
                            if (i + 1 === length) {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                        cursor_request.onerror = onCursorError;
                    }
                }
            }
            else {
                for (var i = 0, length = values.length; i < length; i++) {
                    if (!this._errorOccured) {
                        cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this._resultCount;
                                cursor.continue();
                            }
                            else if (i + 1 === length) {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                        cursor_request.onerror = onCursorError;
                    }
                }
            }
        }
    };
    return In;
}(NotWhere));
export { In };
//# sourceMappingURL=in_logic.js.map