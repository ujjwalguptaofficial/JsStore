import { Base } from "./base_logic";
import { IInsert, IError } from "../interfaces";
import { IdbHelper } from "./idb_helper";
import { QueryExecutor } from "../query_executor";

export class Set extends Base {
    query: IInsert;
    constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        try {
            this.query = query;
            this.onSuccess = onSuccess;
            this.onError = onError;
        }
        catch (ex) {
            console.error(ex);
        }
    }

    execute() {
        const updateIfExistElseInsert = () => {
            const cursorRequest = this.objectStore.index(QueryExecutor.columnName).openCursor(
                IDBKeyRange.only(this.query[QueryExecutor.columnName])
            );
            cursorRequest.onsuccess = (e) => {
                const cursor: IDBCursorWithValue = (e as any).target.result;
                if (cursor) {
                    cursor.update(this.query);
                }
                else {
                    insertData();
                }
            };

            cursorRequest.onerror = (e) => {
                this.errorOccured = true;
                this.onErrorOccured(e);
            };

        };
        const insertData = () => {
            const addResult = this.objectStore.add(this.query);
            addResult.onerror = (e) => {
                this.errorOccured = true;
                this.onErrorOccured(e);
            };
        };
        this.initTransaction();
        updateIfExistElseInsert();
    }

    private initTransaction() {
        IdbHelper.createTransaction([QueryExecutor.tableName], this.onTransactionCompleted.bind(this));
        this.objectStore = IdbHelper._transaction.objectStore(QueryExecutor.tableName);
    }

    private onTransactionCompleted() {
        if (this.errorOccured === false && this.onSuccess) {
            this.onSuccess(null);
        }
    }
}