namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class In extends NotWhere {
                private executeSkipAndLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this._skipRecord,
                        That = this,
                        ColumnStore = this._objectStore.index(column),
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That._results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (That._results.length != That._limitRecord && Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            skipOrPush(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (That._results.length != That._limitRecord && Cursor) {
                                        skipOrPush(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                }

                private executeSkipForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this._skipRecord,
                        That = this,
                        ColumnStore = this._objectStore.index(column),
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That._results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
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
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        skipOrPush((Cursor.value));
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                private executeLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        ColumnStore = this._objectStore.index(column);
                    if (That._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That._results.length != That._limitRecord) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That._results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor && That._results.length != That._limitRecord) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                private executeSimpleForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        ColumnStore = this._objectStore.index(column);
                    if (That._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That._results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That._errorOccured) {
                                this.CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                this.CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                                this.CursorOpenRequest.onerror = function (e) {
                                    That._errorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }

                }

                protected executeInLogic = function (column, values) {
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForIn(column, values);
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForIn(column, values);
                    }
                    else if (this._limitRecord) {
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