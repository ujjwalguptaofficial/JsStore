module JsStore {
    export module Business {
        export module OrLogic {
            export module Select {
                export class NotWhere extends BaseSelect {

                    protected executeWhereUndefinedLogic = function () {
                        var That = this,
                            CursorOpenRequest,
                            executeSkipAndLimit = function () {
                                var RecordSkipped = false;
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            },
                            executeSkip = function () {
                                var RecordSkipped = false;
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor) {
                                        if (RecordSkipped) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            RecordSkipped = true;
                                            Cursor.advance(That.SkipRecord);
                                        }
                                    }
                                }
                            },
                            executeSimple = function () {
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor = (<any>e).target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        (Cursor as any).continue();
                                    }

                                }
                            },
                            executeLimit = function () {
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                    if (Cursor && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                }
                            };

                        if (this.Query.Order && this.Query.Order.By) {
                            if (That.ObjectStore.indexNames.contains(this.Query.Order.By)) {
                                var OrderType = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                                this.Sorted = true;
                                CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, OrderType);
                            }
                            else {
                                var Error = Utils.getError(ErrorType.ColumnNotExist, { ColumnName: this.Query.Order.By });
                                throwError(Error);
                            }
                        }
                        else {
                            CursorOpenRequest = this.ObjectStore.openCursor();
                        }

                        if (this.SkipRecord && this.LimitRecord) {
                            executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            executeSkip();
                        }
                        else if (this.LimitRecord) {
                            executeLimit();
                        }
                        else {
                            executeSimple();
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