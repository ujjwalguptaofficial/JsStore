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
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            }
                        },
                        executeSkip = function () {
                            var RecordSkipped = false;
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            if (That.checkForWhereConditionMatch(Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            }
                        },
                        executeLimit = function () {
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord && That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                            }
                        },
                        executeSimple = function () {
                            if (That.CheckFlag) {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                            }
                            else {
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }

                                }
                            }
                        };

                    value = op ? value[op] : value;
                    CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));

                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }

                    if (this.SkipRecord && this.LimitRecord) {
                        executeSkipAndLimit();
                    }
                    else if (this.SkipRecord) {
                        executeSkip();
                    }
                    else if (this.LimitRecord) {
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
