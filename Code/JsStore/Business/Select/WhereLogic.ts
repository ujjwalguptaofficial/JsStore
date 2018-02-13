namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Where extends Like {
               
                private executeSkipAndLimitForWhere() {
                    var record_skipped = false,
                        cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped && this._results.length !== this._limitRecord) {
                                    if (this._whereChecker.check(cursor.value)) {
                                        this._results.push(cursor.value);
                                    }
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
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
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                }

                private executeSkipForWhere() {
                    var record_skipped = false,
                        cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (record_skipped) {
                                    if (this._whereChecker.check(cursor.value)) {
                                        this._results.push(cursor.value);
                                    }
                                    cursor.continue();
                                }
                                else {
                                    record_skipped = true;
                                    cursor.advance(this._skipRecord);
                                }
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
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
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                }

                private executeLimitForWhere() {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor && this._results.length !== this._limitRecord &&
                                this._whereChecker.check(cursor.value)) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor && this._results.length !== this._limitRecord) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                }

                private executeSimpleForWhere() {
                    var cursor;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this._whereChecker.check(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                this._results.push(cursor.value);
                                cursor.continue();
                            } else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                }

                private executeWhereLogic(column, value, op, dir) {
                    value = op ? value[op] : value;
                    this._cursorOpenRequest = this._objectStore.index(column).openCursor(
                        this.getKeyRange(value, op),
                        dir
                    );

                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);

                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimitForWhere();
                    }
                    else if (this._skipRecord) {
                        this.executeSkipForWhere();
                    }
                    else if (this._limitRecord) {
                        this.executeLimitForWhere();
                    }
                    else {
                        this.executeSimpleForWhere();
                    }
                }
            }
        }
    }
}
