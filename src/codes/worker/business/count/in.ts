import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        const columnStore = this.objectStore.index(column);
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                cursorRequest.onsuccess = (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
                            ++this._resultCount;
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
        else {
            if (this.objectStore.count) {
                for (let i = 0, length = values.length; i < length; i++) {
                    cursorRequest = columnStore.count(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        this._resultCount += e.target.result;
                        if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
            else {
                for (let i = 0, length = values.length; i < length; i++) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            ++this._resultCount;
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