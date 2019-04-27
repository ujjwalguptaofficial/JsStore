import { NotWhere } from "./not_where";
import { updateValue } from "./base_update";
import { promiseAll, promise } from "../../helpers/index";

export class In extends NotWhere {
    private executeInLogic(column, values: any[]) {
        let cursor: IDBCursorWithValue;
        const columnStore = this.objectStore.index(column);
        let cursorRequest;
        const runInLogic: (val) => Promise<void> = (value) => {
            return promise((res, rej) => {
                cursorRequest = columnStore.openCursor(this.getKeyRange(value));
                cursorRequest.onsuccess = (e) => {
                    cursor = e.target.result;
                    if (cursor) {
                        if (this.whereCheckerInstance.check(cursor.value)) {
                            cursor.update(updateValue(this.query.set, cursor.value));
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