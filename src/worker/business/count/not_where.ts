import { BaseCount } from "./base_count";

export class NotWhere extends BaseCount {
    protected executeWhereUndefinedLogic() {
        let countRequest;
        if (this.objectStore.count) {
            countRequest = this.objectStore.count();
            countRequest.onsuccess = () => {
                this.resultCount = countRequest.result;
                this.onQueryFinished();
            };
        }
        else {
            let cursor;
            countRequest = this.objectStore.openCursor();
            countRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    ++this.resultCount;
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        countRequest.onerror = this.onErrorOccured.bind(this);
    }
}
