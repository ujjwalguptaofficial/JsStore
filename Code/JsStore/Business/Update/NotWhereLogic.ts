module JsStore {
    export module Business {
        export module Update {
            export class NotWhere extends BaseUpdate {

                protected executeWhereUndefinedLogic = function () {
                    var Cursor,
                        That = this,
                        CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        Cursor = (<any>e).target.result;
                        if (Cursor) {
                            Cursor.update(updateValue(That.Query.Set, Cursor.value));
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
