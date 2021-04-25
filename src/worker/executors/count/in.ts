import { promise, promiseAll } from "@/common";
import { BaseFetch } from "../base_fetch";


export const executeInLogic = function (this: BaseFetch, column, values) {
    let cursor: IDBCursorWithValue, cursorRequest;
    const columnStore = this.objectStore.index(column);
    const cursorApi = this.objectStore.count ? columnStore.count : columnStore.openCursor;
    const onSuccess = () => {
        if (this.objectStore.count) {
            return function (onFinish) {
                return function (e: any) {
                    this.resultCount += e.target.result;
                    onFinish();
                };
            }
        }
        return function (onFinish) {
            return function (e: any) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.whereCheckerInstance.check(cursor.value)) {
                        ++this.resultCount;
                    }
                    cursor.continue();
                }
                else {
                    onFinish();
                }
            };
        };
    }
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = cursorApi(this.util.keyRange(value));
            cursorRequest.onsuccess = onSuccess.call(this, res);
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(function (val) {
            return runInLogic(val);
        })
    );
}
