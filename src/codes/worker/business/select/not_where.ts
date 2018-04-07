import { BaseSelect } from "./base_select";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE } from "../../enums";

export class NotWhere extends BaseSelect {
    protected executeWhereUndefinedLogic() {
        if (this.query.order && this.query.order.by) {
            if (this.objectStore.indexNames.contains(this.query.order.by)) {
                var order_type: IDBCursorDirection = this.query.order.Type &&
                    this.query.order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                this._sorted = true;
                this.cursorOpenRequest = this.objectStore.index(this.query.order.by).
                    openCursor(null, order_type);
            }
            else {
                var error = new LogHelper(ERROR_TYPE.ColumnNotExist, { ColumnName: this.query.order.by });
                error.throw();
            }
        }
        else {
            this.cursorOpenRequest = this.objectStore.openCursor();
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

        this.cursorOpenRequest.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);

    }

    private executeSkipAndLimitForNoWhere() {
        var record_skipped = false,
            cursor: IDBCursorWithValue;
        this.cursorOpenRequest.onsuccess = (e) => {
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
        this.cursorOpenRequest.onsuccess = function (e) {
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
        this.cursorOpenRequest.onsuccess = function (e) {
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
        this.cursorOpenRequest.onsuccess = function (e) {
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
