namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class In extends NotWhere {
                private executeInLogic = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        cursor_request;
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = this._objectStore.index(column).
                                    openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            cursor.delete();
                                            ++this._rowAffected;
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);

                            }
                        }
                    }
                    else {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = this._objectStore.index(column).
                                    openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        cursor.delete();
                                        ++this._rowAffected;
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
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
