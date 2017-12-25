namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    var That = this,
                        CursorOpenRequest,
                        Cursor: IDBCursorWithValue,
                        executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            if (That._checkFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That._results.length != That._limitRecord) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That._results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That._skipRecord);
                                        }
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That._results.length != That._limitRecord) {
                                            That._results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That._skipRecord);
                                        }
                                    }
                                }
                            }
                        },
                        executeSkip = function () {
                            var RecordSkipped = false;
                            if (That._checkFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That._results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That._skipRecord);
                                        }
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            That._results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That._skipRecord);
                                        }
                                    }
                                }
                            }
                        },
                        executeLimit = function () {
                            if (That._checkFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That._results.length != That._limitRecord && That.checkForWhereConditionMatch(Cursor.value)) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That._results.length != That._limitRecord) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                            }
                        },
                        executeSimple = function () {
                            if (That._checkFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That._results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }

                                }
                            }
                        };

                    value = op ? value[op] : value;
                    CursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));

                    CursorOpenRequest.onerror = function (e) {
                        That._errorOccured = true;
                        That.onErrorOccured(e);
                    }

                    if (this._skipRecord && this._limitRecord) {
                        executeSkipAndLimit();
                    }
                    else if (this._skipRecord) {
                        executeSkip();
                    }
                    else if (this._limitRecord) {
                        executeLimit();
                    }
                    else {
                        executeSimple();
                    }
                }
            }
        }
    }
}
