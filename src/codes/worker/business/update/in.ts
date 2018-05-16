import { NotWhere } from "./not_where";
import { updateValue } from "./base_update";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue;
        const columnStore = this.objectStore.index(column);
        let cursorRequest;
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
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.update(updateValue(this.query.set, cursor.value));
                            ++this.rowAffected;
                            cursor.continue();
                        } else {
                            onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onCursorError;
                }
            }
        }
    }
}