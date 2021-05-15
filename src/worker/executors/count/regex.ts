import { BaseFetch } from "../base_fetch";
import { promise } from "@/common";
import { Count } from ".";

export const executeRegexLogic = function (this: BaseFetch, column: string, exp: RegExp) {
    let cursor: IDBCursorWithValue;
    const cursorRequest = this.objectStore.index(column).openCursor();
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereCheckerInstance.check(cursor.value);
    };
    return promise((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.shouldAddValue(cursor)) {
                    ++(this as Count).resultCount;
                }
                cursor.continue();
            }
            else {
                res();
            }
        };
    })
}