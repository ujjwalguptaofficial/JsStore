namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class Like extends In {
                _compSymbol: Occurence;
                _compValue;
                _compValueLength: number;

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var cursor: IDBCursorWithValue;
                    this._compValue = (value as string).toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    var cursor_open_request = this._objectStore.index(column).openCursor();
                    cursor_open_request.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);

                    if (this._checkFlag) {
                        cursor_open_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    cursor.update(updateValue(this._query.Set, cursor.value));
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }

                        }.bind(this);
                    }
                    else {
                        cursor_open_request.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    cursor.update(updateValue(this._query.Set, cursor.value));
                                    ++this._rowAffected;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                };
            }
        }
    }
}