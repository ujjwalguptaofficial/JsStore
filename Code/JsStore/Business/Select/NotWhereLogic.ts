namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class NotWhere extends BaseSelect {
                protected executeWhereUndefinedLogic = function () {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        CursorOpenRequest,
                        executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = (<any>e).target.result;
                                if (Cursor) {
                                    if (RecordSkipped && That._results.length != That._limitRecord) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That._skipRecord);
                                    }
                                }
                            }
                        },
                        executeSkip = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = (<any>e).target.result;
                                if (Cursor) {
                                    if (RecordSkipped) {
                                        That._results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That._skipRecord);
                                    }
                                }
                            }
                        },
                        executeSimple = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = (<any>e).target.result;
                                if (Cursor) {
                                    That._results.push(Cursor.value);
                                    (Cursor as any).continue();
                                }

                            }
                        },
                        executeLimit = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                Cursor = (<any>e).target.result;
                                if (Cursor && That._results.length != That._limitRecord) {
                                    That._results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            }
                        };

                    if (this._query.Order && this._query.Order.By) {
                        if (That._objectStore.indexNames.contains(this._query.Order.By)) {
                            var OrderType = this._query.Order.Type &&
                                this._query.Order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                            this._sorted = true;
                            CursorOpenRequest = this._objectStore.index(That._query.Order.By).
                                openCursor(null, OrderType);
                        }
                        else {
                            var Error = Utils.getError(ErrorType.ColumnNotExist, { ColumnName: this._query.Order.By });
                            throwError(Error);
                        }
                    }
                    else {
                        CursorOpenRequest = this._objectStore.openCursor();
                    }

                    if (this._skipRecord && this._limitRecord) {
                        executeSkipAndLimit();
                    }
                    else if (this._skipRecord) {
                        executeSkip();
                    }
                    else if (this._limitRecord) {
                        executeLimit();
                    }
                    else {
                        executeSimple();
                    }

                    CursorOpenRequest.onerror = function (e) {
                        That._errorOccured = true;
                        That.onErrorOccured(e);
                    };

                }

            }
        }

    }
}
