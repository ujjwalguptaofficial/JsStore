import { Remove } from ".";
import { promise } from "@/common";

export const onWhereRemove = function (this: Remove, onFinish) {
    return (e) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
            if (this.shouldAddValue(cursor.value)) {
                cursor.delete();
                ++this.rowAffected;
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };
}

export const executeWhereLogic = function (this: Remove, column, value, op) {
    value = op ? value[op] : value;
    const cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value, op));


    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = onWhereRemove.call(this, res);
        cursorRequest.onerror = rej
    })

}

