import { In } from "./in";
import { updateValue } from "./base_update";

export class Regex extends In {
    protected executeRegexLogic(column: string, exp: RegExp) {
        let cursor: IDBCursorWithValue;
        this.regexExpression = exp;
        const cursorOpenRequest = this.objectStore.index(column).openCursor();
        cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.regexTest(cursor.key) &&
                    this.whereCheckerInstance.check(cursor.value)) {
                    try {
                        const cursorUpdateRequest = cursor.update(updateValue(this.query.set, cursor.value));
                        cursorUpdateRequest.onsuccess = () => {
                            ++this.rowAffected;
                            cursor.continue();
                        };
                        cursorUpdateRequest.onerror = this.onErrorOccured.bind(this);
                    } catch (err) {
                        this.transaction.abort();
                        this.onErrorOccured(err);
                    }
                }
                else {
                    cursor.continue();
                }

            }
            else {
                this.onQueryFinished();
            }
        };
        cursorOpenRequest.onerror = this.onErrorOccured.bind(this);
    }
}
