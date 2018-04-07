import { In } from "./in";
import { OCCURENCE } from "../../enums";

export class Like extends In {
    _compSymbol: OCCURENCE;
    _compValue;
    _compValueLength: number;

    protected executeLikeLogic(column, value, symbol: OCCURENCE) {
        var cursor: IDBCursorWithValue;
        this._compValue = (value as string).toLowerCase();
        this._compValueLength = this._compValue.length;
        this._compSymbol = symbol;
        var cursor_request = this.objectStore.index(column).openCursor();
        cursor_request.onerror = function (e) {
            this._errorOccured = true;
            this.onErrorOccured(e);
        }.bind(this);

        if (this._checkFlag) {
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this._whereChecker.check(cursor.value)) {
                        cursor.delete();
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
            cursor_request.onsuccess = function (e) {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        cursor.delete();
                        ++this._rowAffected;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            }.bind(this);
        }
    }
}