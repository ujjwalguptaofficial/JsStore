import { Like } from "./like";
import { updateValue } from "./base_update";

export class Regex extends Like {
    protected executeRegexLogic(column: string, exp: RegExp) {
        let cursor: IDBCursorWithValue;
        this.regexExpression = exp;
        const cursorOpenRequest = this.objectStore.index(column).openCursor();
        cursorOpenRequest.onerror = this.onErrorOccured;
        let shouldAddValue: () => boolean;

        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.regexTest(cursor.key) &&
                    this.whereCheckerInstance.check(cursor.value);
            };

        }
        else {
            shouldAddValue = () => {
                return this.regexTest(cursor.key);
            };
        }

        cursorOpenRequest.onsuccess = (e: any) => {
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
    }
}
