module JsStore {
    export module Business {
        export module Select {
            export class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue;
                Column;
                CheckFlag = false;

                private filterOnOccurence = function (value) {
                    var Found = false,
                        Value = value[this.Column].toLowerCase();
                    switch (this.CompSymbol) {
                        case Occurence.Any: if (Value.indexOf(this.CompValue) >= 0) {
                            Found = true;
                        }; break;
                        case Occurence.First: if (Value.indexOf(this.CompValue) == 0) {
                            Found = true;
                        }; break;
                        default: if (Value.lastIndexOf(this.CompValue) == Value.length - 1) {
                            Found = true;
                        };
                    }
                    return Found;
                }

                private executeSkipAndLimit = function () {
                    var Skip = this.SkipRecord,
                        That = this;
                    this.CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (That.Results.length != That.LimitRecord && Cursor) {
                            if (That.filterOnOccurence(Cursor.value) &&
                                That.checkForWhereConditionMatch(Cursor.value)) {
                                if (Skip == 0) {
                                    That.Results.push(Cursor.value);
                                }
                                else {
                                    --Skip;
                                }
                            }
                            Cursor.continue();
                        }
                    }
                }

                private executeSkip = function () {
                    var Skip = this.SkipRecord,
                        That = this;
                    this.CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            if (That.filterOnOccurence(Cursor.value) &&
                                That.checkForWhereConditionMatch(Cursor.value)) {
                                if (Skip == 0) {
                                    That.Results.push(Cursor.value);
                                }
                                else {
                                    --Skip;
                                }
                            }
                            Cursor.continue();
                        }
                    }
                }

                private executeLimit = function () {
                    var That = this;
                    this.CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (That.Results.length != That.LimitRecord && Cursor) {
                            if (That.filterOnOccurence(Cursor.value) &&
                                That.checkForWhereConditionMatch(Cursor.value)) {
                                That.Results.push(Cursor.value);
                            }
                            Cursor.continue();
                        }
                    }
                }

                private executeSimple = function () {
                    var That = this;
                    this.CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            if (That.filterOnOccurence(Cursor.value) && That.checkForWhereConditionMatch(Cursor.value)) {
                                That.Results.push(Cursor.value);
                            }
                            Cursor.continue();
                        }
                    }
                }

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var That = this;
                    this.CompValue = (<string>value).toLowerCase();
                    this.CompSymbol = symbol;
                    this.Column = column;
                    this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                    if (this.SkipRecord && this.LimitRecord) {
                        this.executeSkipAndLimit();
                    }
                    else if (this.SkipRecord) {
                        this.executeSkip();
                    }
                    else if (this.LimitRecord) {
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