import { BaseRemove } from "./base_remove";

export class NotWhere extends BaseRemove {
    protected executeWhereUndefinedLogic() {
        let cursor;
        const cursorRequest = this.objectStore.openCursor();
        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                ++this.rowAffected;
                (cursor as any).continue();
            }
            else {
                this.onQueryFinished();
            }
        };
        cursorRequest.onerror = this.onErrorOccured.bind(this);
    }
}
