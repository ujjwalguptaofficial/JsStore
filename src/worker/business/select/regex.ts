import { In } from "./in";

let shouldAddValue: () => boolean;
let skipOrPush: (val) => void;
let skip;
let cursor: IDBCursorWithValue;
export class Regex extends In {
    protected executeRegexLogic(column, exp: RegExp) {

        skip = this.skipRecord;
        this.regexExpression = exp;
        skipOrPush = (val) => {
            if (skip === 0) {
                this.results.push(val);
            }
            else {
                --skip;
            }
        };
        shouldAddValue = () => {
            return this.regexTest(cursor.key) &&
                this.whereCheckerInstance.check(cursor.value);
        };

        this.cursorOpenRequest = this.objectStore.index(column).openCursor();
        this.cursorOpenRequest.onerror = this.onErrorOccured;
        if (this.skipRecord && this.limitRecord) {
            this.executeSkipAndLimitForRegex_();
        }
        else if (this.skipRecord) {
            this.executeSkipForRegex_();
        }
        else if (this.limitRecord) {
            this.executeLimitForRegex_();
        }
        else {
            this.executeSimpleForRegex_();
        }
    }

    private executeSkipAndLimitForRegex_() {
        this.cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (this.results.length !== this.limitRecord && cursor) {
                if (shouldAddValue()) {
                    skipOrPush(cursor.value);
                }
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeSkipForRegex_() {
        this.cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    skipOrPush((cursor.value));
                }
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeLimitForRegex_() {
        this.cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (this.results.length !== this.limitRecord && cursor) {
                if (shouldAddValue()) {
                    this.results.push(cursor.value);
                }
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }

    private executeSimpleForRegex_() {
        this.cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    this.results.push(cursor.value);
                }
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }
}