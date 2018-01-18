namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class NotWhere extends BaseUpdate {

                protected executeWhereUndefinedLogic = function () {
                    var cursor,
                        cursor_request = this._objectStore.openCursor();
                    cursor_request.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            cursor.update(updateValue(this._query.Set, cursor.value));
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
