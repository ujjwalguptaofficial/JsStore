import { In } from "./in";
import { OCCURENCE } from "../../enums";

export class Like extends In {
    _compSymbol: OCCURENCE;
    _compValue;
    _compValueLength: number;

    protected executeLikeLogic(column, value, symbol: OCCURENCE) {
        let cursor: IDBCursorWithValue;
        this._compValue = (value as string).toLowerCase();
        this._compValueLength = this._compValue.length;
        this._compSymbol = symbol;
        const cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onCursorError;
        if (this.checkFlag) {
            cursorRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        ++this._resultCount;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            cursorRequest.onsuccess = (e: any) => {
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
            };
        }
    }
}