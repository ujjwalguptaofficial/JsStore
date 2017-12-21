namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class In extends NotWhere {
                private executeInLogic = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        ColumnStore = this.ObjectStore.index(column),
                        CursorOpenRequest;
                    if (That.CheckFlag) {
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            ++That.ResultCount;
                                        }
                                        Cursor.continue();
                                    }
                                }
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorOccured(e);
                                }
                            }
                        }
                    }
                    else {
                        if (this.ObjectStore.count) {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = ColumnStore.count(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        That.ResultCount += (<any>e).target.result;
                                    }
                                    CursorOpenRequest.onerror = function (e) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(e);
                                    }
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (!That.ErrorOccured) {
                                    CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        Cursor = (<any>e).target.result;
                                        if (Cursor) {
                                            ++That.ResultCount;
                                            Cursor.continue();
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

                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                }
            }
        }
    }
}
