namespace JsStore {
    export namespace Business {
        export namespace Remove {
            export class NotWhere extends BaseRemove {
                protected executeWhereUndefinedLogic = function () {
                    var cursor,
                        cursor_request = this._objectStore.openCursor();
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();
                            ++this._rowAffected;
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
                };
            }
        }
    }
}
