import { In } from "./in";
import { OCCURENCE } from "../../enums";

export class Like extends In {

    protected executeLikeLogic(column, value, symbol: OCCURENCE) {
        let cursor: IDBCursorWithValue;
        this.compValue = (value as string).toLowerCase();
        this.compValueLength = this.compValue.length;
        this.compSymbol = symbol;
        const cursorRequest = this.objectStore.index(column).openCursor();
        cursorRequest.onerror = this.onErrorOccured;
        let shouldAddValue: () => boolean;
        if (this.checkFlag) {
            shouldAddValue = () => {
                return this.filterOnOccurence(cursor.key) &&
                    this.whereCheckerInstance.check(cursor.value);
            };

        }
        else {
            shouldAddValue = () => {
                return this.filterOnOccurence(cursor.key);
            };
        }

        cursorRequest.onsuccess = (e: any) => {
            cursor = e.target.result;
            if (cursor) {
                if (shouldAddValue()) {
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