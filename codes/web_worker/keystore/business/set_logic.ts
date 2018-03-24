import { Base } from "./base_logic";
import { IInsert, IError } from "../interfaces";
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";

export class Set extends Base {
    _query: IInsert;
    constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        try {
            this._query = query;
            this._onSuccess = onSuccess;
            this._onError = onError;
        }
        catch (ex) {
            console.error(ex);
        }
    }

    public execute() {
        var updateIfExistElseInsert = () => {
            var cursor_request = this._objectStore.index(QueryExecutor._columnName).openCursor(
                IDBKeyRange.only(this._query[QueryExecutor._columnName])
            );
            cursor_request.onsuccess = (e) => {
                var cursor: IDBCursorWithValue = (e as any).target.result;
                if (cursor) {
                    cursor.value['Value'] = this._query;
                    cursor.update(cursor.value);
                }
                else {
                    insertData();
                }
            };

            cursor_request.onerror = (e) => {
                this._errorOccured = true;
                this.onErrorOccured(e);
            };

        };
        var insertData = () => {
            var add_result = this._objectStore.add(this._query);
            add_result.onerror = (e) => {
                this._errorOccured = true;
                this.onErrorOccured(e);
            };
        };
        this.initTransaction();
        updateIfExistElseInsert();
    }

    private initTransaction() {
        IdbHelper.createTransaction([QueryExecutor._tableName], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(QueryExecutor._tableName);
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false && this._onSuccess) {
            this._onSuccess(null);
        }
    }
}