import { promise } from "@/common";
import { BaseFetch } from "../base_fetch";
import { Count } from ".";

export const executeWhereUndefinedLogic = function (this: BaseFetch) {
    let countRequest;
    const objectStore = this.objectStore;
    const onSuccess = (() => {
        if (objectStore.count) {
            countRequest = objectStore.count();
            return (onFinish) => {
                return () => {
                    (this as Count).resultCount = countRequest.result;
                    onFinish();
                }
            }
        }
        else {
            let cursor;
            countRequest = objectStore.openCursor();
            return (onFinish) => {
                return (e: any) => {
                    cursor = e.target.result;
                    if (cursor) {
                        ++(this as Count).resultCount;
                        cursor.continue();
                    }
                    else {
                        onFinish();
                    }
                };
            };
        }
    })();
    return promise((res, rej) => {
        countRequest.onerror = rej;
        countRequest.onsuccess = onSuccess(res);
    });
}
