namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class Instance extends Base {
                _valuesAffected = [];
                _query: IInsert;
                _table: Table;

                constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
                    super();
                    this._onError = onError;
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._tableName = this._query.Into;
                }

                execute() {
                    var table = this.getTable(this._tableName);
                    if (!Array.isArray(this._query.Values)) {
                        this.onErrorOccured(
                            new Error(Error_Type.NotArray).get(),
                            true
                        );
                    }
                    else if (table) {
                        try {
                            if (this._query.SkipDataCheck) {
                                this.insertData(this._query.Values);
                            }
                            else {
                                var value_checker_obj = new ValuesChecker(table, this._query.Values);
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
                            this._query.Values = undefined;
                        }
                        catch (ex) {
                            this.onExceptionOccured(ex, { TableName: this._tableName });
                        }
                    }
                    else {
                        new Error(Error_Type.TableNotExist, { TableName: this._tableName }).throw();
                    }
                }

                private onTransactionCompleted() {
                    this._onSuccess(this._query.Return ? this._valuesAffected : this._rowAffected);
                }

                private onQueryFinished() {
                    if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                }

                private insertData(values) {
                    var value_index = 0,
                        insertDataIntoTable: (value: object) => void;
                    if (this._query.Return) {
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
                    createTransaction([this._query.Into], this.onTransactionCompleted.bind(this));
                    var object_store = db_transaction.objectStore(this._query.Into);
                    insertDataIntoTable.call(this, values[value_index++]);
                }
            }
        }
    }
}