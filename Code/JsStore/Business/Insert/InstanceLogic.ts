namespace JsStore {
    export namespace Business {
        export namespace Insert {
            export class Instance extends Base {
                _valuesAffected = [];
                _query: IInsert;
                _table: Table;

                constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
                    super();
                    try {
                        this._query = query;
                        this._onSuccess = onSuccess;
                        this._onError = onError;
                        var table = this.getTable(query.Into);
                        if (table) {
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
                        else {
                            new Error(Error_Type.TableNotExist, { TableName: query.Into }).throw();
                        }
                    }
                    catch (ex) {
                        this.onExceptionOccured(ex, { TableName: query.Into });
                    }
                }

                public onTransactionCompleted = function () {
                    this._onSuccess(this._query.Return ? this._valuesAffected : this._rowAffected);
                };

                private insertData = function (values) {
                    var value_index = 0,
                        insertDataintoTable: (value: object) => void;
                    if (this._query.Return) {
                        insertDataintoTable = function (value) {
                            if (value) {
                                var add_result = object_store.add(value);
                                add_result.onerror = this.onErrorOccured.bind(this);
                                add_result.onsuccess = function (e) {
                                    this._valuesAffected.push(value);
                                    insertDataintoTable.call(this, values[value_index++]);
                                }.bind(this);
                            }
                        };
                    }
                    else {
                        insertDataintoTable = function (value) {
                            if (value) {
                                var add_result = object_store.add(value);
                                add_result.onerror = this.onErrorOccured.bind(this);
                                add_result.onsuccess = function (e) {
                                    ++this._rowAffected;
                                    insertDataintoTable.call(this, values[value_index++]);
                                }.bind(this);
                            }
                        };
                    }
                    this._transaction = db_connection.transaction([this._query.Into], "readwrite");
                    var object_store = this._transaction.objectStore(this._query.Into);
                    this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                    insertDataintoTable.call(this, values[value_index++]);
                };
            }
        }
    }
}