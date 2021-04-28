import { Remove } from ".";
import { promise, promiseAll } from "@/common";

export const executeInLogic = function (this: Remove, column, values) {
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = (e: any) => {
                const cursor: IDBCursorWithValue = e.target.result;
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
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(function (val) {
            return runInLogic(val);
        })
    );
}
