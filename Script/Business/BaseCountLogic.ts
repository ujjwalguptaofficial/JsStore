module JsStore {
    export module Business {
        export class BaseCountLogic extends BaseSelectLogic {
            ResultCount: number = 0;
            Query: ICount;

            protected executeMultipleWhereInLogic = function (whereInArray: Array<IWhereIn>) {
                var That = this,
                    WhereIn,
                    KeyRange: IDBKeyRange

                for (WhereIn in whereInArray) {
                    KeyRange = this.getKeyRange();
                    if (!this.ErrorOccured) {
                        var CursorOpenRequest,
                            OnCursorSuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    ++That.ResultCount;
                                    Cursor.continue();
                                }
                            },
                            OnCursorError = function (e) {
                                That.ErrorOccured = true;
                                That.OnErrorRequest(e);
                            };
                        if (this.Query.WhereIn.Op == '-') {
                            CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = OnCursorSuccess;
                            CursorOpenRequest.onerror = OnCursorError;
                        }
                        else if (this.ObjectStore.indexNames.contains(WhereIn.Column)) {
                            CursorOpenRequest = this.ObjectStore.index(WhereIn.Column).openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = OnCursorSuccess;
                            CursorOpenRequest.onerror = OnCursorError;
                        }
                        else {
                            UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                        }
                    }
                    else {
                        return;
                    }
                }
            }

            protected executeSingleWhereInLogic = function (whereIn: IWhereIn) {
                var That: CountLogic = this,
                    KeyRange: IDBKeyRange = this.getKeyRange(whereIn);

                if (!this.ErrorOccured) {
                    var CursorOpenRequest,
                        OnCursorSuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                ++That.ResultCount;
                                Cursor.continue();
                            }

                        },
                        OnCursorError = function (e) {
                            this.ErrorOccured = true;
                            this.OnErrorRequest(e);
                        };
                    if (whereIn.Op == '-') {
                        CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                        CursorOpenRequest.onsuccess = OnCursorSuccess;
                        CursorOpenRequest.onerror = OnCursorError;
                    }
                    else if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                        CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                        CursorOpenRequest.onsuccess = OnCursorSuccess;
                        CursorOpenRequest.onerror = OnCursorError;
                    }
                    else {
                        UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                    }
                }
            }
        }
    }
}

