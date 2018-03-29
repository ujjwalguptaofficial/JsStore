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
import { BaseSelect } from "./base_select";
import { LogHelper } from "../../log_helper";
import { Error_Type } from "../../enums";
var NotWhere = /** @class */ (function (_super) {
    __extends(NotWhere, _super);
    function NotWhere() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotWhere.prototype.executeWhereUndefinedLogic = function () {
        if (this._query.Order && this._query.Order.By) {
            if (this._objectStore.indexNames.contains(this._query.Order.By)) {
                var order_type = this._query.Order.Type &&
                    this._query.Order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                this._sorted = true;
                this._cursorOpenRequest = this._objectStore.index(this._query.Order.By).
                    openCursor(null, order_type);
            }
            else {
                var error = new LogHelper(Error_Type.ColumnNotExist, { ColumnName: this._query.Order.By });
                error.throw();
            }
        }
        else {
            this._cursorOpenRequest = this._objectStore.openCursor();
        }
        if (this._skipRecord && this._limitRecord) {
            this.executeSkipAndLimitForNoWhere();
        }
        else if (this._skipRecord) {
            this.executeSkipForNoWhere();
        }
        else if (this._limitRecord) {
            this.executeLimitForNotWhere();
        }
        else {
            this.executeSimpleForNotWhere();
        }
        this._cursorOpenRequest.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
    };
    NotWhere.prototype.executeSkipAndLimitForNoWhere = function () {
        var _this = this;
        var record_skipped = false, cursor;
        this._cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                if (record_skipped && _this._results.length !== _this._limitRecord) {
                    _this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    record_skipped = true;
                    cursor.advance(_this._skipRecord);
                }
            }
            else {
                _this.onQueryFinished();
            }
        };
    };
    NotWhere.prototype.executeSkipForNoWhere = function () {
        var record_skipped = false, cursor;
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
    };
    NotWhere.prototype.executeSimpleForNotWhere = function () {
        var cursor;
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
    };
    NotWhere.prototype.executeLimitForNotWhere = function () {
        var cursor;
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
    };
    return NotWhere;
}(BaseSelect));
export { NotWhere };
//# sourceMappingURL=not_where.js.map