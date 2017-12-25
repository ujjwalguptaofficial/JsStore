namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class In extends NotWhere {
                private executeInLogic = function (column, values) {
                    var cursor: IDBCursorWithValue,
                        column_store = this._objectStore.index(column),
                        cursor_request;
                    if (this._checkFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!this._errorOccured) {
                                cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                                cursor_request.onsuccess = function (e) {
                                    cursor = e.target.result;
                                    if (cursor) {
                                        if (this.checkForWhereConditionMatch(cursor.value)) {
                                            ++this._resultCount;
                                        }
                                        cursor.continue();
                                    }
                                }.bind(this);
                            }
                        }
                    }
                    else {
                        if (this._objectStore.count) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!this._errorOccured) {
                                    cursor_request = column_store.count(IDBKeyRange.only(values[i]));
                                    cursor_request.onsuccess = function (e) {
                                        this._resultCount += e.target.result;
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
                                            ++this._resultCount;
                                            cursor.continue();
                                        }
                                    }.bind(this);
                                }
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
