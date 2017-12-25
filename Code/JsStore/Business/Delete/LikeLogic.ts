namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Like extends In {
                _compSymbol: Occurence;
                _compValue;
                _compValueLength: number;

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var cursor: IDBCursorWithValue;
                    this._compValue = (value as string).toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    this.cursor_request = this._objectStore.index(column).openCursor();
                    this.cursor_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);

                    if (this._checkFlag) {
                        this.cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this.checkForWhereConditionMatch(cursor.value)) {
                                    cursor.delete();
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                        }.bind(this);
                    }
                    else {
                        this.cursor_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    cursor.delete();
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                        }.bind(this);
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
            }
        }
    }
}