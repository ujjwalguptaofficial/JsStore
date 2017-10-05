module JsStore {
    export module Business {
        export module Count {
            export class NotWhere extends BaseCount {

                protected executeWhereUndefinedLogic = function () {
                    var That = this;
                    if (this.ObjectStore.count) {
                        var CountRequest = this.ObjectStore.count();
                        CountRequest.onsuccess = function () {
                            That.ResultCount = CountRequest.result;
                        }
                        CountRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }
                    }
                    else {
                        var Cursor,
                            CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
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
}
