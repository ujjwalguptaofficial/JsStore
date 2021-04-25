import { BaseFetch } from "../base_fetch";
import { getLength } from "@/worker/utils";
import { Count } from ".";
import { promise } from "@/common";

export const executeWhereLogic = function (this: BaseFetch, column, value, op) {
    value = op ? value[op] : value;
    let cursorRequest;
    let cursor: IDBCursorWithValue;
    const onSuccess = (() => {
        if (getLength(this.query.where) === 1 && this.objectStore.count) {
            cursorRequest = this.objectStore.index(column).count(this.util.keyRange(value, op));
            return (onFinish) => {
                return () => {
                    (this as Count).resultCount = cursorRequest.result;
                    onFinish();
                };
            }
        }
        else {
            return (onFinish) => {
                cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value, op));
                return (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
                            ++(this as Count).resultCount;
                        }
                        cursor.continue();
                    }
                    else {
                        onFinish();
                    }
                };
            };
        }
    })()

    return promise((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onSuccess(res);
    });
}