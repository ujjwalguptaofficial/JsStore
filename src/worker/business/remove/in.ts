import { NotWhere } from "./not_where";
import { promiseAll, promise } from "../../helpers/index";

export class In extends NotWhere {
    protected executeInLogic(column, values) {
        let cursor: IDBCursorWithValue, cursorRequest;
        const runInLogic: (val) => Promise<void> = (value) => {
            return promise((res, rej) => {
                cursorRequest = this.objectStore.index(column).openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (shouldAddValue()) {
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
        let shouldAddValue: () => boolean;

        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.whereCheckerInstance.check(cursor.value);
            };
        }
        else {
            shouldAddValue = () => {
                return true;
            };
        }

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