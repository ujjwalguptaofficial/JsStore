import { NotWhere } from "./not_where";
import { updateValue } from "./base_update";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue;
        const columnStore = this.objectStore.index(column);
        let cursorRequest;
        const onCursorError = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                cursor.update(updateValue(this.query.set, cursor.value));
                                ++this.rowAffected;
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.update(updateValue(this.query.set, cursor.value));
                            ++this.rowAffected;
                            cursor.continue();
                        } else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
    }
}