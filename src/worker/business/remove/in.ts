import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        const valueLength = values.length;
        let processedIn = 0;
        const onQueryFinished = () => {
            ++processedIn;
            if (processedIn === valueLength) {
                this.onQueryFinished();
            }
        };
        if (this.checkFlag) {
            for (let i = 0; i < valueLength; i++) {
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
                        else {
                            onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
        }
        else {
            for (let i = 0; i < valueLength; i++) {
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
                        else {
                            onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
        }
    }
}