import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        var cursor: IDBCursorWithValue,
            column_store = this.objectStore.index(column),
            cursor_request,
            onCursorError = function (e) {
                this._errorOccured = true;
                this.onErrorOccured(e);
            }.bind(this);
        if (this.checkFlag) {
            for (var i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this._whereChecker.check(cursor.value)) {
                                ++this._resultCount;
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
            if (this.objectStore.count) {
                for (var i = 0, length = values.length; i < length; i++) {
                    if (!this.errorOccured) {
                        cursor_request = column_store.count(IDBKeyRange.only(values[i]));
                        cursor_request.onsuccess = function (e) {
                            this._resultCount += e.target.result;
                            if (i + 1 === length) {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                        cursor_request.onerror = onCursorError;
                    }
                }
            }
            else {
                for (var i = 0, length = values.length; i < length; i++) {
                    if (!this.errorOccured) {
                        cursor_request = column_store.openCursor(IDBKeyRange.only(values[i]));
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this._resultCount;
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
        }
    }
}