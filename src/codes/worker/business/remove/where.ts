import { Like } from "./like";

export class Where extends Like {
    private executeWhereLogic(column, value, op) {
        var cursor: IDBCursorWithValue,
            cursor_request;
        value = op ? value[op] : value;
        cursor_request = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
        if (this._checkFlag) {
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this._whereChecker.check(cursor.value)) {
                        cursor.delete();
                        ++this._rowAffected;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
        else {
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++this._rowAffected;
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }

        cursor_request.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);
    }
}
