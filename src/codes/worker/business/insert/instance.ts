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
        var table = this.getTable(this.tableName);
        if (!Array.isArray(this.query.values)) {
            this.onErrorOccured(
                new LogHelper(ERROR_TYPE.NotArray),
                true
            );
        }
        else if (table) {
            try {
                if (this.query.skipDataCheck) {
                    this.insertData(this.query.values);
                }
                else {
                    let valueCheckerInstance = new ValuesChecker(table, this.query.values);
                    valueCheckerInstance.checkAndModifyValues((isError) => {
                        if (isError) {
                            this.onErrorOccured(valueCheckerInstance.error, true);
                        }
                        else {
                            this.insertData(valueCheckerInstance.values);
                        }
                        valueCheckerInstance = undefined;
                    });
                }
                // remove values from query
                this.query.values = undefined;
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this.tableName });
            }
        }
        else {
            new LogHelper(ERROR_TYPE.TableNotExist, { TableName: this.tableName }).throw();
        }
    }

    private onTransactionCompleted() {
        if (this.errorOccured === false) {
            this.onSuccess(this.query.return ? this._valuesAffected : this.rowAffected);
        }
    }

    private onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private insertData(values) {
        var value_index = 0,
            insertDataIntoTable: (value: object) => void;
        if (this.query.return) {
            insertDataIntoTable = function (value) {
                if (value) {
                    var add_result = object_store.add(value);
                    add_result.onerror = this.onErrorOccured.bind(this);
                    add_result.onsuccess = function (e) {
                        this._valuesAffected.push(value);
                        insertDataIntoTable.call(this, values[value_index++]);
                    }.bind(this);
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            insertDataIntoTable = function (value) {
                if (value) {
                    var add_result = object_store.add(value);
                    add_result.onerror = this.onErrorOccured.bind(this);
                    add_result.onsuccess = function (e) {
                        ++this._rowAffected;
                        insertDataIntoTable.call(this, values[value_index++]);
                    }.bind(this);
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        IdbHelper.createTransaction([this.query.into], this.onTransactionCompleted.bind(this));
        var object_store = IdbHelper.transaction.objectStore(this.query.into);
        insertDataIntoTable.call(this, values[value_index++]);
    }
}