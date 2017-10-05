module JsStore {
    export module Business {
        export module Count {
            export class Where extends Like {
                private executeWhereLogic = function (column, value, op) {
                    var That = this;
                    value = op ? value[op] : value;
                    if (That.CheckFlag) {
                        var Cursor: IDBCursorWithValue,
                            CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
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
                    else {
                        if (this.ObjectStore.count) {
                            var CountRequest = this.ObjectStore.index(column).count(this.getKeyRange(value, op));
                            CountRequest.onsuccess = function () {
                                That.ResultCount = CountRequest.result;
                            }
                            CountRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(e);
                            }
                        }
                        else {
                            var Cursor: IDBCursorWithValue,
                                CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
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
        }
    }
}
