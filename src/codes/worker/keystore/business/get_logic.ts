import { Base } from "./base_logic";
import { IError } from "../interfaces";
import { QueryExecutor } from "../query_executor";
import { IdbHelper } from "./idb_helper";

export class Get extends Base {
    _key: string;
    constructor(key: string, onSuccess: (result) => void, onError: (err: IError) => void) {
        super();
        this._key = key;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    public execute() {
        var getData = (column, value) => {
            var cursor_request = this._objectStore.index(column).openCursor(IDBKeyRange.only(value));
            cursor_request.onerror = function (e) {
                this._errorOccured = true;
                this.on_errorOccured(e);
            }.bind(this);
            cursor_request.onsuccess = function (e) {
                var cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    this._results = cursor.value['Value'];
                }
            }.bind(this);
        };
        this.initTransaction();
        getData(QueryExecutor._columnName, this._key);

    }

    private initTransaction() {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._results);
        }
    }
}
