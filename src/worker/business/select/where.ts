import { LikeRegex } from "./regex";

export class Where extends LikeRegex {
    private executeSkipAndLimitForWhere_() {
        let recordSkipped = false;
        let cursor;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (recordSkipped && this.results.length !== this.limitRecord) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
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
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (recordSkipped && this.results.length !== this.limitRecord) {
                        this.results.push(cursor.value);
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
    }

    private executeSkipForWhere_() {
        let recordSkipped = false,
            cursor;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (recordSkipped) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
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
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (recordSkipped) {
                        this.results.push(cursor.value);
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
    }

    private executeLimitForWhere_() {
        let cursor;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor && this.results.length !== this.limitRecord &&
                    this.whereCheckerInstance.check(cursor.value)) {
                    this.results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor && this.results.length !== this.limitRecord) {
                    this.results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
    }

    private executeSimpleForWhere_() {
        let cursor;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    this.results.push(cursor.value);
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
    }

    protected executeWhereLogic(column, value, op, dir) {
        value = op ? value[op] : value;
        this.cursorOpenRequest = this.objectStore.index(column).openCursor(
            this.getKeyRange(value, op),
            dir
        );

        this.cursorOpenRequest.onerror = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };

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
}