import { NotWhere } from "./not_where";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        const columnStore = this.objectStore.index(column);
        const valueLength = values.length;
        let processedIn = 0;
        const onQueryFinished = () => {
            ++processedIn;
            if (processedIn === valueLength) {
                this.onQueryFinished();
            }
        };
        if (this.checkFlag) {
            for (let i = 0; i < valueLength; i++) {
                if (!this.error) {
                    cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                ++this.resultCount;
                            }
                            cursor.continue();
                        }
                        else {
                            onQueryFinished();
                        }
                    };
                    cursorRequest.onerror = this.onErrorOccured;
                }
            }
        }
        else {
            if (this.objectStore.count) {
                for (let i = 0; i < valueLength; i++) {
                    if (!this.error) {
                        cursorRequest = columnStore.count(IDBKeyRange.only(values[i]));
                        cursorRequest.onsuccess = (e) => {
                            this.resultCount += e.target.result;
                            onQueryFinished();
                        };
                        cursorRequest.onerror = this.onErrorOccured;
                    }
                }
            }
            else {
                for (let i = 0; i < valueLength; i++) {
                    if (!this.error) {
                        cursorRequest = columnStore.openCursor(IDBKeyRange.only(values[i]));
                        cursorRequest.onsuccess = (e) => {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this.resultCount;
                                cursor.continue();
                            }
                            else {
                                onQueryFinished();
                            }
                        };
                        cursorRequest.onerror = this.onErrorOccured;
                    }
                }
            }
        }
    }
}