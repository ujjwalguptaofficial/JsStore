import { Update } from "./";
import { promise } from "@/common";
import { updateValue } from "./update_value";


export const executeWhereUndefinedLogic = function (this: Update) {
    let cursor: IDBCursorWithValue;
    const cursorRequest: IDBRequest<IDBCursorWithValue> = this.objectStore.openCursor();
    const setValue = (this.query as any).set;
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                try {
                    const cursorUpdateRequest = cursor.update(updateValue(setValue, cursor.value));
                    cursorUpdateRequest.onsuccess = () => {
                        ++this.rowAffected;
                        cursor.continue();
                    };
                    cursorUpdateRequest.onerror = (e) => {
                        rej(
                            e
                        )
                    };
                } catch (ex) {
                    rej(
                        ex
                    );
                }
            }
            else {
                res();
            }
        };
        cursorRequest.onerror = rej;
    })

}
