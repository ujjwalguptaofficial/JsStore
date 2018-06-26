import { Base } from "../base";
import { IInsert, IError } from "../../interfaces";
import { Table } from "../../model/table";
import { ERROR_TYPE } from "../../enums";
import { LogHelper } from "../../log_helper";
import { ValuesChecker } from "./values_checker";
import { IdbHelper } from '../idb_helper';

export class Instance extends Base {
    _valuesAffected = [];
    query: IInsert;
    _table: Table;

    constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
        super();
        this.onError = onError;
        this.query = query;
        this.onSuccess = onSuccess;
        this.tableName = this.query.into;
    }

    execute() {
        try {
            this.insertData(this.query.values);
        }
        catch (ex) {
            this.onExceptionOccured(ex, { TableName: this.tableName });
        }
    }

    private onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.query.return ? this._valuesAffected : this.rowAffected);
        }
    }

    private onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private insertData(values) {
        let valueIndex = 0,
            insertDataIntoTable: (value: object) => void;
        if (this.query.return) {
            insertDataIntoTable = (value) => {
                if (value) {
                    const addResult = objectStore.add(value);
                    addResult.onerror = this.onErrorOccured.bind(this);
                    addResult.onsuccess = (e) => {
                        this._valuesAffected.push(value);
                        insertDataIntoTable.call(this, values[valueIndex++]);
                    };
                }
                else {
                    this.onQueryFinished();
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
                    this.onQueryFinished();
                }
            };
        }
        this.createTransaction([this.query.into], this.onTransactionCompleted_);
        const objectStore = this.transaction.objectStore(this.query.into);
        insertDataIntoTable(values[valueIndex++]);
    }
}