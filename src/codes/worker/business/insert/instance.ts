import { Base } from "../base";
import { IInsert, IError } from "../../interfaces";
import { Table } from "../../model/table";
import { Error_Type } from "../../enums";
import { LogHelper } from "../../log_helper";
import { ValuesChecker } from "./values_checker";
import { IdbHelper } from '../idb_helper';

export class Instance extends Base {
    _valuesAffected = [];
    _query: IInsert;
    _table: Table;

    constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
        super();
        this._onError = onError;
        this._query = query;
        this._onSuccess = onSuccess;
        this._tableName = this._query.into;
    }

    execute() {
        var table = this.getTable(this._tableName);
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(
                new LogHelper(Error_Type.NotArray),
                true
            );
        }
        else if (table) {
            try {
                if (this._query.skipDataCheck) {
                    this.insertData(this._query.values);
                }
                else {
                    var value_checker_obj = new ValuesChecker(table, this._query.values);
                    value_checker_obj.checkAndModifyValues(function (isError) {
                        if (isError) {
                            this.onErrorOccured(value_checker_obj._error, true);
                        }
                        else {
                            this.insertData(value_checker_obj._values);
                        }
                        value_checker_obj = undefined;
                    }.bind(this));
                }
                // remove values from query
                this._query.values = undefined;
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._tableName });
            }
        }
        else {
            new LogHelper(Error_Type.TableNotExist, { TableName: this._tableName }).throw();
        }
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._query.return ? this._valuesAffected : this._rowAffected);
        }
    }

    private onQueryFinished() {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private insertData(values) {
        var value_index = 0,
            insertDataIntoTable: (value: object) => void;
        if (this._query.return) {
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
        IdbHelper.createTransaction([this._query.into], this.onTransactionCompleted.bind(this));
        var object_store = IdbHelper._transaction.objectStore(this._query.into);
        insertDataIntoTable.call(this, values[value_index++]);
    }
}