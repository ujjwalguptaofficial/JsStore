module JsStore {
    export module Business {
        export module Update {
            export class NotWhere extends BaseUpdate {

                protected executeWhereUndefinedLogic = function () {
                    var That = this,
                        CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            for (var key in That.Query.Set) {
                                Cursor.value[key] = That.Query.Set[key];
                            }
                            Cursor.update(Cursor.value);
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
