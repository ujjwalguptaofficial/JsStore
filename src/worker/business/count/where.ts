import { Regex } from "./regex";

export class Where extends Regex {
    protected executeWhereLogic(column, value, op) {
        value = op ? value[op] : value;
        let cursorRequest;
        let cursor: IDBCursorWithValue;
        let initCursorAndFilter;
        if (Object.keys(this.query.where).length === 1 && this.objectStore.count) {
            initCursorAndFilter = () => {
                cursorRequest = this.objectStore.index(column).count(this.getKeyRange(value, op));
                cursorRequest.onsuccess = () => {
                    this.resultCount = cursorRequest.result;
                    this.onQueryFinished();
                };
            };

        }
        else {
            initCursorAndFilter = () => {
                cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
                cursorRequest.onsuccess = (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
                            ++this.resultCount;
                        }
                        cursor.continue();
                    }
                    else {
                        this.onQueryFinished();
                    }
                };
            };
        }
        initCursorAndFilter();

        cursorRequest.onerror = this.onErrorOccured.bind(this);
    }
}