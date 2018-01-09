namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class In extends NotWhere {
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
                };

                private executeSkipAndLimitForIn = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        skip = this._skipRecord,
                        column_store = this._objectStore.index(column),
                        cursor_request: IDBRequest,
                        skipOrPush = function (value) {
                            if (skip === 0) {
                                this._results.push(value);
                            }
                            else {
                                --skip;
                            }
                        }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (this._results.length !== this._limitRecord && cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            skipOrPush(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (this._results.length !== this._limitRecord && cursor) {
                                        skipOrPush(cursor.value);
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };

                private executeSkipForIn = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        skip = this._skipRecord,
                        cursor_request: IDBRequest,
                        column_store = this._objectStore.index(column),
                        skipOrPush = function (value) {
                            if (skip === 0) {
                                this._results.push(value);
                            }
                            else {
                                --skip;
                            }
                        }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            skipOrPush((cursor.value));
                                        }
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        skipOrPush((cursor.value));
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };

                private executeLimitForIn = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        cursor_request: IDBRequest,
                        column_store = this._objectStore.index(column);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor && this._results.length !== this._limitRecord) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            this._results.push(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor && this._results.length !== this._limitRecord) {
                                        this._results.push(cursor.value);
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };

                private executeSimpleForIn = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        cursor_request: IDBRequest,
                        column_store = this._objectStore.index(column);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            this._results.push(cursor.value);
                                        }
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        this._results.push(cursor.value);
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                };
            }
        }
    }
}