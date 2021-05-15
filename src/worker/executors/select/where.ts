import { Select } from "./";
import { promise } from "@/common";
import { BaseFetch } from "../base_fetch";

export const executeWhereLogic = function (this: BaseFetch, column, value, op, dir) {

    value = op ? value[op] : value;
    const cursorRequest = this.objectStore.index(column).openCursor(
        this.util.keyRange(value, op),
        dir
    );

    const onSuccess = (() => {
        if (this.shouldEvaluateLimitAtEnd === false && this.shouldEvaluateSkipAtEnd === false) {
            if (this.skipRecord && this.limitRecord) {
                return executeSkipAndLimitForWhere_;
            }
            else if (this.skipRecord) {
                return executeSkipForWhere_;
            }
            else if (this.limitRecord) {
                return executeLimitForWhere_;
            }

        }
        return executeSimpleForWhere_;
    })();

    return promise<any>((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onSuccess.call(this, res);
    })

}

const executeSkipAndLimitForWhere_ = function (this: Select, onFinish) {
    let recordSkipped = false;
    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
            if (recordSkipped && this.results.length !== this.limitRecord) {
                const value = cursor.value;
                if (this.shouldAddValue(value)) {
                    this.pushResult(value);
                }
                cursor.continue();
            }
            else {
                recordSkipped = true;
                cursor.advance(this.skipRecord);
            }
        }
        else {
            onFinish();
        }
    };
}

const executeSkipForWhere_ = function (this: Select, onFinish) {
    let recordSkipped = false;
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
            if (recordSkipped) {
                const value = cursor.value;
                if (this.shouldAddValue(value)) {
                    this.pushResult(value);
                }
                cursor.continue();
            }
            else {
                recordSkipped = true;
                cursor.advance(this.skipRecord);
            }
        }
        else {
            onFinish();
        }
    };
}

const executeLimitForWhere_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor && this.results.length !== this.limitRecord) {
            const value = cursor.value;
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

const executeSimpleForWhere_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
            const value = cursor.value;
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