namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class NotWhere extends BaseDelete {

                protected executeWhereUndefinedLogic = function () {
                    var Cursor,
                        That = this,
                        CursorOpenRequest = this._objectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        Cursor = (<any>e).target.result;
                        if (Cursor) {
                            Cursor.delete();
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
