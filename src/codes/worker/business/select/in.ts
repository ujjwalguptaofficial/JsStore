import { NotWhere } from "./not_where";

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
        const onCursorError = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (this.results.length !== this.limitRecord && cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                skipOrPush(cursor.value);
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (this.results.length !== this.limitRecord && cursor) {
                            skipOrPush(cursor.value);
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
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
        const onCursorError = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                skipOrPush((cursor.value));
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            skipOrPush((cursor.value));
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
    }

    private executeLimitForIn_(column, values) {
        let cursor: IDBCursorWithValue,
            cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column);
        const onCursorError = (e) => {
            this.errorOccured = true;
            this.onErrorOccured(e);
        };
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor && this.results.length !== this.limitRecord) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                this.results.push(cursor.value);
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor && this.results.length !== this.limitRecord) {
                            this.results.push(cursor.value);
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
    }

    private executeSimpleForIn_(column, values) {
        let cursor: IDBCursorWithValue,
            cursorRequest: IDBRequest;
        const columnStore = this.objectStore.index(column),
            onCursorError = (e) => {
                this.errorOccured = true;
                this.onErrorOccured(e);
            };
        if (this.checkFlag) {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                this.results.push(cursor.value);
                            }
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
        else {
            for (let i = 0, length = values.length; i < length; i++) {
                if (!this.errorOccured) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e: any) => {
                        cursor = e.target.result;
                        if (cursor) {
                            this.results.push(cursor.value);
                            cursor.continue();
                        }
                        else if (i + 1 === length) {
                            this.onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = onCursorError;
                }
            }
        }
    }
}