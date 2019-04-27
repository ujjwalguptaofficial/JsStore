import { Regex } from "./regex";

export class Where extends Regex {
    protected executeWhereLogic(column, value, op) {
        value = op ? value[op] : value;
        let cursorRequest,
            cursor: IDBCursorWithValue;
        let shouldAddValue: () => boolean;
        const initCursorAndFilter = () => {
            cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    if (shouldAddValue()) {
                        ++this.resultCount;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        };
        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.whereCheckerInstance.check(cursor.value);
            };
            initCursorAndFilter();
        }
        else {
            if (this.objectStore.count) {
                cursorRequest = this.objectStore.index(column).count(this.getKeyRange(value, op));
                cursorRequest.onsuccess = () => {
                    this.resultCount = cursorRequest.result;
                    this.onQueryFinished();
                };
            }
            else {
                shouldAddValue = () => {
                    return true;
                };
                initCursorAndFilter();
            }
        }
        cursorRequest.onerror = this.onErrorOccured;
    }
}