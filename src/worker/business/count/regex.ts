import { Like } from "./like";

export class LikeRegex extends Like {
    protected executeRegexLogic(column: string, exp: RegExp) {
        let cursor: IDBCursorWithValue;
        this.regexExpression = exp;
        const cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onErrorOccured;
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

        cursorRequest.onsuccess = (e: any) => {
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
    }
}