import { promise } from "@/common";
import { updateValue } from "./update_value";
import { Update } from "./";

export const executeWhereLogic = function (this: Update, column, value, op) {

    value = op ? value[op] : value;
    const cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value, op));
    const setValue = (this.query as any).set;
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e: any) => {
            const cursor: IDBCursorWithValue = e.target.result;
            if (cursor) {
                if (this.whereCheckerInstance.check(cursor.value)) {
                    try {
                        const cursorUpdateRequest = cursor.update(updateValue(setValue, cursor.value));
                        cursorUpdateRequest.onsuccess = () => {
                            ++this.rowAffected;
                            cursor.continue();
                        };
                        cursorUpdateRequest.onerror = rej;
                    } catch (ex) {
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
        cursorRequest.onerror = rej
    })
}