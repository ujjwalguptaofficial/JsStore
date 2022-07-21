import { Select } from "./index";
import { LogHelper, promiseReject } from "@/worker/utils";
import { ERROR_TYPE, IOrderQuery, promise } from "@/common";

export const executeWhereUndefinedLogic = function (this: Select) {
    let cursorRequest: IDBRequest;
    const orderQuery = this.query.order;
    if (orderQuery && (orderQuery as IOrderQuery).idbSorting !== false && (orderQuery as IOrderQuery).by) {
        if (this.objectStore.indexNames.contains((orderQuery as IOrderQuery).by as string)) {
            const orderType: IDBCursorDirection = (orderQuery as IOrderQuery).type &&
                (orderQuery as IOrderQuery).type.toLowerCase() === 'desc' ? 'prev' : 'next';
            this.sorted = true;
            cursorRequest = this.objectStore.index((orderQuery as IOrderQuery).by as string).
                openCursor(null, orderType);
        }
        else {
            return promiseReject(
                new LogHelper(
                    ERROR_TYPE.ColumnNotExist,
                    { column: (orderQuery as IOrderQuery).by, isOrder: true }
                )
            );
        }
    }
    else {
        cursorRequest = this.objectStore.openCursor();
    }
    const onSuccess = (() => {
        if (this.shouldEvaluateLimitAtEnd === false && this.shouldEvaluateSkipAtEnd === false) {
            if (this.skipRecord && this.limitRecord) {
                return executeSkipAndLimit;
            }
            else if (this.skipRecord) {
                return executeSkip;
            }
            else if (this.limitRecord) {
                return executeLimit;
            }
        }
        return executeSimple;
    })();
    return promise<void>((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onSuccess.call(this, res);
    });
}

const executeSkipAndLimit = function (this: Select, onFinished) {
    let recordSkipped = false,
        cursor: IDBCursorWithValue;
    return (e) => {
        cursor = (e as any).target.result;
        if (cursor) {
            if (recordSkipped && this.results.length !== this.limitRecord) {
                this.pushResult(cursor.value);
                cursor.continue();
            }
            else {
                recordSkipped = true;
                cursor.advance(this.skipRecord);
            }
        } else {
            onFinished();
        }
    };
}

const executeSkip = function (this: Select, onFinished) {
    let recordSkipped = false,
        cursor;
    return (e: any) => {
        cursor = e.target.result;
        if (cursor) {
            if (recordSkipped) {
                this.pushResult(cursor.value);
                cursor.continue();
            }
            else {
                recordSkipped = true;
                cursor.advance(this.skipRecord);
            }
        } else {
            onFinished();
        }
    };
}

const executeSimple = function (this: Select, onFinished) {
    let cursor;
    return (e: any) => {
        cursor = e.target.result;
        if (cursor) {
            this.pushResult(cursor.value);
            (cursor as any).continue();
        }
        else {
            onFinished();
        }
    };
}

const executeLimit = function (this: Select, onFinished) {
    let cursor;
    return (e: any) => {
        cursor = e.target.result;
        if (cursor && this.results.length !== this.limitRecord) {
            this.pushResult(cursor.value);
            cursor.continue();
        } else {
            onFinished();
        }
    };
}
