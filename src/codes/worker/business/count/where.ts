import { Like } from "./like";

export class Where extends Like {
    private executeWhereLogic(column, value, op) {
        value = op ? value[op] : value;
        let cursorRequest,
            cursor: IDBCursorWithValue;
        if (this.checkFlag) {
            cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        ++this._resultCount;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            if (this.objectStore.count) {
                cursorRequest = this.objectStore.index(column).count(this.getKeyRange(value, op));
                cursorRequest.onsuccess = () => {
                    this._resultCount = cursorRequest.result;
                    this.onQueryFinished();
                };
            }
            else {
                cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
                cursorRequest.onsuccess = (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        ++this._resultCount;
                        cursor.continue();
                    }
                    else {
                        this.onQueryFinished();
                    }
                };
            }
        }
        cursorRequest.onerror = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
    }
}