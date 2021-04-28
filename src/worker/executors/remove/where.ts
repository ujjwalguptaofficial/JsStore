import { Remove } from ".";
import { promise } from "@/common";

export const executeWhereLogic = function (this: Remove, column, value, op) {
    let cursor: IDBCursorWithValue,
        cursorRequest;
    value = op ? value[op] : value;
    cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value, op));
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e) => {
            cursor = e.target.result;
            if (cursor) {
                if (this.whereCheckerInstance.check(cursor.value)) {
                    cursor.delete();
                    ++this.rowAffected;
                }
                cursor.continue();
            }
            else {
                res();
            }
        };

        cursorRequest.onerror = rej
    })

}

