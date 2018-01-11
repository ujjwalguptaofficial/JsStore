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
                    var table = this.getTable(query.Into);
                    if (table) {
                        this._query = query;
                        this._onSuccess = onSuccess;
                        this._tableName = this._query.Into;
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
                            this.onExceptionOccured(ex, { TableName: query.Into });
                        }
                    }
                    else {
                        new Error(Error_Type.TableNotExist, { TableName: query.Into }).throw();
                    }
                }

                public onTransactionCompleted = function () {
                    this._onSuccess(this._query.Return ? this._valuesAffected : this._rowAffected);
                };

                private insertAtsDatas(values: any[], atsColumns: string[]) {
                    if (atsColumns.length > 0) {
                        var ats_column_index = 0,
                            value_index = 0,
                            ats_column_name = atsColumns[ats_column_index],
                            key = this.getPrimaryKey(this._tableName),
                            value,
                            ats_value,
                            insertDataIntoTable = function () {
                                value = values[value_index++];
                                if (value) {
                                    ats_value = {};
                                    ats_value[key] = value[key];
                                    ats_value[ats_column_name] = this.getArrayFromWord(value[ats_column_name]);
                                    var add_result = object_store.add(ats_value);
                                    add_result.onerror = this.onErrorOccured.bind(this);
                                    add_result.onsuccess = function (e) {
                                        insertDataIntoTable.call(this);
                                    }.bind(this);
                                }
                                else {
                                    value_index = 0;
                                    ++ats_column_index;
                                    if (ats_column_index < atsColumns.length) {
                                        ats_column_name = atsColumns[ats_column_index];
                                        object_store = this._transaction.objectStore(
                                            this._tableName + "_" + ats_column_name
                                        );
                                        insertDataIntoTable.call(this);
                                    }
                                }
                            };
                        var object_store = this._transaction.objectStore(this._tableName + "_" + ats_column_name);
                        insertDataIntoTable.call(this);
                    }
                }

                private insertData = function (values) {
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
                                this.insertAtsDatas(values, ats_columns);
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
                                this.insertAtsDatas(values, ats_columns);
                            }
                        };
                    }
                    var ats_columns = this.getAtsColumns();
                    this._transaction = db_connection.transaction(
                        [this._query.Into].concat(this.getAtsTables(ats_columns)), "readwrite");
                    // this._transaction = db_connection.transaction([this._query.Into], "readwrite");
                    var object_store = this._transaction.objectStore(this._query.Into);
                    this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                    insertDataIntoTable.call(this, values[value_index++]);
                };
            }
        }
    }
}