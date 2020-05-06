import { NotWhere } from "./not_where";
import { promiseAll, promise } from "../../helpers/index";

let shouldAddValue: () => boolean;
let skipOrPush: (val) => void;
let skip;
let cursor: IDBCursorWithValue;
export class In extends NotWhere {
    protected executeInLogic(column, values) {
        skip = this.skipRecord;
        skipOrPush = (val) => {
            if (skip === 0) {
                this.pushResult(val);
            }
            else {
                --skip;
            }
        };
        shouldAddValue = () => {
            return this.whereCheckerInstance.check(cursor.value);
        };
        if (this.shouldEvaluateLimitAtEnd === false && this.isOrderWithSkip === false) {
            if (this.skipRecord && this.limitRecord) {
                this.executeSkipAndLimitForIn_(column, values);
            }
            else if (this.skipRecord) {
                this.executeSkipForIn_(column, values);
            }
            else if (this.limitRecord) {
                this.executeLimitForIn_(column, values);
            }
            else {
                this.executeSimpleForIn_(column, values);
            }
        }
        else {
            this.executeSimpleForIn_(column, values);
        }
    }

    private executeSkipAndLimitForIn_(column, values) {
        let cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);

        const runInLogic: (val) => Promise<void> = (value) => {
            return promise((res, rej) => {
                cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e: any) => {
                    cursor = e.target.result;
                    if (this.results.length !== this.limitRecord && cursor) {
                        if (shouldAddValue()) {
                            skipOrPush(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };

        promiseAll(
            values.map(function (val) {
                return runInLogic(val);
            })
        ).then(() => {
            this.onQueryFinished();
        }).catch(err => {
            this.onErrorOccured(err);
        });
    }

    private executeSkipForIn_(column, values) {

        let cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        const runInLogic: (val) => Promise<void> = (value) => {
            return promise((res, rej) => {
                cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e: any) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (shouldAddValue()) {
                            skipOrPush((cursor.value));
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };

        promiseAll(
            values.map(function (val) {
                return runInLogic(val);
            })
        ).then(() => {
            this.onQueryFinished();
        }).catch(err => {
            this.onErrorOccured(err);
        });
    }

    private executeLimitForIn_(column, values) {
        let cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        const runInLogic = (value) => {
            return promise((res, rej) => {
                cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e: any) => {
                    cursor = e.target.result;
                    if (cursor && this.results.length !== this.limitRecord) {
                        if (shouldAddValue()) {
                            this.pushResult(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };

        promiseAll(
            values.map(function (val) {
                return runInLogic(val);
            })
        ).then(() => {
            this.onQueryFinished();
        }).catch(err => {
            this.onErrorOccured(err);
        });
    }

    private executeSimpleForIn_(column, values) {
        let cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        const runInLogic = (value) => {
            return promise((res, rej) => {
                cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e: any) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (shouldAddValue()) {
                            this.pushResult(cursor.value);
                        }
                        cursor.continue();
                    }
                    else {
                        res();
                    }
                };
                cursorRequest.onerror = rej;
            });
        };

        promiseAll(
            values.map(function (val) {
                return runInLogic(val);
            })
        ).then(() => {
            this.onQueryFinished();
        }).catch(err => {
            this.onErrorOccured(err);
        });
    }
}