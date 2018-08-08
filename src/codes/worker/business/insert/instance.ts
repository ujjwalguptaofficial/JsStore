import { Base } from "../base";
import { IInsert, IError } from "../../interfaces";
import { Table } from "../../model/table";

export class Instance extends Base {
    private valuesAffected_ = [];
    query: IInsert;
    table: Table;

    constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
        super();
        this.onError = onError;
        this.query = query;
        this.onSuccess = onSuccess;
        this.tableName = this.query.into;
    }

    execute() {
        try {
            this.insertData_(this.query.values);
        }
        catch (ex) {
            this.onExceptionOccured(ex, { TableName: this.tableName });
        }
    }

    private onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.query.return === true ? this.valuesAffected_ : this.rowAffected);
        }
    }

    private onQueryFinished_() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private insertData_(values) {
        let valueIndex = 0,
            insertDataIntoTable: (value: object) => void;
        if (this.query.return === true) {
            insertDataIntoTable = (value) => {
                if (value) {
                    const addResult = objectStore.add(value);
                    addResult.onerror = this.onErrorOccured.bind(this);
                    addResult.onsuccess = (e) => {
                        this.valuesAffected_.push(value);
                        insertDataIntoTable.call(this, values[valueIndex++]);
                    };
                }
                else {
                    this.onQueryFinished_();
                }
            };
        }
        else {
            insertDataIntoTable = (value) => {
                if (value) {
                    const addResult = objectStore.add(value);
                    addResult.onerror = this.onErrorOccured.bind(this);
                    addResult.onsuccess = (e) => {
                        ++this.rowAffected;
                        insertDataIntoTable.call(this, values[valueIndex++]);
                    };
                }
                else {
                    this.onQueryFinished_();
                }
            };
        }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        const objectStore = this.transaction.objectStore(this.query.into);
        insertDataIntoTable(values[valueIndex++]);
    }
}