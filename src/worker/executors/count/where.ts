import { BaseFetch } from "../base_fetch";
import { getLength } from "@/worker/utils";
import { Count } from ".";
import { promise } from "@/common";

export const executeWhereLogic = function (this: BaseFetch, column, value, op) {
    value = op ? value[op] : value;
    let cursorRequest;
    let cursor: IDBCursorWithValue;


    return promise((res, rej) => {
        if (getLength(this.query.where) === 1 && this.objectStore.count) {
            cursorRequest = this.objectStore.index(column).count(this.util.keyRange(value, op));
            cursorRequest.onsuccess = () => {
                (this as Count).resultCount = cursorRequest.result;
                res();
            }
        }
        else {
            cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value, op));
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        ++(this as Count).resultCount;
                    }
                    cursor.continue();
                }
                else {
                    res();
                }
            }
        }
        cursorRequest.onerror = rej;
    });
}