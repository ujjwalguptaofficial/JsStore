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
import { Like } from "./like";
var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.executeSkipAndLimitForWhere = function () {
        var record_skipped = false, cursor;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (record_skipped && this._results.length !== this._limitRecord) {
                        if (this._whereChecker.check(cursor.value)) {
                            this._results.push(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        record_skipped = true;
                        cursor.advance(this._skipRecord);
                    }
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (record_skipped && this._results.length !== this._limitRecord) {
                        this._results.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        record_skipped = true;
                        cursor.advance(this._skipRecord);
                    }
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    };
    Where.prototype.executeSkipForWhere = function () {
        var record_skipped = false, cursor;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (record_skipped) {
                        if (this._whereChecker.check(cursor.value)) {
                            this._results.push(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        record_skipped = true;
                        cursor.advance(this._skipRecord);
                    }
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (record_skipped) {
                        this._results.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        record_skipped = true;
                        cursor.advance(this._skipRecord);
                    }
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    };
    Where.prototype.executeLimitForWhere = function () {
        var cursor;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor && this._results.length !== this._limitRecord &&
                    this._whereChecker.check(cursor.value)) {
                    this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor && this._results.length !== this._limitRecord) {
                    this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    };
    Where.prototype.executeSimpleForWhere = function () {
        var cursor;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this._whereChecker.check(cursor.value)) {
                        this._results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    };
    Where.prototype.executeWhereLogic = function (column, value, op, dir) {
        value = op ? value[op] : value;
        this._cursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op), dir);
        this._cursorOpenRequest.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
        if (this._skipRecord && this._limitRecord) {
            this.executeSkipAndLimitForWhere();
        }
        else if (this._skipRecord) {
            this.executeSkipForWhere();
        }
        else if (this._limitRecord) {
            this.executeLimitForWhere();
        }
        else {
            this.executeSimpleForWhere();
        }
    };
    return Where;
}(Like));
export { Where };
//# sourceMappingURL=where.js.map