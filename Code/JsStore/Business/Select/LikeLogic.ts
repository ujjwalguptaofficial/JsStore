namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Like extends In {
                CompSymbol: Occurence;
                CompValue;
                Column;
                CompValueLength: Number;
                private filterOnOccurence = function (value) {
                    var Found = false;
                    value = value.toLowerCase();
                    switch (this.CompSymbol) {
                        case Occurence.Any: if (value.indexOf(this.CompValue) >= 0) {
                            Found = true;
                        }; break;
                        case Occurence.First: if (value.indexOf(this.CompValue) == 0) {
                            Found = true;
                        }; break;
                        default: if (value.lastIndexOf(this.CompValue) == value.length - this.CompValueLength) {
                            Found = true;
                        };
                    }
                    return Found;
                }

                private executeSkipAndLimit = function () {
                    var Cursor: IDBCursorWithValue,
                        Skip = this._skipRecord,
                        That = this,
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That._results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That._results.length != That._limitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.key) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    skipOrPush(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That._results.length != That._limitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.key)) {
                                    skipOrPush(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }

                private executeSkip = function () {
                    var Cursor: IDBCursorWithValue,
                        Skip = this._skipRecord,
                        That = this,
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That._results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    skipOrPush((Cursor.value));
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key)) {
                                    skipOrPush((Cursor.value));
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }

                private executeLimit = function () {
                    var Cursor: IDBCursorWithValue,
                        That = this;
                    if (That._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That._results.length != That._limitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.key) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    That._results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That._results.length != That._limitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.key)) {
                                    That._results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }

                private executeSimple = function () {
                    var Cursor: IDBCursorWithValue,
                        That = this;
                    if (That._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    That._results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.key)) {
                                    That._results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var That = this;
                    this.CompValue = (<string>value).toLowerCase();
                    this.CompValueLength = this.CompValue.length;
                    this.CompSymbol = symbol;
                    this.Column = column;
                    this.CursorOpenRequest = this._objectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
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
                }
            }
        }
    }
}