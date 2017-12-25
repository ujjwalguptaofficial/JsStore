namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        CursorOpenRequest;
                    value = op ? value[op] : value;
                    CursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                    if (That._checkFlag) {
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    Cursor.update(updateValue(That._query.Set, Cursor.value));
                                    ++That._rowAffected;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                Cursor.update(updateValue(That._query.Set, Cursor.value));
                                ++That._rowAffected;
                                Cursor.continue();
                            }
                        }
                    }

                    CursorOpenRequest.onerror = function (e) {
                        That._errorOccured = true;
                        That.onErrorOccured(e);
                    }
                }
            }
        }
    }
}
