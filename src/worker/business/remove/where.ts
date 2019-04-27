import { Regex } from "./regex";

export class Where extends Regex {
    protected executeWhereLogic(column, value, op) {
        let cursor: IDBCursorWithValue,
            cursorRequest;
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));

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
                this.onQueryFinished();
            }
        };

        cursorRequest.onerror = this.onErrorOccured;
    }
}
