module JsStore {
    export module Business {
        export module Delete {
            export class NotWhere extends BaseDelete {

                protected executeWhereUndefinedLogic = function () {
                    var That = this,
                        CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            Cursor.delete();
                            ++That.RowAffected;
                            (Cursor as any).continue();
                        }

                    }
                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                }

            }
        }

    }
}
