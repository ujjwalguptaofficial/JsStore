module JsStore {
    export module Business {
        export module Count {
            export class NotWhere extends BaseCount {

                protected executeWhereUndefinedLogic = function () {
                    var That = this,
                        CursorOpenRequest = this.ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = (<any>e).target.result;
                        if (Cursor) {
                            ++That.ResultCount;
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
