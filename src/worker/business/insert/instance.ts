import { Base } from "../base";
import { InsertQuery } from "../../types";
import { Table } from "../../model/index";
import { IError } from "../../interfaces";

export class Instance extends Base {
    private valuesAffected_ = [];
    query: InsertQuery;
    table: Table;

    constructor(query: InsertQuery, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
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
            this.onExceptionOccured(ex, { tableName: this.tableName });
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
        let valueIndex = 0;
        let insertDataIntoTable: (value: object) => void;
        let objectStore;
        const processName = this.query.upsert === true ? "put" : "add";
        if (this.query.return === true) {
            insertDataIntoTable = (value) => {
                if (value) {
                    const addResult = objectStore[processName](value);
                    addResult.onerror = this.onErrorOccured.bind(this);
                    addResult.onsuccess = (e) => {
                        this.valuesAffected_.push(value);
                        insertDataIntoTable(values[valueIndex++]);
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
                    const addResult = objectStore[processName](value);
                    addResult.onerror = this.onErrorOccured.bind(this);
                    addResult.onsuccess = (e) => {
                        ++this.rowAffected;
                        insertDataIntoTable(values[valueIndex++]);
                    };
                }
                else {
                    this.onQueryFinished_();
                }
            };
        }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        objectStore = this.transaction.objectStore(this.query.into);
        insertDataIntoTable(values[valueIndex++]);
    }
}