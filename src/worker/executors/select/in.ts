import { Select } from "./";
import { promise, promiseAll } from "@/common";
import { BaseFetch } from "../base_fetch";
import { executeLimitForWhere_, executeSimpleForWhere_ } from "./where";

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
    const onSuccess = (() => {
        if (this.shouldEvaluateLimitAtEnd === false && this.shouldEvaluateSkipAtEnd === false) {
            if (this.skipRecord && this.limitRecord) {
                return executeSkipAndLimitForIn_;
            }
            else if (this.skipRecord) {
                return executeSkipForIn_;
            }
            else if (this.limitRecord) {
                return executeLimitForWhere_;
            }
        }
        return executeSimpleForWhere_;
    })();

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

const executeSkipAndLimitForIn_ = function (this: Select, onFinish, skipOrPush) {
    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (this.results.length !== this.limitRecord && cursor) {
            const value = cursor.value;
            if (this.shouldAddValue(value)) {
                skipOrPush(value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };
}

const executeSkipForIn_ = function (this: Select, onFinish, skipOrPush) {

    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
            const value = cursor.value
            if (this.shouldAddValue(value)) {
                skipOrPush(value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };
}