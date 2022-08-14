import { Remove } from "./";
import { promise } from "@/common";

export const executeRegexLogic = function (this: Remove, column: string, exp: RegExp) {
    let cursor: IDBCursorWithValue;
    const cursorRequest = this.objectStore.index(column).openCursor();
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereChecker.check(cursor.value);
    };
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.shouldAddValue(cursor)) {
                    cursor.delete();
                    ++this.rowAffected;
                }
                cursor.continue();
            }
            else {
                res();
            }
        };
        cursorRequest.onerror = rej;
    })

}