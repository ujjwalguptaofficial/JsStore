import { BaseFetch } from "../base_fetch";
import { promise } from "@/common";
import { onWhereCount } from "./where";

export const executeRegexLogic = function (this: BaseFetch, column: string, exp: RegExp) {
    const cursorRequest = this.objectStore.index(column).openCursor();
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereCheckerInstance.check(cursor.value);
    };
    return promise((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onWhereCount.call(this, res);
    })
}