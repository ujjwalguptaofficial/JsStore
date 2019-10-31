import { BaseUpdate, updateValue } from "./base_update";

export class NotWhere extends BaseUpdate {

    protected executeWhereUndefinedLogic() {
        let cursor: IDBCursorWithValue;
        const cursorRequest: IDBRequest<IDBCursorWithValue> = this.objectStore.openCursor();
        cursorRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                try {
                    cursor.update(updateValue(this.query.set, cursor.value));
                    ++this.rowAffected;
                    cursor.continue();
                } catch (err) {
                    this.transaction.abort();
                    this.onErrorOccured(err);
                }
            }
            else {
                this.onQueryFinished();
            }

        };
        cursorRequest.onerror = this.onErrorOccured;
    }
}
