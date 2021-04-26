import { BaseFetch } from "../base_fetch";
import { Select } from ".";
import { promise } from "@/common";


export const executeRegexLogic = function (this: BaseFetch, column, exp: RegExp) {

    let skip = this.skipRecord;
    const skipOrPush = (val) => {
        if (skip === 0) {
            (this as Select).pushResult(val);
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

    const onSuccess = (() => {
        if (this.shouldEvaluateLimitAtEnd === false && this.shouldEvaluateSkipAtEnd === false) {
            if (this.skipRecord && this.limitRecord) {
                return executeSkipAndLimitForRegex_;
            }
            else if (this.skipRecord) {
                return executeSkipForRegex_;
            }
            else if (this.limitRecord) {
                return executeLimitForRegex_;
            }
        }
        return executeSimpleForRegex_;
    })();

    return promise<any>((res, rej) => {
        cursorRequest.onerror = rej;
        cursorRequest.onsuccess = onSuccess.call(this, res, skipOrPush);
    })

}

const executeSkipAndLimitForRegex_ = function (this: Select, onFinish, skipOrPush) {
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

const executeSkipForRegex_ = function (this: Select, onFinish, skipOrPush) {
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

const executeLimitForRegex_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor = e.target.result;
        if (this.results.length !== this.limitRecord && cursor) {
            if (this.shouldAddValue(cursor)) {
                this.pushResult(cursor.value);
            }
            cursor.continue();
        } else {
            onFinish();
        }
    };
}

const executeSimpleForRegex_ = function (this: Select, onFinish) {
    return (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
            if (this.shouldAddValue(cursor)) {
                this.pushResult(cursor.value);
            }
            cursor.continue();
        } else {
            onFinish();
        }
    };
}
