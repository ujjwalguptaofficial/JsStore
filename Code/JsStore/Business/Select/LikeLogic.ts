namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Like extends In {
                _compSymbol: Occurence;
                _compValue;
                _compValueLength: number;

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    this._compValue = (value as string).toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    this._cursorOpenRequest = this._objectStore.index(column).openCursor();
                    this._cursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._skipRecord && this._limitRecord) {
                        this.executeSkipAndLimit();
                    }
                    else if (this._skipRecord) {
                        this.executeSkip();
                    }
                    else if (this._limitRecord) {
                        this.executeLimit();
                    }
                    else {
                        this.executeSimple();
                    }
                };

                private filterOnOccurence = function (value) {
                    var found = false;
                    value = value.toLowerCase();
                    switch (this._compSymbol) {
                        case Occurence.Any: if (value.indexOf(this._compValue) >= 0) {
                            found = true;
                        } break;
                        case Occurence.First: if (value.indexOf(this._compValue) === 0) {
                            found = true;
                        } break;
                        default: if (value.lastIndexOf(this._compValue) === value.length - this._compValueLength) {
                            found = true;
                        }
                    }
                    return found;
                };

                private executeSkipAndLimit = function () {
                    var cursor: IDBCursorWithValue,
                        skip = this._skipRecord,
                        skipOrPush = function (value) {
                            if (skip === 0) {
                                this._results.push(value);
                            }
                            else {
                                --skip;
                            }
                        }.bind(this);
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this.checkForWhereConditionMatch(cursor.value)) {
                                    skipOrPush(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    skipOrPush(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                };

                private executeSkip = function () {
                    var cursor: IDBCursorWithValue,
                        skip = this._skipRecord,
                        skipOrPush = function (value) {
                            if (skip === 0) {
                                this._results.push(value);
                            }
                            else {
                                --skip;
                            }
                        }.bind(this);
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this.checkForWhereConditionMatch(cursor.value)) {
                                    skipOrPush((cursor.value));
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    skipOrPush((cursor.value));
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                };

                private executeLimit = function () {
                    var cursor: IDBCursorWithValue;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this.checkForWhereConditionMatch(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (this._results.length !== this._limitRecord && cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                };

                private executeSimple = function () {
                    var cursor: IDBCursorWithValue;
                    if (this._checkFlag) {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this.checkForWhereConditionMatch(cursor.value)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                    else {
                        this._cursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    this._results.push(cursor.value);
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                };
            }
        }
    }
}