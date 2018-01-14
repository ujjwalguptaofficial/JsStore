namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class NotWhere extends BaseSelect {
                protected executeWhereUndefinedLogic = function () {
                    if (this._query.Order && this._query.Order.By) {
                        if (this._objectStore.indexNames.contains(this._query.Order.By)) {
                            var order_type = this._query.Order.Type &&
                                this._query.Order.Type.toLowerCase() === 'desc' ? 'prev' : 'next';
                            this._sorted = true;
                            this._cursorOpenRequest = this._objectStore.index(this._query.Order.By).
                                openCursor(null, order_type);
                        }
                        else {
                            var error = new Error(Error_Type.ColumnNotExist, { ColumnName: this._query.Order.By });
                            error.throw();
                        }
                    }
                    else {
                        this._cursorOpenRequest = this._objectStore.openCursor();
                    }

                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForNoWhere();
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForNoWhere();
                    }
                    else if (this._limitRecord) {
                        this.executeLimitForNotWhere();
                    }
                    else {
                        this.executeSimpleForNotWhere();
                    }

                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);

                };

                private executeSkipAndLimitForNoWhere = function () {
                    var record_skipped = false,
                        cursor: IDBCursorWithValue;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (record_skipped && this._results.length !== this._limitRecord) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                record_skipped = true;
                                cursor.advance(this._skipRecord);
                            }
                        } else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };

                private executeSkipForNoWhere = function () {
                    var record_skipped = false,
                        cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            if (record_skipped) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                record_skipped = true;
                                cursor.advance(this._skipRecord);
                            }
                        } else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };

                private executeSimpleForNotWhere = function () {
                    var cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor) {
                            this._results.push(cursor.value);
                            (cursor as any).continue();
                        }
                        else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };

                private executeLimitForNotWhere = function () {
                    var cursor;
                    this._cursorOpenRequest.onsuccess = function (e) {
                        cursor = e.target.result;
                        if (cursor && this._results.length !== this._limitRecord) {
                            this._results.push(cursor.value);
                            cursor.continue();
                        } else {
                            this.onQueryFinished();
                        }
                    }.bind(this);
                };

            }
        }

    }
}
