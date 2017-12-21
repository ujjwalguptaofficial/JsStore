namespace JsStore {
    export namespace Business {
        export namespace Update {
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
                                            Cursor.update(updateValue(That.Query.Set, Cursor.value));
                                            ++That.RowAffected;
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
                        for (var i = 0, length = values.length; i < length; i++) {
                            if (!That.ErrorOccured) {
                                CursorOpenRequest = ColumnStore.openCursor(IDBKeyRange.only(values[i]));
                                CursorOpenRequest.onsuccess = function (e) {
                                    Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        Cursor.update(updateValue(That.Query.Set, Cursor.value));
                                        ++That.RowAffected;
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

                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                }
            }
        }
    }
}
