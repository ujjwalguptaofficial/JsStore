import { BaseFetch } from "../base_fetch";
import { getLength } from "@/worker/utils";
import { Count } from ".";
import { promise } from "@/common";

export const onWhereCount = function (this: BaseFetch, onFinish) {
    return (e) => {
        const cursor = e.target.result;
        if (cursor) {
            if (this.shouldAddValue(cursor)) {
                ++(this as Count).resultCount;
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    }
}

export const executeWhereLogic = function (this: BaseFetch, column, value, op) {
    value = op ? value[op] : value;
    let cursorRequest;

    const isWhereKeysLengthOne = getLength(this.query.where) === 1;
    const objectStore = this.objectStore;

    return promise((res, rej) => {
        if (isWhereKeysLengthOne && objectStore.count) {
            cursorRequest = objectStore.index(column).count(this.util.keyRange(value, op));
            cursorRequest.onsuccess = () => {
                (this as Count).resultCount = cursorRequest.result;
                res();
            }
        }
        else {
            cursorRequest = objectStore.index(column).openCursor(this.util.keyRange(value, op));
            cursorRequest.onsuccess = onWhereCount.call(this, res);
        }
        cursorRequest.onerror = rej;
    });
}