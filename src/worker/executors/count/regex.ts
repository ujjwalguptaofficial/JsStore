import { BaseFetch } from "../base_fetch";
import { promise } from "@/common";
import { Count } from ".";

export const executeRegexLogic = function (this: BaseFetch, column: string, exp: RegExp) {
    let cursor: IDBCursorWithValue;
    const cursorRequest = this.objectStore.index(column).openCursor();

    return promise((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (exp.test(cursor.key as string) &&
                    this.whereCheckerInstance.check(cursor.value)) {
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