import { Base } from "../base";
import { InsertQuery } from "../../types";
import { Table } from "../../model/index";
import { IError } from "../../interfaces";
import { promise } from "../../helpers/promise";

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
        if (this.error == null) {
            this.onError(this.error);
        }
        else {
            this.onSuccess(this.query.return === true ? this.valuesAffected_ : this.rowAffected);
        }
    }

    private onQueryFinished_() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private insertData_(values: any[]) {
        // let valueIndex = 0;
        let insertDataIntoTable: (value: object) => Promise<void>;
        let objectStore;
        const processName = this.query.upsert === true ? "put" : "add";
        if (this.query.return === true) {
            insertDataIntoTable = (value) => {
                return promise((res, rej) => {
                    const addResult = objectStore[processName](value);
                    addResult.onerror = rej;
                    addResult.onsuccess = (e) => {
                        this.valuesAffected_.push(value);
                        res();
                    };
                });

            };
        }
        else {
            insertDataIntoTable = (value) => {
                return promise((res, rej) => {
                    const addResult = objectStore[processName](value);
                    addResult.onerror = rej;
                    addResult.onsuccess = (e) => {
                        ++this.rowAffected;
                        res();
                    };
                });
            };
        }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        objectStore = this.transaction.objectStore(this.query.into);
        Promise.all(
            values.map(function (val) {
                return insertDataIntoTable(val);
            })
        ).then(() => {
            this.onQueryFinished_();
        }).catch((err) => {
            this.transaction.abort();
            this.onErrorOccured(err);
        });
        // insertDataIntoTable(values[valueIndex++]);
    }
}