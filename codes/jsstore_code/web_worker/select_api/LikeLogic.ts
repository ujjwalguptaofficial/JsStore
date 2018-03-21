import { In } from "./InLogic";
import { Occurence } from "../../enums";

export class Like extends In {
    _compSymbol: Occurence;
    _compValue;
    _compValueLength: number;

    private executeLikeLogic(column, value: string, symbol: Occurence) {
        this._compValue = value.toLowerCase();
        this._compValueLength = this._compValue.length;
        this._compSymbol = symbol;
        this._cursorOpenRequest = this._objectStore.index(column).openCursor();
        this._cursorOpenRequest.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
        if (this._skipRecord && this._limitRecord) {
            this.executeSkipAndLimit();
        }
        else if (this._skipRecord) {
            this.executeSkip();
        }
        else if (this._limitRecord) {
            this.executeLimit();
        }
        else {
            this.executeSimple();
        }
    }

    private executeSkipAndLimit() {
        var cursor: IDBCursorWithValue,
            skip = this._skipRecord,
            skipOrPush = function (value) {
                if (skip === 0) {
                    this._results.push(value);
                }
                else {
                    --skip;
                }
            }.bind(this);
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (this._results.length !== this._limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this._whereChecker.check(cursor.value)) {
                        skipOrPush(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (this._results.length !== this._limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        skipOrPush(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    }

    private executeSkip() {
        var cursor: IDBCursorWithValue,
            skip = this._skipRecord,
            skipOrPush = function (value) {
                if (skip === 0) {
                    this._results.push(value);
                }
                else {
                    --skip;
                }
            }.bind(this);
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this._whereChecker.check(cursor.value)) {
                        skipOrPush((cursor.value));
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        skipOrPush((cursor.value));
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    }

    private executeLimit() {
        var cursor: IDBCursorWithValue;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (this._results.length !== this._limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this._whereChecker.check(cursor.value)) {
                        this._results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (this._results.length !== this._limitRecord && cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        this._results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    }

    private executeSimple() {
        var cursor: IDBCursorWithValue;
        if (this._checkFlag) {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this._whereChecker.check(cursor.value)) {
                        this._results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            this._cursorOpenRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        this._results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    }
}