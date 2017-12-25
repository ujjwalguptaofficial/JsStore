namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class NotWhere extends BaseCount {

                protected executeWhereUndefinedLogic = function () {
                    var That = this;
                    if (this._objectStore.count) {
                        var CountRequest = this._objectStore.count();
                        CountRequest.onsuccess = function () {
                            That._resultCount = CountRequest.result;
                        }
                        CountRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }
                    }
                    else {
                        var Cursor,
                            CursorOpenRequest = this._objectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                ++That._resultCount;
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
