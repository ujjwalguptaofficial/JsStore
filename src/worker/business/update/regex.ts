import { Like } from "./like";
import { updateValue } from "./base_update";

export class LikeRegex extends Like {
    protected executeRegexLogic(column, value) {
        let cursor: IDBCursorWithValue;
        this.compValue = value ; // (value as string).toLowerCase();
        this.compValueLength = this.compValue.length;
        const cursorOpenRequest = this.objectStore.index(column).openCursor();
        cursorOpenRequest.onerror = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };

        if (this.checkFlag) {
            cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
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
            cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
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
    }
}
