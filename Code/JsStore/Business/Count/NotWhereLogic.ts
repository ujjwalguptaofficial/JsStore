namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class NotWhere extends BaseCount {
                protected executeWhereUndefinedLogic = function () {
                    if (this._objectStore.count) {
                        var count_request = this._objectStore.count();
                        count_request.onsuccess = function () {
                            this._resultCount = count_request.result;
                            this.onQueryFinished();
                        }.bind(this);
                        count_request.onerror = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    }
                    else {
                        var cursor,
                            cursor_request = this._objectStore.openCursor();
                        cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                ++this._resultCount;
                                (cursor as any).continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                        cursor_request.onerror = function (e) {
                            this._errorOccured = true;
                            this.onErrorOccured(e);
                        }.bind(this);
                    }
                };
            }
        }
    }
}
