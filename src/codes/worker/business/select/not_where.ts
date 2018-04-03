import { BaseSelect } from "./base_select";
import { LogHelper } from "../../log_helper";
import { Error_Type } from "../../enums";

export class NotWhere extends BaseSelect {
    protected executeWhereUndefinedLogic() {
        if (this._query.order && this._query.order.by) {
            if (this._objectStore.indexNames.contains(this._query.order.by)) {
                var order_type: IDBCursorDirection = this._query.order.Type &&
                    this._query.order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                this._sorted = true;
                this._cursorOpenRequest = this._objectStore.index(this._query.order.by).
                    openCursor(null, order_type);
            }
            else {
                var error = new LogHelper(Error_Type.ColumnNotExist, { ColumnName: this._query.order.by });
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

    }

    private executeSkipAndLimitForNoWhere() {
        var record_skipped = false,
            cursor: IDBCursorWithValue;
        this._cursorOpenRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                if (record_skipped && this._results.length !== this._limitRecord) {
                    this._results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    record_skipped = true;
                    cursor.advance(this._skipRecord);
                }
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeSkipForNoWhere() {
        var record_skipped = false,
            cursor;
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
            } else {
                this.onQueryFinished();
            }
        }.bind(this);
    }

    private executeSimpleForNotWhere() {
        var cursor;
        this._cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor) {
                this._results.push(cursor.value);
                (cursor as any).continue();
            }
            else {
                this.onQueryFinished();
            }
        }.bind(this);
    }

    private executeLimitForNotWhere() {
        var cursor;
        this._cursorOpenRequest.onsuccess = function (e) {
            cursor = e.target.result;
            if (cursor && this._results.length !== this._limitRecord) {
                this._results.push(cursor.value);
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        }.bind(this);
    }
}
