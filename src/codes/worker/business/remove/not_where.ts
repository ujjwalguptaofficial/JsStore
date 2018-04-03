import { BaseRemove } from "./base_remove";

export class NotWhere extends BaseRemove {
    protected executeWhereUndefinedLogic() {
        var cursor,
            cursor_request = this._objectStore.openCursor();
        cursor_request.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                cursor.delete();
                ++this._rowAffected;
                (cursor as any).continue();
            }
            else {
                this.onQueryFinished();
            }
        };
        cursor_request.onerror = (e) => {
            this._errorOccured = true;
            this.onErrorOccured(e);
        };
    }
}
