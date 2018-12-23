import { updateValue } from "./base_update";
import { Like } from "./like";

export class Where extends Like {
    protected executeWhereLogic(column, value, op) {
        let cursor: IDBCursorWithValue,
            cursorRequest;
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
        if (this.checkFlag) {
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        cursor.update(updateValue(this.query.set, cursor.value));
                        ++this.rowAffected;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    cursor.update(updateValue(this.query.set, cursor.value));
                    ++this.rowAffected;
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }

        cursorRequest.onerror = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
    }
}