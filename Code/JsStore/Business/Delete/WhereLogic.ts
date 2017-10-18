module JsStore {
    export module Business {
        export module Delete {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        CursorOpenRequest;
                    value = op ? value[op] : value;
                    CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                    if (That.CheckFlag) {
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    Cursor.delete();
                                    ++That.RowAffected;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
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
