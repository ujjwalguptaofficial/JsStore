module JsStore {
    export module Business {
        export module Update {
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
                                    Cursor.update(updateValue(That.Query.Set, Cursor.value));
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
                                Cursor.update(updateValue(That.Query.Set, Cursor.value));
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
