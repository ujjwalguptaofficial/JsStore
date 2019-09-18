import { In } from "./in";

let shouldAddValue: () => boolean;
let skipOrPush: (val) => void;
let skip;
let cursor: IDBCursorWithValue;
let cursorRequest: IDBRequest;
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

       cursorRequest = this.objectStore.index(column).openCursor();
       cursorRequest.onerror = this.onErrorOccured;
        if (this.isOrderWithLimit === false && this.isOrderWithSkip === false) {
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
        else {
            this.executeSimpleForRegex_();
        }
    }

    private executeSkipAndLimitForRegex_() {
       cursorRequest.onsuccess = (e: any) => {
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
       cursorRequest.onsuccess = (e: any) => {
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
       cursorRequest.onsuccess = (e: any) => {
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
       cursorRequest.onsuccess = (e: any) => {
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