import { Select } from "./";
import { promise, promiseAll } from "@/common";
import { BaseFetch } from "../base_fetch";

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
                executeSkipAndLimitForIn_;
            }
        }
        return executeSimpleForIn_;
    })();

    const columnStore = this.objectStore.index(column);
    const runInLogic: (val) => Promise<void> = (value) => {
        return promise((res, rej) => {
            const cursorRequest = columnStore.openCursor(this.util.keyRange(value));
            cursorRequest.onsuccess = onSuccess.call(this, res, skipOrPush);
            cursorRequest.onerror = rej;
        });
    };

    return promiseAll<void>(
        values.map(function (val) {
            return runInLogic(val);
        })
    );

};

const executeSkipAndLimitForIn_ = function (this: Select, onFinish, skipOrPush) {
    return (e: any) => {
        const cursor = e.target.result;
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
        const cursor = e.target.result;
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

const executeLimitForIn_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor && this.results.length !== this.limitRecord) {
            const value = cursor.value;
            if (this.shouldAddValue(value)) {
                this.pushResult(cursor.value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };

}

const executeSimpleForIn_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
            const value = cursor.value
            if (this.shouldAddValue(value)) {
                this.pushResult(value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };
}