import { Select } from "./index";
import { LogHelper, promiseReject } from "@/worker/utils";
import { ERROR_TYPE, IOrderQuery, promise, promiseResolve } from "@/common";
import { getCursorOnSuccess } from "./where";

export const executeWhereUndefinedLogic = function (this: Select) {
    let cursorRequest: IDBRequest;
    const query = this.query;
    const store = query.store;
    if (store) {
        this.results = store as any[];
        this.setLimitAndSkipEvaluationAtEnd_();
        return promiseResolve();
    }
    const orderQuery = query.order;
    const objectStore = this.objectStore;
    if (orderQuery && (orderQuery as IOrderQuery).idbSorting !== false && (orderQuery as IOrderQuery).by) {
        if (objectStore.indexNames.contains((orderQuery as IOrderQuery).by as string)) {
            const orderType: IDBCursorDirection = (orderQuery as IOrderQuery).type &&
                (orderQuery as IOrderQuery).type.toLowerCase() === 'desc' ? 'prev' : 'next';
            this.sorted = true;
            cursorRequest = objectStore.index((orderQuery as IOrderQuery).by as string).
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
        cursorRequest = objectStore.openCursor();
    }

    const onSuccess = getCursorOnSuccess.call(
        this,
        executeSimple,
        executeLimit,
        executeSkip,
        executeSkipAndLimit
    );

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
