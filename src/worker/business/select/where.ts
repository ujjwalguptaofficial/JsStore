import { Regex } from "./regex";

let shouldAddValue: () => boolean;
let cursor: IDBCursorWithValue;
let cursorRequest: IDBRequest;
export class Where extends Regex {

    protected executeWhereLogic(column, value, op, dir) {
        shouldAddValue = () => {
            return this.whereCheckerInstance.check(cursor.value);
        };
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(
            this.getKeyRange(value, op),
            dir
        );

        cursorRequest.onerror = this.onErrorOccured;

        if (this.isOrderWithLimit === false && this.isOrderWithSkip === false) {
            if (this.skipRecord && this.limitRecord) {
                this.executeSkipAndLimitForWhere_();
            }
            else if (this.skipRecord) {
                this.executeSkipForWhere_();
            }
            else if (this.limitRecord) {
                this.executeLimitForWhere_();
            }
            else {
                this.executeSimpleForWhere_();
            }
        }
        else {
            this.executeSimpleForWhere_();
        }

    }

    private executeSkipAndLimitForWhere_() {
        let recordSkipped = false;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped && this.results.length !== this.limitRecord) {
                    if (shouldAddValue()) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(this.skipRecord);
                }
            }
            else {
                this.onQueryFinished();
            }
        };
    }

    private executeSkipForWhere_() {
        let recordSkipped = false;

        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (recordSkipped) {
                    if (shouldAddValue()) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    recordSkipped = true;
                    cursor.advance(this.skipRecord);
                }
            }
            else {
                this.onQueryFinished();
            }
        };
    }

    private executeLimitForWhere_() {
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor && this.results.length !== this.limitRecord) {
                if (shouldAddValue()) {
                    this.results.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                this.onQueryFinished();
            }
        };

    }

    private executeSimpleForWhere_() {
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    this.results.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                this.onQueryFinished();
            }
        };
    }
}