import { Base } from "./base_logic";
import { IError } from "../interfaces";
import { QueryExecutor } from "../query_executor";
import { IdbHelper } from "./idb_helper";

export class Get extends Base {
    key: string;
    constructor(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        super();
        this.key = key;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        const getData = (column, value) => {
            const cursorRequest = this.objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursorRequest.onerror = (e) => {
                this.errorOccured = true;
                this.onErrorOccured(e);
            };
            cursorRequest.onsuccess = (e: any) => {
                const cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    this.results = cursor.value['Value'];
                }
            };
        };
        this.initTransaction_();
        getData(QueryExecutor.columnName, this.key);

    }

    private initTransaction_() {
        IdbHelper.createTransaction([QueryExecutor.tableName], this.onTransactionCompleted_, 'readonly');
        this.objectStore = IdbHelper. transaction.objectStore(QueryExecutor.tableName);
    }

    private onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.results);
        }
    }
}
