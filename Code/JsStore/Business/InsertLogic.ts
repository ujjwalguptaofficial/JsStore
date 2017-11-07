module JsStore {
    export module Business {
        export class Insert extends InsertHelper {
            private insertData = function (values) {
                var That = this,
                    ValueIndex = 0,
                    IsReturn = this.Query.Return,
                    insertDataintoTable: Function;
                if (IsReturn) {
                    insertDataintoTable = function (value) {
                        if (value) {
                            var AddResult = ObjectStore.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            }
                            AddResult.onsuccess = function (e) {
                                That.ValuesAffected.push(value);
                                insertDataintoTable(values[ValueIndex++]);
                            }
                        }
                    }
                }
                else {
                    insertDataintoTable = function (value) {
                        if (value) {
                            var AddResult = ObjectStore.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            }
                            AddResult.onsuccess = function (e) {
                                ++That.RowAffected;
                                insertDataintoTable(values[ValueIndex++]);
                            }

                        }
                    }
                }
                That.Transaction = DbConnection.transaction([That.Query.Into], "readwrite");
                var ObjectStore = That.Transaction.objectStore(That.Query.Into);
                That.Transaction.oncomplete = function (e) {
                    That.onTransactionCompleted();
                }
                insertDataintoTable(values[ValueIndex++]);
            }

            constructor(query: IInsert, onSuccess: Function, onError: Function) {
                super();
                try {
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var Table = this.getTable(query.Into);
                    if (Table) {
                        if (this.Query.SkipDataCheck) {
                            this.insertData(this.Query.Values);
                            //remove values
                            this.Query.Values = undefined;
                        }
                        else {
                            this.checkModifyInsertValues(Table, this.Query.Values);
                            //remove values
                            this.Query.Values = undefined;
                        }
                    }
                    else {
                        var Error = Utils.getError(ErrorType.TableNotExist, { TableName: query.Into })
                        throwError(Error);
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }
        }
    }
}
