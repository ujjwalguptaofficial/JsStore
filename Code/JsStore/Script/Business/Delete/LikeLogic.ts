module JsStore {
    export module Business {
        export module Delete {
            export class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue;
                Column;

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
                    this.CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            if (That.filterOnOccurence(Cursor.value) && That.checkForWhereConditionMatch(Cursor.value)) {
                                Cursor.delete();
                                ++That.RowAffected;
                            }
                            Cursor.continue();
                        }
                    }
                }
            }
        }
    }
}