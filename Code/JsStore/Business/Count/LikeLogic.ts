namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class Like extends In {
                _compSymbol: Occurence;
                _compValue;
                _compValueLength: number;

                protected executeLikeLogic = function (column, value, symbol: Occurence) {
                    var cursor: IDBCursorWithValue;
                    this._compValue = (value as string).toLowerCase();
                    this._compValueLength = this._compValue.length;
                    this._compSymbol = symbol;
                    this.CursorOpenRequest = this._objectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        this._errorOccured = true;
                        this.onErrorOccured(e);
                    }.bind(this);
                    if (this._checkFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key) &&
                                    this._whereChecker.check(cursor.value)) {
                                    ++this._resultCount;
                                }
                                cursor.continue();
                            }
                            else {
                                this.onQueryFinished();
                            }
                        }.bind(this);
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            cursor = e.target.result;
                            if (cursor) {
                                if (this.filterOnOccurence(cursor.key)) {
                                    ++this._resultCount;
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