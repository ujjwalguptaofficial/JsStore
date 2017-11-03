module JsStore {
    export module Business {
        export module Count {
            export class Like extends In {
                CompSymbol: Occurence;
                CompValue;
                Column;
                CompValueLength: Number;

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
                        default: if (Value.lastIndexOf(this.CompValue) == Value.length - this.CompValueLength) {
                            Found = true;
                        };
                    }
                    return Found;
                }

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var Cursor: IDBCursorWithValue,
                        That = this;
                    this.CompValue = (<string>value).toLowerCase();
                    this.CompValueLength = this.CompValue.length;
                    this.CompSymbol = symbol;
                    this.Column = column;
                    this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                    if (That.CheckFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    ++That.ResultCount;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.value)) {
                                    ++That.ResultCount;
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }
            }
        }
    }
}