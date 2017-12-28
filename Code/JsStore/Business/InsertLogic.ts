namespace JsStore {
    export namespace Business {
        export class Insert extends InsertHelper {
            constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void) {
                super();
                try {
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._table = this.getTable(query.Into);
                    if (this._table) {
                        if (this._query.SkipDataCheck) {
                            this.insertData();
                        }
                        else {
                            this.checkModifyInsertValues();
                        }
                    }
                    else {
                        new Error(Error_Type.TableNotExist, { TableName: query.Into }).throw();
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }

            private insertData = function () {
                var value_index = 0,
                    is_return = this._query.Return,
                    insertDataintoTable: (value: object) => void;
                if (is_return) {
                    insertDataintoTable = function (value) {
                        if (value) {
                            var add_result = object_store.add(value);
                            add_result.onerror = this.onErrorOccured.bind(this);
                            add_result.onsuccess = function (e) {
                                this.ValuesAffected.push(value);
                                insertDataintoTable(this._query.Values[value_index++]);
                            }.bind(this);
                        }
                    }.bind(this);
                }
                else {
                    insertDataintoTable = function (value) {
                        if (value) {
                            var add_result = object_store.add(value);
                            add_result.onerror = this.onErrorOccured.bind(this);
                            add_result.onsuccess = function (e) {
                                ++this._rowAffected;
                                insertDataintoTable(this._query.Values[value_index++]);
                            }.bind(this);
                        }
                    }.bind(this);
                }
                this._transaction = db_connection.transaction([this._query.Into], "readwrite");
                var object_store = this._transaction.objectStore(this._query.Into);
                this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                insertDataintoTable(this._query.Values[value_index++]);
            };
        }
    }
}
