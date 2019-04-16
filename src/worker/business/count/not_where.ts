import { BaseCount } from "./base_count";

export class NotWhere extends BaseCount {
    protected executeWhereUndefinedLogic() {
        if (this.objectStore.count) {
            const countRequest = this.objectStore.count();
            countRequest.onsuccess = () => {
                this.resultCount = countRequest.result;
                this.onQueryFinished();
            };
            countRequest.onerror = this.onErrorOccured;
        }
        else {
            let cursor;
            const cursorRequest = this.objectStore.openCursor();
            cursorRequest.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    ++this._resultCount;
                    (cursor as any).continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
            cursorRequest.onerror = this.onErrorOccured;
        }
    }
}
