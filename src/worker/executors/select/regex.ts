import { BaseFetch } from "../base_fetch";
import { Select } from ".";
import { promise } from "@/common";
import { executeLimitForWhere_, executeSimpleForWhere_, getCursorOnSuccess } from "./where";


export const executeRegexLogic = function (this: BaseFetch, column, exp: RegExp) {

    let skip = this.skipRecord;
    const skipOrPush = (val) => {
        if (skip === 0) {
            (this as Select)['pushResult'](val);
        }
        else {
            --skip;
        }
    };
    this.shouldAddValue = (cursor) => {
        return exp.test(cursor.key) &&
            this.whereCheckerInstance.check(cursor.value);
    };

    const cursorRequest = this.objectStore.index(column).openCursor();

    const onSuccess = getCursorOnSuccess.call(
        this,
        executeSimpleForWhere_,
        executeLimitForWhere_,
        executeSkipForWhere_,
        executeSkipAndLimitForWhere_
    );

    return promise<any>((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onSuccess.call(this, res, skipOrPush);
    })

}

export const executeSkipAndLimitForWhere_ = function (this: Select, onFinish, skipOrPush) {
    return (e: any) => {
        const cursor = e.target.result;
        if (this.results.length !== this.limitRecord && cursor) {
            if (this.shouldAddValue(cursor)) {
                skipOrPush(cursor.value);
            }
            cursor.continue();
        } else {
            onFinish();
        }
    };
}

export const executeSkipForWhere_ = function (this: Select, onFinish, skipOrPush) {
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
            if (this.shouldAddValue(cursor)) {
                skipOrPush((cursor.value));
            }
            cursor.continue();
        } else {
            onFinish();
        }
    };
}




