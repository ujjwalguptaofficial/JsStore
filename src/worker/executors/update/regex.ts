import { Update } from "./";
import { updateValue } from "./update_value";
import { promise } from "@/common";
import { getError } from "@/worker/utils";

export const executeRegexLogic = function (this: Update, column: string, exp: RegExp) {
    let cursor: IDBCursorWithValue;
    const cursorOpenRequest = this.objectStore.index(column).openCursor();
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereCheckerInstance.check(cursor.value);
    };
    const setValue = (this.query as any).set;
    return promise<void>((res, rej) => {

        cursorOpenRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.shouldAddValue(cursor)) {
                    try {
                        const cursorUpdateRequest = cursor.update(updateValue(setValue, cursor.value));
                        cursorUpdateRequest.onsuccess = () => {
                            ++this.rowAffected;
                            cursor.continue();
                        };
                        cursorUpdateRequest.onerror = rej;
                    } catch (ex) {
                        rej(
                            getError(ex)
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
