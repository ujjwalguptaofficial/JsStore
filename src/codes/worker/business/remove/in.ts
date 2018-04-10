import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = this.objectStore.index(column).
                        openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                cursor.delete();
                                ++this.rowAffected;
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = this.objectStore.index(column).
                        openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this.rowAffected;
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
        }
    }
}