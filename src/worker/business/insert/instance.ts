import { Base } from "../base";
import { InsertQuery } from "../../types";
import { Table } from "../../model/index";
import { IError } from "../../interfaces";
import { promiseAll, promise } from "../../helpers/index";

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
            this.onSuccess(this.query.return === true ? this.valuesAffected_ : this.rowAffected);
        }
        else {
            this.onError(this.error);
        }
    }

    private onQueryFinished_() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private insertData_(values: any[]) {
        // let valueIndex = 0;

        let objectStore: IDBObjectStore;
        const processName = this.query.upsert === true ? "put" : "add";
        let onInsertData;
        if (this.query.return === true) {
            onInsertData = (value) => {
                this.valuesAffected_.push(value);
            };

        }
        else {
            onInsertData = (value) => {
                ++this.rowAffected;
            };
        }

        // let primaryKey = this.query.upsert && this.getPrimaryKey(this.query.into);
        // if (primaryKey && !this.getColumnInfo(primaryKey).autoIncrement) {
        //     primaryKey = null;
        // }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        objectStore = this.transaction.objectStore(this.query.into);
        promiseAll(
            values.map(function (value) {
                // let primaryKeyVal;
                // if (primaryKey) {
                //     primaryKeyVal = value[primaryKeyVal];
                // }
                return promise(function (res, rej) {
                    const addResult = objectStore[processName](value);
                    addResult.onerror = rej;
                    addResult.onsuccess = function () {
                        onInsertData(value);
                        res();
                    };
                });
            })
        ).then(() => {
            this.onQueryFinished_();
        }).catch((err) => {
            this.transaction.abort();
            this.onErrorOccured(err);
        });
    }
}