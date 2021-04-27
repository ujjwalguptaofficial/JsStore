import { Update } from "./";
import { promiseAll, promise, UpdateQuery } from "@/common";
import { updateValue } from "./update_value";


export const executeInLogic = function (this: Update, column, values: any[]) {
    let cursor: IDBCursorWithValue;
    const columnStore = this.objectStore.index(column);
    let cursorRequest;
    const query: UpdateQuery = this.query as any;
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            cursorRequest = columnStore.openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = (e) => {
                cursor = e.target.result;
                if (cursor) {
                    const value = cursor.value;
                    if (this.whereCheckerInstance.check(value)) {
                        cursor.update(updateValue(query.set, value));
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
