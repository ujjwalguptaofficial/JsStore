import { Remove } from ".";
import { promise } from "@/common";

export const executeWhereUndefinedLogic = function (this: Remove) {
    let cursor;
    const cursorRequest = this.objectStore.openCursor();
    return promise<void>((res, rej) => {
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                ++this.rowAffected;
                (cursor as any).continue();
            }
            else {
                res();
            }
        };
        cursorRequest.onerror = rej;
    })

}
