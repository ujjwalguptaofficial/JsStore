import { Remove } from ".";
import { promise, promiseAll } from "@/common";
import { onWhereRemove } from "./where";

export const executeInLogic = function (this: Remove, column, values) {
    const columnIndex = this.objectStore.index(column)
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = columnIndex.openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = onWhereRemove.call(this, res);
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(function (val) {
            return runInLogic(val);
        })
    );
}
