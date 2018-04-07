import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        var cursor: IDBCursorWithValue,
            cursor_request,
            onCursorError = function (e) {
                this._errorOccured = true;
                this.onErrorOccured(e);
            }.bind(this);
        if (this._checkFlag) {
            for (var i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursor_request = this.objectStore.index(column).
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
                    cursor_request.onerror = onCursorError;
                }
            }
        }
        else {
            for (var i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursor_request = this.objectStore.index(column).
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
                    cursor_request.onerror = onCursorError;
                }
            }
        }
    }
}