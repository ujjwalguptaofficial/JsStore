module JsStore {
    export module Business {
        export module Select {
            export class In extends NotWhere {

                private executeSkipAndLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this.SkipRecord,
                        That = this,
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That.CheckFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (That.Results.length != That.LimitRecord && Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            skipOrPush(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (That.Results.length != That.LimitRecord && Cursor) {
                                        skipOrPush(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                }

                private executeSkipForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this.SkipRecord,
                        That = this,
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That.CheckFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            skipOrPush((Cursor.value));
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        skipOrPush((Cursor.value));
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                private executeLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this;
                    if (That.CheckFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                private executeSimpleForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this;
                    if (That.CheckFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                this.CursorOpenRequest = this.ObjectStore.index(column).openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                protected executeInLogic = function (column, values) {
                    if (this.SkipRecord && this.LimitRecord) {
                        this.executeSkipAndLimitForIn(column, values);
                    }
                    else if (this.SkipRecord) {
                        this.executeSkipForIn(column, values);
                    }
                    else if (this.LimitRecord) {
                        this.executeLimitForIn(column, values);
                    }
                    else {
                        this.executeSimpleForIn(column, values);
                    }
                }
            }
        }
    }
}