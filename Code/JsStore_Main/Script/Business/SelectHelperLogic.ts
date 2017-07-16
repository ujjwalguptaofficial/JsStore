module JsStore {
    export module Business {
        export class SelectHelperLogic extends BaseSelectLogic {
            Query: ISelect;

            protected executeMultipleWhereInLogic = function (whereInArray: Array<IWhereIn>) {
                var That = this,
                    KeyRange: IDBKeyRange,
                    CurrentIndex = 0,
                    ExecuteLogic = function () {
                        ++CurrentIndex;
                        if (CurrentIndex != whereInArray.length) {
                            That.filterResultBasedOnOp(whereInArray[CurrentIndex]);
                            ExecuteLogic();
                        }
                        else if (That.OnSuccess) {
                            That.OnSuccess(That.Results);
                        }
                    };
                this.SendResultFlag = false;
                this.executeSingleWhereInLogic(whereInArray[CurrentIndex], function () {
                    ExecuteLogic();
                });
            }

            protected executeSingleWhereInLogic = function (whereIn: IWhereIn, callBack: Function = null) {
                var That = this,
                    KeyRange: IDBKeyRange = this.getKeyRange(whereIn);

                if (!this.ErrorOccured) {
                    var CursorOpenRequest,
                        OnCursorSuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                That.Results.push(Cursor.value);
                                Cursor.continue();
                            }
                            else if (callBack) {
                                callBack();
                            }

                        },
                        OnCursorError = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                        if (whereIn.Op == '~' && typeof whereIn.Value == 'string') {
                            var Value = whereIn.Value.toLowerCase(),
                                Column = whereIn.Column;
                            CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    if (Cursor.value[Column].toLowerCase().indexOf(Value) >= 0) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                                else if (callBack) {
                                    callBack();
                                }
                            }
                        }
                        else {
                            CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                            CursorOpenRequest.onsuccess = OnCursorSuccess;
                        }
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

