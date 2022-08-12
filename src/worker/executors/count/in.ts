import { promise, promiseAll } from "@/common";
import { getLength } from "@/worker/utils";
import { BaseFetch } from "../base_fetch";
import { onWhereCount } from "./where";


export const executeInLogic = function (this: BaseFetch, column, values) {
    const objectStore = this.objectStore;
    const columnStore = objectStore.index(column);
    const isWhereKeysLengthOne = getLength(this.query.where) === 1;

    const runInLogic: (val) => Promise<void> = (value) => {
        const keyRange = this.util.keyRange(value);
        if (isWhereKeysLengthOne && objectStore.count) {
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
            cursorRequest.onsuccess = onWhereCount.call(this, res);
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(function (val) {
            return runInLogic(val);
        })
    );
}
