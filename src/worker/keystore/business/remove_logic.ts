import { Base } from "./base_logic";
import { IError } from "../interfaces";
import { QueryExecutor } from "../query_executor";
import { IdbHelper } from "./idb_helper";

export class Remove extends Base {
    key: string;
    rowAffected = 0;
    constructor(key: string, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void) {
        super();
        this.key = key;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        this.initTransaction();
        const removeData = (column, value) => {
            const cursorRequest = this.objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursorRequest.onerror = (e) => {
                this.errorOccured = true;
                this.onErrorOccured(e);
            };
            cursorRequest.onsuccess = (e: any) => {
                const cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++this.rowAffected;
                    cursor.continue();
                }
            };
        };

        if (!this.errorOccured) {
            removeData(QueryExecutor.columnName, this.key);
        }
    }

    private initTransaction() {
        IdbHelper.createTransaction([QueryExecutor.tableName], this.onTransactionCompleted.bind(this));
        this.objectStore = IdbHelper. transaction.objectStore(QueryExecutor.tableName);
    }

    private onTransactionCompleted() {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    }
}