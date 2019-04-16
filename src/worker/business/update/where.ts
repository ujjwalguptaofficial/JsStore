import { updateValue } from "./base_update";
import { Like } from "./like";

export class Where extends Like {
    protected executeWhereLogic(column, value, op) {
        let cursor: IDBCursorWithValue,
            cursorRequest;
        value = op ? value[op] : value;
        cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value, op));
        let shouldAddValue: () => boolean;

        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.whereCheckerInstance.check(cursor.value);
            };

        }
        else {
            shouldAddValue = () => {
                return true;
            };
        }
        cursorRequest.onsuccess = (e) => {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
                    cursor.update(updateValue(this.query.set, cursor.value));
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