namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    var That = this;
                    value = op ? value[op] : value;
                    if (That._checkFlag) {
                        var Cursor: IDBCursorWithValue,
                            CursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    ++That._resultCount;
                                }
                                Cursor.continue();
                            }
                        }

                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }

                    }
                    else {
                        if (this._objectStore.count) {
                            var CountRequest = this._objectStore.index(column).count(this.getKeyRange(value, op));
                            CountRequest.onsuccess = function () {
                                That._resultCount = CountRequest.result;
                            }
                            CountRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            }
                        }
                        else {
                            var Cursor: IDBCursorWithValue,
                                CursorOpenRequest = this._objectStore.index(column).openCursor(this.getKeyRange(value, op));
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = (<any>e).target.result;
                                if (Cursor) {
                                    ++That._resultCount;
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
        }
    }
}
