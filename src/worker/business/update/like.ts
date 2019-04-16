import { OCCURENCE } from "../../enums";
import { In } from "./in";
import { updateValue } from "./base_update";

export class Like extends In {
    protected executeLikeLogic(column, value, symbol: OCCURENCE) {
        let cursor: IDBCursorWithValue;
        this.compValue = (value as string).toLowerCase();
        this.compValueLength = this.compValue.length;
        this.compSymbol = symbol;
        const cursorOpenRequest = this.objectStore.index(column).openCursor();
        cursorOpenRequest.onerror = this.onErrorOccured;

        if (this.checkFlag) {
            cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key) &&
                        this.whereCheckerInstance.check(cursor.value)) {
                        cursor.update(updateValue(this.query.set, cursor.value));
                        ++this.rowAffected;
                    }
                    cursor.continue();
                }
                else {
                    this.onQueryFinished();
                }

            };
        }
        else {
            cursorOpenRequest.onsuccess = (e: any) => {
                cursor = e.target.result;
                if (cursor) {
                    if (this.filterOnOccurence(cursor.key)) {
                        cursor.update(updateValue(this.query.set, cursor.value));
                        ++this.rowAffected;
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
