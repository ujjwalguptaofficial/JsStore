import { Update } from "./";
import { promiseAll, promise, IUpdateQuery } from "@/common";
import { updateValue } from "./update_value";


export const executeInLogic = function (this: Update, column, values: any[]) {
    const columnStore = this.objectStore.index(column);
    const query: IUpdateQuery = this.query as any;
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = columnStore.openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = (e: any) => {
                const cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    const value = cursor.value;
                    if (this.whereCheckerInstance.check(value)) {
                        try {
                            const cursorUpdateRequest = cursor.update(updateValue(query, value));
                            cursorUpdateRequest.onsuccess = () => {
                                ++this.rowAffected;
                                cursor.continue();
                            };
                            cursorUpdateRequest.onerror = rej;
                        }
                        catch (ex) {
                            rej(
                                ex
                            );
                        }

                    }
                    else {
                        cursor.continue();
                    }
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
