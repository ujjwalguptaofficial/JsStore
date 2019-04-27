import { Regex } from "./regex";

let shouldAddValue: () => boolean;
let cursor: IDBCursorWithValue;
export class Where extends Regex {

    protected executeWhereLogic(column, value, op, dir) {

        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.whereCheckerInstance.check(cursor.value);
            };
        }
        else {
            shouldAddValue = function () {
                return true;
            };
        }
        value = op ? value[op] : value;
        this.cursorOpenRequest = this.objectStore.index(column).openCursor(
            this.getKeyRange(value, op),
            dir
        );

        this.cursorOpenRequest.onerror = this.onErrorOccured;

        if (this.isOrderWithLimit === false) {
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
            if (this.skipRecord) {
                this.executeSkipForWhere_();
            }
            else {
                this.executeSimpleForWhere_();
            }
        }

    }

    private executeSkipAndLimitForWhere_() {
        let recordSkipped = false;
        this.cursorOpenRequest.onsuccess = (e: any) => {
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

        this.cursorOpenRequest.onsuccess = (e: any) => {
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
        this.cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor && this.results.length !== this.limitRecord &&
                shouldAddValue()) {
                this.results.push(cursor.value);
                cursor.continue();
            }
            else {
                this.onQueryFinished();
            }
        };

    }

    private executeSimpleForWhere_() {
        this.cursorOpenRequest.onsuccess = (e: any) => {
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