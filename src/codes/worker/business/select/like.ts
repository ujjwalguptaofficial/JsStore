import { In } from "./in";
import { OCCURENCE } from "../../enums";

export class Like extends In {
    compSymbol: OCCURENCE;
    compValue;
    compValueLength: number;

    protected executeLikeLogic(column, value: string, symbol: OCCURENCE) {
        this.compValue = value.toLowerCase();
        this.compValueLength = this.compValue.length;
        this.compSymbol = symbol;
        this.cursorOpenRequest = this.objectStore.index(column).openCursor();
        this.cursorOpenRequest.onerror = this.onCursorError;
        if (this.skipRecord && this.limitRecord) {
            this.executeSkipAndLimit_();
        }
        else if (this.skipRecord) {
            this.executeSkip_();
        }
        else if (this.limitRecord) {
            this.executeLimit_();
        }
        else {
            this.executeSimple_();
        }
    }

    private executeSkipAndLimit_() {
        let cursor: IDBCursorWithValue;
        const skipOrPush = (value) => {
            if (skip === 0) {
                this.results.push(value);
            }
            else {
                --skip;
            }
        };
        let skip = this.skipRecord;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (this.results.length !== this.limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        skipOrPush(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (this.results.length !== this.limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        skipOrPush(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
    }

    private executeSkip_() {
        let cursor: IDBCursorWithValue,
            skip = this.skipRecord;
        const skipOrPush = (value) => {
            if (skip === 0) {
                this.results.push(value);
            }
            else {
                --skip;
            }
        };
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        skipOrPush((cursor.value));
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        skipOrPush((cursor.value));
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
    }

    private executeLimit_() {
        let cursor: IDBCursorWithValue;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (this.results.length !== this.limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (this.results.length !== this.limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
    }

    private executeSimple_() {
        let cursor: IDBCursorWithValue;
        if (this.checkFlag) {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            this.cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        this.results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            };
        }
    }
}