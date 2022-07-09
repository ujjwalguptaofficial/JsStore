import { promise, promiseAll } from "@/common";
import { getLength } from "@/worker/utils";
import { BaseFetch } from "../base_fetch";


export const executeInLogic = function (this: BaseFetch, column, values) {
    let cursor: IDBCursorWithValue;
    const columnStore = this.objectStore.index(column);
    const isWhereKeysLengthOne = getLength(this.query.where) === 1;

    const runInLogic: (val) => Promise<void> = (value) => {
        const keyRange = this.util.keyRange(value);
        if (isWhereKeysLengthOne && this.objectStore.count) {
            return promise((res, rej) => {
                const cursorRequest = columnStore.count(keyRange);
                cursorRequest.onsuccess = (e: any) => {
                    this.resultCount += e.target.result;
                    res();
                };
                cursorRequest.onerror = rej;
            });
        }
        return promise<void>((res, rej) => {
            const cursorRequest = columnStore.openCursor(keyRange);
            cursorRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        ++this.resultCount;
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
