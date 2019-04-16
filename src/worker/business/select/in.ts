import { NotWhere } from "./not_where";
import { promise } from "../../helpers/promise";

export class In extends NotWhere {
    protected executeInLogic(column, values) {
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

    private executeSkipAndLimitForIn_(column, values) {
        let cursor: IDBCursorWithValue,
            cursorRequest: IDBRequest,
            skip = this.skipRecord;
        const columnStore = this.objectStore.index(column);
        const skipOrPush = (value) => {
            if (skip === 0) {
                this.results.push(value);
            }
            else {
                --skip;
            }
        };
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (this.results.length !== this.limitRecord && cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
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
        }
        else {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (this.results.length !== this.limitRecord && cursor) {
                            skipOrPush(cursor.value);
                            cursor.continue();
                        }
                        else {
                            res();
                        }
                    };
                    cursorRequest.onerror = rej;
                });
            };
        }

        Promise.all(
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
        let cursor: IDBCursorWithValue,
            skip = this.skipRecord,
            cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        const skipOrPush = (value) => {
            if (skip === 0) {
                this.results.push(value);
            }
            else {
                --skip;
            }
        };
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
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
        }
        else {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            skipOrPush((cursor.value));
                            cursor.continue();
                        }
                        else {
                            res();
                        }
                    };
                    cursorRequest.onerror = rej;
                });
            };
        }

        Promise.all(
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
        let cursor: IDBCursorWithValue,
            cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor && this.results.length !== this.limitRecord) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                this.results.push(cursor.value);
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
        }
        else {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor && this.results.length !== this.limitRecord) {
                            this.results.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            res();
                        }
                    };
                    cursorRequest.onerror = rej;
                });
            };
        }

        Promise.all(
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
        let cursor: IDBCursorWithValue,
            cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                this.results.push(cursor.value);
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
        }
        else {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            this.results.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            res();
                        }
                    };
                    cursorRequest.onerror = rej;
                });
            };
        }

        Promise.all(
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