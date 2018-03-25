import { BaseUpdate, updateValue } from "./base_update";

export class NotWhere extends BaseUpdate {

    protected executeWhereUndefinedLogic() {
        var cursor,
            cursor_request = this._objectStore.openCursor();
        cursor_request.onsuccess = (e) => {
            cursor = (e as any).target.result;
            if (cursor) {
                cursor.update(updateValue(this._query.Set, cursor.value));
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
