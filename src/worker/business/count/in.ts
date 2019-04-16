import { NotWhere } from "./not_where";
import { promise } from "../../helpers/promise";

export class In extends NotWhere {
    private executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        const columnStore = this.objectStore.index(column);
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                ++this.resultCount;
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
            if (this.objectStore.count) {
                runInLogic = (value) => {
                    return promise((res, rej) => {
                        cursorRequest = columnStore.count(this.getKeyRange(value));
                        cursorRequest.onsuccess = (e) => {
                            this.resultCount += e.target.result;
                            res();
                        };
                        cursorRequest.onerror = rej;
                    });
                };
            }
            else {
                runInLogic = (value) => {
                    return promise((res, rej) => {
                        cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                        cursorRequest.onsuccess = (e) => {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this.resultCount;
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