import { Select } from "./";
import { promise, promiseAll } from "@/common";
import { BaseFetch } from "../base_fetch";
import { executeLimitForWhere_, executeSimpleForWhere_, getCursorOnSuccess } from "./where";
import { executeSkipAndLimitForWhere_, executeSkipForWhere_ } from "./regex";



export const executeInLogic = function (this: BaseFetch, column, values) {
    let skip = this.skipRecord;
    const skipOrPush = (val) => {
        if (skip === 0) {
            (this as Select).pushResult(val);
        }
        else {
            --skip;
        }
    };
    const onSuccess = getCursorOnSuccess.call(
        this,
        executeSimpleForWhere_,
        executeLimitForWhere_,
        executeSkipForWhere_,
        executeSkipAndLimitForWhere_
    );

    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = this.objectStore.index(column).openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = onSuccess.call(this, res, skipOrPush);
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(runInLogic)
    );

};
