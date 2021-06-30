import { Update } from "./";
import { promise } from "@/common";
import { updateValue } from "./update_value";


export const executeWhereUndefinedLogic = function (this: Update) {
    const cursorRequest: IDBRequest<IDBCursorWithValue> = this.objectStore.openCursor();
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e: any) => {
            const cursor: IDBCursorWithValue = (e as any).target.result;
            if (cursor) {
                try {
                    const cursorUpdateRequest = cursor.update(updateValue(this.query as any, cursor.value));
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
                res();
            }
        };
        cursorRequest.onerror = rej;
    })

}
