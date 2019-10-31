import { BaseUpdate, updateValue } from "./base_update";

export class NotWhere extends BaseUpdate {

    protected executeWhereUndefinedLogic() {
        let cursor: IDBCursorWithValue;
        const cursorRequest: IDBRequest<IDBCursorWithValue> = this.objectStore.openCursor();
        cursorRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                try {
                    const cursorUpdateRequest = cursor.update(updateValue(this.query.set, cursor.value));
                    cursorUpdateRequest.onsuccess = () => {
                        ++this.rowAffected;
                        cursor.continue();
                    };
                    cursorUpdateRequest.onerror = this.onErrorOccured.bind(this);
                } catch (err) {
                    this.onErrorOccured(err);
                    this.transaction.abort();
                }
            }
            else {
                this.onQueryFinished();
            }

        };
        cursorRequest.onerror = this.onErrorOccured.bind(this);
    }
}
