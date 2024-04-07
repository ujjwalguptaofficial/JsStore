import { BaseFetch } from "../base_fetch";
import { isWhereKeysLengthOne } from "./is_where_keys_length_one";
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

    const isWhereKeysLengthOneValue = isWhereKeysLengthOne(this.query.where);
    const objectStore = this.objectStore;

    return promise((res, rej) => {
        if (isWhereKeysLengthOneValue && objectStore.count) {
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