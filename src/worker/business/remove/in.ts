import { NotWhere } from "./not_where";
import { promise } from "../../helpers/promise";

export class In extends NotWhere {
    protected executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        let runInLogic: (val) => Promise<void>;
        if (this.checkFlag) {
            runInLogic = (value) => {
                return promise((res, rej) => {
                    cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            if (this.whereCheckerInstance.check(cursor.value)) {
                                cursor.delete();
                                ++this.rowAffected;
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
                    cursorRequest = this.objectStore.index(column).
                        openCursor(this.getKeyRange(value));
                    cursorRequest.onsuccess = (e) => {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this.rowAffected;
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