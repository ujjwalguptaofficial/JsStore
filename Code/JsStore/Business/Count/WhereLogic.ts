namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    value = op ? value[op] : value;
                    var cursor_request,
                        cursor: IDBCursorWithValue;
                    if (this._checkFlag) {
                        cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
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
                    else {
                        if (this._objectStore.count) {
                            cursor_request = this._objectStore.index(column).count(this.getKeyRange(value, op));
                            cursor_request.onsuccess = function () {
                                this._resultCount = cursor_request.result;
                            }.bind(this);
                        }
                        else {
                            cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                            cursor_request.onsuccess = function (e) {
                                cursor = e.target.result;
                                if (cursor) {
                                    ++this._resultCount;
                                    cursor.continue();
                                }
                            }.bind(this);
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
