import { BaseSelect } from "./base_select";
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE } from "../../../common/index";
let cursorRequest: IDBRequest;
export class NotWhere extends BaseSelect {
    protected executeWhereUndefinedLogic() {
        if (this.query.order && this.query.order.idbSorting !== false && this.query.order.by) {
            if (this.objectStore.indexNames.contains(this.query.order.by as string)) {
                const orderType: IDBCursorDirection = this.query.order.type &&
                    this.query.order.type.toLowerCase() === 'desc' ? 'prev' : 'next';
                this.sorted = true;
                cursorRequest = this.objectStore.index(this.query.order.by as string).
                    openCursor(null, orderType);
            }
            else {
                const error = new LogHelper(ERROR_TYPE.ColumnNotExist, { column: this.query.order.by, isOrder: true });
                this.onErrorOccured(error, true);
                return;
            }
        }
        else {
            cursorRequest = this.objectStore.openCursor();
        }

        cursorRequest.onerror = this.onErrorOccured;

        if (this.isOrderWithLimit === false && this.isOrderWithSkip === false) {
            if (this.skipRecord && this.limitRecord) {
                this.executeSkipAndLimitForNoWhere_();
            }
            else if (this.skipRecord) {
                this.executeSkipForNoWhere_();
            }
            else if (this.limitRecord) {
                this.executeLimitForNotWhere_();
            }
            else {
                this.executeSimpleForNotWhere_();
            }
        }
        else {
            this.executeSimpleForNotWhere_();
        }
    }

    private executeSkipAndLimitForNoWhere_() {
        let recordSkipped = false,
            cursor: IDBCursorWithValue;
        cursorRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                if (recordSkipped && this.results.length !== this.limitRecord) {
                    this.pushResult(cursor.value);
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(this.skipRecord);
                }
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeSkipForNoWhere_() {
        let recordSkipped = false,
            cursor;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped) {
                    this.pushResult(cursor.value);
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(this.skipRecord);
                }
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeSimpleForNotWhere_() {
        let cursor;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                this.pushResult(cursor.value);
                (cursor as any).continue();
            }
            else {
                this.onQueryFinished();
            }
        };
    }

    private executeLimitForNotWhere_() {
        let cursor;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor && this.results.length !== this.limitRecord) {
                this.pushResult(cursor.value);
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }
}
