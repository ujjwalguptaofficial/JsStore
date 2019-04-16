import { BaseUpdate, updateValue } from "./base_update";

export class NotWhere extends BaseUpdate {

    protected executeWhereUndefinedLogic() {
        let cursor;
        const cursorRequest = this.objectStore.openCursor();
        cursorRequest.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                cursor.update(updateValue(this.query.set, cursor.value));
                ++this.rowAffected;
                (cursor as any).continue();
            }
            else {
                this.onQueryFinished();
            }

        };
        cursorRequest.onerror = this.onErrorOccured;
    }
}
