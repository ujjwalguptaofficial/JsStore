import { In } from "./in";
import { OCCURENCE } from "../../enums";

export class Like extends In {

    protected executeLikeLogic(column, value, symbol: OCCURENCE) {
        let cursor: IDBCursorWithValue;
        this.compValue = (value as string).toLowerCase();
        this.compValueLength = this.compValue.length;
        this.compSymbol = symbol;
        const cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onCursorError;
        if (this.checkFlag) {
            cursorRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        ++this.resultCount;
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
                        ++this.resultCount;
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