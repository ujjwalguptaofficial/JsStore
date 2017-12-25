namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class NotWhere extends BaseUpdate {

                protected executeWhereUndefinedLogic = function () {
                    var Cursor,
                        That = this,
                        CursorOpenRequest = this._objectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        Cursor = (<any>e).target.result;
                        if (Cursor) {
                            Cursor.update(updateValue(That._query.Set, Cursor.value));
                            ++That._rowAffected;
                            (Cursor as any).continue();
                        }

                    }
                    CursorOpenRequest.onerror = function (e) {
                        That._errorOccured = true;
                        That.onErrorOccured(e);
                    }
                }

            }
        }

    }
}
