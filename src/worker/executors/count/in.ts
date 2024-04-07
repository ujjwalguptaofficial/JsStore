import { promise, promiseAll } from "@/common";
import { BaseFetch } from "../base_fetch";
import { onWhereCount } from "./where";
import { isWhereKeysLengthOne } from "./is_where_keys_length_one";


export const executeInLogic = function (this: BaseFetch, column, values) {
    const objectStore = this.objectStore;
    const columnStore = objectStore.index(column);
    const isWhereKeysLengthOneValue = isWhereKeysLengthOne(this.query.where);

    const runInLogic: (val) => Promise<void> = (value) => {
        const keyRange = this.util.keyRange(value);
        if (isWhereKeysLengthOneValue && objectStore.count) {
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
