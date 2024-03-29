import { Update } from "./";
import { updateValue } from "./update_value";
import { promise } from "@/common";

export const executeRegexLogic = function (this: Update, column: string, exp: RegExp) {
    let cursor: IDBCursorWithValue;
    const cursorOpenRequest = this.objectStore.index(column).openCursor();
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereChecker.check(cursor.value);
    };
    return promise<void>((res, rej) => {

        cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.shouldAddValue(cursor)) {
                    try {
                        const cursorUpdateRequest = cursor.update(updateValue(this.query as any, cursor.value));
                        cursorUpdateRequest.onsuccess = () => {
                            ++this.rowAffected;
                            cursor.continue();
                        };
                        cursorUpdateRequest.onerror = rej;
                    } catch (ex) {
                        rej(
                            ex
                        );
                    }
                }
                else {
                    cursor.continue();
                }

            }
            else {
                res();
            }
        };
        cursorOpenRequest.onerror = rej;
    })

}
