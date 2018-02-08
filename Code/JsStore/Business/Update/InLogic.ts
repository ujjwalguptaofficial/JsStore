namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class In extends NotWhere {
                private executeInLogic = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        column_store = this._objectStore.index(column),
                        cursor_request,
                        onCursorError = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this._whereChecker.check(cursor.value)) {
                                            cursor.update(updateValue(this._query.Set, cursor.value));
                                            ++this._rowAffected;
                                        }
                                        cursor.continue();
                                    }
                                    else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
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
                                        cursor.update(updateValue(this._query.Set, cursor.value));
                                        ++this._rowAffected;
                                        cursor.continue();
                                    } else if (i + 1 === length) {
                                        this.onQueryFinished();
                                    }
                                }.bind(this);
                                cursor_request.onerror = onCursorError;
                            }
                        }
                    }
                };
            }
        }
    }
}
