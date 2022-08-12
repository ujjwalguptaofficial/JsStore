import { Select } from "./";
import { promise } from "@/common";
import { BaseFetch } from "../base_fetch";

export const getCursorOnSuccess = function (this: Select, simpleFn, limitFn, skipFn, skipAndLimitFn) {
    if (this.shouldEvaluateLimitAtEnd === false && this.shouldEvaluateSkipAtEnd === false) {
        if (this.skipRecord) {
            return this.limitRecord ? skipAndLimitFn : skipFn
        }
        if (this.limitRecord) {
            return limitFn;
        }
    }
    return simpleFn;
}

export const executeWhereLogic = function (this: BaseFetch, column, value, op, dir) {

    value = op ? value[op] : value;
    const cursorRequest = this.objectStore.index(column).openCursor(
        this.util.keyRange(value, op),
        dir
    );

    const onSuccess = getCursorOnSuccess.call(
        this,
        executeSimpleForWhere_,
        executeLimitForWhere_,
        executeSkipForWhere_,
        executeSkipAndLimitForWhere_
    );

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
                if (this.shouldAddValue(cursor)) {
                    this.pushResult(cursor.value);
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
                if (this.shouldAddValue(cursor)) {
                    this.pushResult(cursor.value);
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

export const executeLimitForWhere_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor && this.results.length !== this.limitRecord) {
            if (this.shouldAddValue(cursor)) {
                this.pushResult(cursor.value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };

}

export const executeSimpleForWhere_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
            if (this.shouldAddValue(cursor)) {
                this.pushResult(cursor.value);
            }
            cursor.continue();
        }
        else {
            onFinish();
        }
    };
}