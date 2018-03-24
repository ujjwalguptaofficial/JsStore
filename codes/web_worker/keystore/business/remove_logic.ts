import { Base } from "./base_logic";
import { IError } from "../interfaces";
import { QueryExecutor } from "../query_executor";
import { IdbHelper } from "./idb_helper";

export class Remove extends Base {
    _key: string;
    _rowAffected: number = 0;
    constructor(key: string, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void) {
        super();
        this._key = key;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    public execute() {
        this.initTransaction();
        var removeData = function (column, value) {
            var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = (e) => {
                this._errorOccured = true;
                this.onErrorOccured(e);
            };
            cursor_request.onsuccess = (e) => {
                var cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    cursor.delete();
                    ++this._rowAffected;
                    cursor.continue();
                }
            };
        }.bind(this);

        if (!this._errorOccured) {
            removeData(QueryExecutor._columnName, this._key);
        }
    }

    private initTransaction() {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    }
}